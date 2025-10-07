import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { district, currentCrops, soilType, farmSize, season, goals } = await request.json()

    const prompt = `As an agricultural expert for Rwanda, provide specific crop recommendations based on the following farmer profile:

Location: ${district} district, Rwanda
Current Crops: ${currentCrops?.join(", ") || "Not specified"}
Soil Type: ${soilType || "Not specified"}
Farm Size: ${farmSize || "Not specified"} hectares
Season: ${season || "Current season"}
Goals: ${goals || "Maximize yield and income"}

Please provide:
1. Top 3 recommended crops for this location and conditions
2. Expected yield estimates for each crop
3. Market potential and pricing information
4. Specific farming practices and techniques
5. Risk factors and mitigation strategies
6. Timeline and seasonal considerations

Base your recommendations on Rwanda's agricultural data, climate patterns, and market conditions. Focus on practical, implementable advice.`

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt,
      maxOutputTokens: 1200,
      temperature: 0.6,
    })

    return Response.json({
      recommendations: text,
      district,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return Response.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
