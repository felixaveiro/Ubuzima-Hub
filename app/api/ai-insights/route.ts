import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

// Check if question is about other countries
function isAboutOtherCountry(text: string): boolean {
  if (!text) return false;
  
  const textLower = text.toLowerCase();
  const otherCountries = [
    "burundi", "zambia", "zimbabwe", "uganda", "kenya", "tanzania", 
    "congo", "drc", "ethiopia", "somalia", "sudan", "malawi", "mozambique",
    "south africa", "nigeria", "ghana", "senegal", "mali", "niger",
    "usa", "america", "united states", "china", "india", "japan",
    "europe", "asia", "australia", "canada", "mexico", "brazil"
  ];
  
  return otherCountries.some(country => textLower.includes(country));
}

// Check if question is about NISR dataset topics
function isNISRTopicRelated(text: string): boolean {
  if (!text) return true; // Allow if no specific question
  
  const textLower = text.toLowerCase();
  
  // NISR dataset topics
  const nisrTopics = [
    "stunting", "wasting", "nutrition", "malnutrition", "anemia", "anaemia",
    "breastfeeding", "micronutrient", "hunger", "food", "health", 
    "survey", "dhs", "eicv", "children", "vitamin", "iron", "zinc",
    "feeding", "diet", "maternal", "infant", "child", "pregnancy",
    "underweight", "overweight", "growth", "development", "household",
    "agriculture", "demographic", "statistics", "indicator", "poverty"
  ];
  
  const hasNISRTopic = nisrTopics.some(topic => textLower.includes(topic));
  
  // Unrelated topics
  const unrelatedTopics = [
    "weather", "climate", "temperature", "rain", "forecast",
    "sport", "football", "soccer", "basketball", "tennis",
    "politics", "election", "president", "government", "parliament",
    "tourism", "hotel", "travel", "vacation", "safari",
    "gdp", "inflation", "currency", "stock", "finance", "banking",
    "entertainment", "movie", "music", "celebrity", "concert",
    "technology", "phone", "computer", "internet", "software"
  ];
  
  const hasUnrelatedTopic = unrelatedTopics.some(topic => textLower.includes(topic));
  
  if (hasUnrelatedTopic) {
    return false;
  }
  
  return hasNISRTopic;
}

