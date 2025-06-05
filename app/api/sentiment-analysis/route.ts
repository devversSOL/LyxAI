import { NextResponse } from "next/server"
import { OpenAI } from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { text, tokenSymbol, tokenName, sources } = await req.json()

    if (!text || !tokenSymbol) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Combine all text data for analysis
    const combinedText = Array.isArray(text) ? text.join("\n\n") : text

    // Create a prompt for narrative analysis
    const narrativePrompt = `
    Analyze the following text related to the cryptocurrency ${tokenName || tokenSymbol} and provide a comprehensive narrative analysis:

    ${combinedText}

    Provide your analysis in the following JSON format:
    {
      "summary": "A 2-3 sentence summary of the token's narrative",
      "narrativeScore": {
        "overall": "A score from 1-10",
        "originality": "A score from 1-10",
        "timeliness": "A score from 1-10",
        "coherence": "A score from 1-10",
        "sustainability": "A score from 1-10",
        "resonance": "A score from 1-10"
      },
      "culturalContext": {
        "description": "A paragraph about the cultural significance",
        "references": ["key reference 1", "key reference 2"]
      },
      "memeticAnalysis": {
        "viralityScore": "A score from 1-10",
        "spreadFactors": ["factor 1", "factor 2"],
        "barriers": ["barrier 1", "barrier 2"]
      },
      "keyThemes": ["theme 1", "theme 2", "theme 3"]
    }
    `

    // Call OpenAI API for narrative analysis
    const narrativeResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert cryptocurrency analyst specializing in narrative and sentiment analysis. Your task is to analyze text data and extract meaningful insights about cryptocurrency narratives, cultural context, and memetic potential.",
        },
        {
          role: "user",
          content: narrativePrompt,
        },
      ],
      response_format: { type: "json_object" },
    })

    // Parse the response
    const narrativeAnalysis = JSON.parse(narrativeResponse.choices[0].message.content)

    // Return the analysis
    return NextResponse.json({
      success: true,
      analysis: narrativeAnalysis,
      sources: sources || "Not specified",
    })
  } catch (error: any) {
    console.error("Error in sentiment analysis:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to analyze sentiment",
      },
      { status: 500 },
    )
  }
}
