import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { question, category, region, regionalProfile, cropData, foodSecurity, marketPrices, context } =
      await req.json()

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

      prompt = `As Rwanda's leading nutrition AI analyst for "Ending Hidden Hunger" (Track 2), provide an advanced, evidence-based analysis:

${regionContext}

QUESTION: ${question}

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

FOCUS: Provide actionable intelligence for immediate implementation by health workers, nutritionists, district officials, and community leaders.`
    } else {
      prompt = `As Rwanda's nutrition AI analyst, conduct comprehensive malnutrition analysis:

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