export async function POST(req: Request) {
  try {
    const { question, category, region, regionalProfile, cropData, foodSecurity, marketPrices, context } =
      await req.json()

    // Check if question is about other countries
    if (question && isAboutOtherCountry(question)) {
      return Response.json({ 
        insight: "⚠️ **Rwanda-Only Analysis**\n\nI can only provide analysis and insights about **RWANDA** based on NISR (National Institute of Statistics of Rwanda) datasets.\n\nI do not have data about other countries such as Burundi, Kenya, Uganda, Zambia, or any others.\n\n**Please ask questions specifically about Rwanda's nutrition, health, or development data.**\n\nExamples:\n- \"What are the root causes of micronutrient deficiencies in Rwanda?\"\n- \"What is the stunting rate in Rwanda's provinces?\"\n- \"How can Rwanda reduce malnutrition?\"" 
      })
    }
    
    // Check if question is about NISR dataset topics
    if (question && !isNISRTopicRelated(question)) {
      return Response.json({
        insight: "⚠️ **NISR Dataset Topics Only**\n\nI can only answer questions related to NISR (National Institute of Statistics of Rwanda) datasets, which cover:\n\n✓ **Nutrition & Health**: Stunting, wasting, anemia, micronutrient deficiencies\n✓ **Surveys**: DHS (Demographic Health Survey), EICV (Household Living Conditions)\n✓ **Child Development**: Breastfeeding, feeding practices, child growth\n✓ **Demographics**: Household data, population statistics\n✓ **Food Security**: Agricultural data, nutrition indicators\n\n**Your question appears to be about a topic outside these datasets** (e.g., weather, sports, politics, tourism, economy, technology).\n\n**Please ask about Rwanda's nutrition, health, demographics, or survey data.**"
      })
    }

    let prompt = ""

    if (question) {
      const regionContext = regionalProfile
        ? `
REGIONAL FOCUS: ${regionalProfile.name}
- Population: ${regionalProfile.population}
- Current Stunting Rate: ${regionalProfile.stuntingRate}
- Key Issues: ${regionalProfile.keyIssues.join(", ")}
- Priority Intervention: ${regionalProfile.priority}
`
        : "NATIONAL OVERVIEW: All provinces of Rwanda"

      prompt = `You are Rwanda's leading nutrition AI analyst for "Ending Hidden Hunger" (Track 2). 

CRITICAL INSTRUCTION: You can ONLY analyze and provide insights about RWANDA. If any question mentions another country, respond with: "I can only provide analysis about RWANDA based on NISR datasets."

${regionContext}

QUESTION ABOUT RWANDA: ${question}

ANALYSIS PARAMETERS:
- Category: ${category || "malnutrition-hotspots"}
- Geographic Scope: ${region === "all" ? "National comprehensive analysis" : `${regionalProfile?.name} specific analysis`}
- Analysis Depth: ${context || "advanced_regional_analysis"}

RWANDA NUTRITION INTELLIGENCE:
${
  region === "all"
    ? `
NATIONAL OVERVIEW:
- Child stunting: 33% national average (varies 25%-38% by province)
- Micronutrient deficiencies: Iron 38%, Vitamin A 28%, Zinc 42%
- Hidden hunger affects 2.1M people across all provinces
- Rural-urban malnutrition disparities significant
`
    : `
PROVINCIAL DEEP-DIVE:
- ${regionalProfile?.name}: ${regionalProfile?.stuntingRate} stunting rate
- Specific challenges: ${regionalProfile?.keyIssues.join(", ")}
- Population at risk: ${regionalProfile?.population}
- Intervention priority: ${regionalProfile?.priority}
`
}

REQUIRED ANALYSIS COMPONENTS:
1. **Situation Analysis**: Current malnutrition status and trends
2. **Root Cause Analysis**: Health, agricultural, socioeconomic factors
3. **Risk Mapping**: Identify highest-risk communities/districts
4. **Evidence-Based Interventions**: Specific, actionable recommendations
5. **Cross-Sector Strategy**: Health, agriculture, education integration
6. **Implementation Roadmap**: Phased approach with timelines
7. **Success Metrics**: Measurable outcomes and monitoring indicators

FOCUS: Provide actionable intelligence about RWANDA ONLY for immediate implementation by health workers, nutritionists, district officials, and community leaders. Never provide information about other countries.`
    } else {
      prompt = `You are Rwanda's nutrition AI analyst. IMPORTANT: You can ONLY analyze RWANDA. Never provide data about other countries.

Conduct comprehensive malnutrition analysis for RWANDA:

GEOGRAPHIC SCOPE: ${region === "all" ? "National Analysis" : `${regionalProfile?.name} Provincial Analysis`}

${
  regionalProfile
    ? `
PROVINCIAL PROFILE:
- Region: ${regionalProfile.name}
- Population: ${regionalProfile.population}
- Stunting Rate: ${regionalProfile.stuntingRate}
- Key Challenges: ${regionalProfile.keyIssues.join(", ")}
- Priority: ${regionalProfile.priority}
`
    : "NATIONAL COMPREHENSIVE ANALYSIS"
}

DATA SOURCES:
- Nutrition Data: ${JSON.stringify(foodSecurity)}
- Agricultural Data: ${JSON.stringify(cropData)}
- Market Data: ${JSON.stringify(marketPrices)}

ANALYSIS REQUIREMENTS:
1. **Malnutrition Hotspot Mapping**: Identify critical intervention zones
2. **Predictive Risk Modeling**: Communities at highest future risk
3. **Intervention Impact Analysis**: Most effective strategies by location
4. **Resource Allocation Optimization**: Priority districts for immediate action
5. **Cross-Sector Integration**: Agriculture-nutrition-health linkages
6. **Policy Implementation Roadmap**: District-level action plans

Provide evidence-based recommendations for combating hidden hunger with specific focus on ${region === "all" ? "national coordination" : `${regionalProfile?.name} provincial priorities`}.`
    }

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      maxOutputTokens: 2000, // Increased for more comprehensive analysis
      temperature: 0.6, // Slightly lower for more focused analysis
    })

    return Response.json({ insight: text })
  } catch (error) {
    console.error("Error generating AI insight:", error)
    return Response.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
