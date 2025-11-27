import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Simple CSV parser function
function parseCSV(content: string): any[] {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''));
    
    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx];
      });
      rows.push(row);
    }
  }
  
  return rows;
}

// Load and cache nutrition data
let nutritionDataCache: any[] | null = null;
let surveyDataCache: any[] | null = null;

function loadNutritionData() {
  if (nutritionDataCache) return nutritionDataCache;
  
  try {
    const filePath = path.join(process.cwd(), "data", "nutrition_indicators_rwa.csv");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    nutritionDataCache = parseCSV(fileContent);
    return nutritionDataCache;
  } catch (error) {
    console.error("Error loading nutrition data:", error);
    return [];
  }
}

function loadSurveyData() {
  if (surveyDataCache) return surveyDataCache;
  
  try {
    const filePath = path.join(process.cwd(), "data", "search-10-09-25-050154.csv");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    surveyDataCache = parseCSV(fileContent);
    return surveyDataCache;
  } catch (error) {
    console.error("Error loading survey data:", error);
    return [];
  }
}

function searchRelevantData(query: string, maxResults: number = 8): string {
  const nutritionData = loadNutritionData();
  const surveyData = loadSurveyData();
  
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(" ").filter(w => w.length > 3);
  
  // Add regional/residence keywords if detected in query
  const regionalKeywords = ["rural", "urban", "province", "district", "kigali", "city", "village", "area"];
  const hasRegionalQuery = regionalKeywords.some(rk => queryLower.includes(rk));
  
  // Search nutrition indicators with enhanced dimension and regional filtering
  const relevantNutrition = nutritionData
    .map((row: any) => {
      let score = 0;
      const searchText = `${row["GHO (DISPLAY)"]} ${row["DIMENSION (NAME)"]} ${row["DIMENSION (CODE)"]} ${row["YEAR (DISPLAY)"]}`.toLowerCase();
      
      keywords.forEach(keyword => {
        if (searchText.includes(keyword)) score++;
      });
      
      // Boost score for recent years (2018+)
      const year = parseInt(row["YEAR (DISPLAY)"]);
      if (year >= 2018) score += 2;
      else if (year >= 2015) score += 1;
      
      // Boost score for regional dimension matches
      if (hasRegionalQuery) {
        regionalKeywords.forEach(rk => {
          if (searchText.includes(rk)) score += 3;
        });
      }
      
      return { row, score, type: "nutrition" };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
  
  // Search surveys
  const relevantSurveys = surveyData
    .map((row: any) => {
      let score = 0;
      const searchText = `${row["titl"]} ${row["authenty"]}`.toLowerCase();
      
      keywords.forEach(keyword => {
        if (searchText.includes(keyword)) score++;
      });
      
      return { row, score, type: "survey" };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  
  // Format context with enhanced dimension details
  let context = "NISR RWANDA DATA:\n\n";
  
  if (relevantNutrition.length > 0) {
    context += "NUTRITION INDICATORS:\n";
    relevantNutrition.forEach((item: any, idx: number) => {
      const row = item.row;
      context += `${idx + 1}. ${row["GHO (DISPLAY)"]} (${row["YEAR (DISPLAY)"]})\n`;
      if (row["DIMENSION (NAME)"]) {
        context += `   - Category: ${row["DIMENSION (NAME)"]}\n`;
      }
      context += `   - Value: ${row["Value"]}\n`;
      if (row["Low"] && row["High"]) {
        context += `   - Confidence Range: ${row["Low"]} - ${row["High"]}\n`;
      }
      context += "\n";
    });
  }
  
  if (relevantSurveys.length > 0) {
    context += "\nNISR SURVEYS:\n";
    relevantSurveys.forEach((item: any, idx: number) => {
      const row = item.row;
      context += `${idx + 1}. ${row["titl"]}\n`;
      context += `   - Authority: ${row["authenty"]}\n`;
      if (row["data_coll_start"]) context += `   - Period: ${row["data_coll_start"]} - ${row["data_coll_end"]}\n`;
      context += "\n";
    });
  }
  
  return context || "No relevant NISR data found for this query.";
}

function isRwandaRelated(query: string): boolean {
  const queryLower = query.toLowerCase();
  const rwandaKeywords = [
    "rwanda", "rwandan", "kigali", "nisr",
    "stunting", "wasting", "nutrition", "malnutrition", "anemia", "anaemia",
    "breastfeeding", "micronutrient", "hunger", "food security",
    "dhs", "eicv", "survey", "health", "children", "vitamin",
    "iron", "zinc", "feeding", "diet", "maternal", "infant",
    "underweight", "overweight", "growth", "development"
  ];
  
  return rwandaKeywords.some(keyword => queryLower.includes(keyword));
}

function isNISRTopicRelated(query: string): boolean {
  const queryLower = query.toLowerCase();
  
  // Check if query is about NISR dataset topics
  const nisrTopics = [
    "stunting", "wasting", "nutrition", "malnutrition", "anemia", "anaemia",
    "breastfeeding", "micronutrient", "hunger", "food", "health", 
    "survey", "dhs", "eicv", "children", "vitamin", "iron", "zinc",
    "feeding", "diet", "maternal", "infant", "child", "pregnancy",
    "underweight", "overweight", "growth", "development", "household",
    "agriculture", "demographic", "statistics", "indicator"
  ];
  
  // Check if query contains NISR-related topics
  const hasNISRTopic = nisrTopics.some(topic => queryLower.includes(topic));
  
  // Check for unrelated topics
  const unrelatedTopics = [
    "weather", "climate", "temperature", "rain", "forecast",
    "sport", "football", "soccer", "basketball", "tennis",
    "politics", "election", "president", "government", "parliament",
    "tourism", "hotel", "travel", "vacation", "safari",
    "economy", "gdp", "inflation", "currency", "stock",
    "entertainment", "movie", "music", "celebrity", "concert",
    "technology", "phone", "computer", "internet", "software"
  ];
  
  const hasUnrelatedTopic = unrelatedTopics.some(topic => queryLower.includes(topic));
  
  if (hasUnrelatedTopic) {
    return false;
  }
  
  return hasNISRTopic;
}

function isOutOfScope(query: string): boolean {
  const queryLower = query.toLowerCase();
  
  // List of other countries and regions
  const otherCountries = [
    "zambia", "zimbabwe", "uganda", "kenya", "tanzania", "burundi", 
    "congo", "drc", "ethiopia", "somalia", "sudan", "malawi", "mozambique",
    "south africa", "nigeria", "ghana", "senegal", "mali", "niger",
    "usa", "america", "united states", "china", "india", "japan",
    "europe", "asia", "australia", "canada", "mexico", "brazil"
  ];
  
  // Check if query mentions other countries
  for (const country of otherCountries) {
    if (queryLower.includes(country)) {
      return true;
    }
  }
  
  // Check if query is explicitly about Rwanda - if not and no NISR keywords, reject
  const hasRwandaKeyword = queryLower.includes("rwanda") || 
                          queryLower.includes("rwandan") || 
                          queryLower.includes("kigali") ||
                          queryLower.includes("nisr");
  
  const hasNutritionKeyword = queryLower.includes("stunting") ||
                             queryLower.includes("wasting") ||
                             queryLower.includes("nutrition") ||
                             queryLower.includes("malnutrition") ||
                             queryLower.includes("anemia") ||
                             queryLower.includes("anaemia") ||
                             queryLower.includes("breastfeeding") ||
                             queryLower.includes("micronutrient");
  
  // If it has nutrition keywords but no Rwanda keyword, it might be about another country
  if (hasNutritionKeyword && !hasRwandaKeyword) {
    return true; // Reject - asking about nutrition but not specifically Rwanda
  }
  
  return false;
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required and must be a string" },
        { status: 400 }
      );
    }
    
    if (query.length > 1000) {
      return NextResponse.json(
        { error: "Query too long (max 1000 characters)" },
        { status: 400 }
      );
    }
    
    // FIRST: Check if out of scope - this must happen BEFORE any data search
    if (isOutOfScope(query)) {
      return NextResponse.json({
        answer: "I can only answer questions about RWANDA based on official NISR (National Institute of Statistics of Rwanda) datasets. I do not have data about other countries like Zambia, Kenya, Uganda, or any others. Please ask specifically about Rwanda's nutrition, health, or survey data.",
        sources: [],
        dataUsed: false,
        isRelevant: false
      });
    }
    
    // SECOND: Ensure question explicitly mentions Rwanda
    const queryLower = query.toLowerCase();
    const mentionsRwanda = queryLower.includes("rwanda") || 
                          queryLower.includes("rwandan") || 
                          queryLower.includes("kigali") ||
                          queryLower.includes("nisr");
    
    if (!mentionsRwanda) {
      return NextResponse.json({
        answer: "Please specify that you're asking about RWANDA. I can only provide information about Rwanda based on NISR (National Institute of Statistics of Rwanda) datasets. For example, ask: 'What is the stunting rate in Rwanda?'",
        sources: [],
        dataUsed: false,
        isRelevant: false
      });
    }
    
    // THIRD: Ensure question is about NISR dataset topics
    if (!isNISRTopicRelated(query)) {
      return NextResponse.json({
        answer: "I can only answer questions related to NISR (National Institute of Statistics of Rwanda) datasets, which cover:\n\n✓ Nutrition indicators (stunting, wasting, anemia, micronutrient deficiencies)\n✓ Health surveys (DHS, EICV)\n✓ Breastfeeding and feeding practices\n✓ Child health and development\n✓ Demographic and household data\n\nYour question appears to be about a topic outside these datasets. Please ask about Rwanda's nutrition, health, or survey data.",
        sources: [],
        dataUsed: false,
        isRelevant: false
      });
    }
    
    // Search for relevant data
    const contextData = searchRelevantData(query);
    
    // If no relevant data found
    if (contextData.includes("No relevant NISR data")) {
      return NextResponse.json({
        answer: "I don't have NISR data to answer that specific question. My responses are based on official NISR datasets covering nutrition indicators and survey metadata from Rwanda. Please ask about topics like stunting, wasting, anemia, breastfeeding, or NISR surveys.",
        sources: [],
        dataUsed: false,
        isRelevant: isRwandaRelated(query)
      });
    }
    
    // Generate AI response with strict prompt
    const systemPrompt = `You are an AI assistant for Ubuzima Hub, specialized ONLY in Rwanda's nutrition and health data.

CRITICAL RULES - FOLLOW STRICTLY:
1. You can ONLY answer about RWANDA using NISR (National Institute of Statistics of Rwanda) datasets
2. If the question mentions ANY other country (Zambia, Kenya, Uganda, etc.), IMMEDIATELY respond: "I can only provide information about RWANDA based on NISR datasets. I do not have data about other countries."
3. NEVER provide data or statistics about countries other than Rwanda
4. NEVER make up statistics - only use data from the context provided
5. Always cite the year and source (NISR) in your response
6. If the context doesn't contain enough information about RWANDA, say so clearly
7. Keep responses concise (2-4 paragraphs)

When answering about RWANDA:
- Start with the direct answer citing Rwanda specifically
- Use only the data from the NISR context provided
- Cite specific years and values from the data
- Mention dimensions (age group, gender, residence type: rural/urban, wealth quintile) if available
- Include data ranges (low-high) when provided for confidence intervals
- When asked about specific regions/areas, focus on Rural vs Urban data if available
- Compare trends across years when multiple time points exist
- Provide actionable recommendations based on the data patterns

For regional/district analysis:
- Note that data is categorized by Rural vs Urban residence type
- If specific province/district data isn't available, explain the available breakdowns
- Use available dimensional data (wealth quintile, education level) as proxy indicators

For predictive analysis:
- Identify trends from historical data (comparing multiple years)
- Note improvement rates or deterioration patterns
- Project likely outcomes if current trends continue
- Recommend interventions based on data patterns

If asked about any other country: Politely decline and redirect to Rwanda.`;

    const userPrompt = `Context from NISR datasets (RWANDA ONLY):

${contextData}

User Question: ${query}

IMPORTANT: You can ONLY answer about RWANDA. If this question is about any other country, respond: "I can only provide information about RWANDA based on NISR datasets. I do not have data about other countries."

Otherwise, provide a clear, factual answer about RWANDA based ONLY on the context above. Cite sources and years. If the context doesn't fully answer the question about Rwanda, say what information is available and what's missing.`;

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1, // Low temperature for factual responses
    });
    
    return NextResponse.json({
      answer: text,
      sources: [
        {
          name: "NISR Nutrition Indicators",
          type: "nutrition_data"
        },
        {
          name: "NISR Survey Catalog", 
          type: "survey_metadata"
        }
      ],
      dataUsed: true,
      isRelevant: true
    });
    
  } catch (error: any) {
    console.error("NISR AI error:", error);
    
    return NextResponse.json(
      {
        error: "Failed to process request",
        message: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const nutritionCount = loadNutritionData().length;
  const surveyCount = loadSurveyData().length;
  
  return NextResponse.json({
    message: "NISR AI Chatbot - Rwanda Nutrition Data",
    description: "Ask questions about Rwanda's nutrition and health data from NISR",
    datasetStats: {
      nutritionIndicators: nutritionCount,
      surveys: surveyCount,
      total: nutritionCount + surveyCount
    },
    usage: "POST with { query: 'your question' }",
    examples: [
      "What is the stunting rate in Rwanda?",
      "Show me anemia prevalence data",
      "What surveys has NISR conducted about nutrition?"
    ]
  });
}
