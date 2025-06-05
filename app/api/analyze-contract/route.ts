import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    // Use OPENAI_API_KEY (without NEXT_PUBLIC_ prefix) for server-side API calls
    const apiKey = process.env.OPENAI_API_KEY

    // Check if API key exists
    if (!apiKey) {
      console.error("OpenAI API key is not defined in environment variables")
      return NextResponse.json(
        { error: "OpenAI API key is missing. Please check your environment variables." },
        { status: 500 },
      )
    }

    const { messages } = await req.json()

    // Log that we're about to make the API call
    console.log("Making direct fetch call to OpenAI API for contract analysis...")

    // Create the request payload
    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a Solana contract analyzer with deep knowledge of crypto trends, meme coins, and social media. Your job is to provide SPECIFIC information about tokens, including their viral status, associated influencers, and reasons for price movement. Be direct and specific, not generic. Provide actual names of X/Twitter accounts when possible. Focus on giving concrete information rather than general cautions.",
        },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 800,
    }

    // Make the API call using fetch with additional options
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`, // Trim to remove any extra spaces
      },
      body: JSON.stringify(payload),
    })

    // Check for errors
    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenAI API Error Response:", errorData)
      return NextResponse.json(
        {
          error: "Failed to generate response",
          details: errorData.error?.message || "Unknown API error",
        },
        { status: response.status },
      )
    }

    // Parse the response
    const data = await response.json()

    // Extract the response text
    const text = data.choices[0]?.message?.content || "I couldn't analyze this contract. Please try again."

    // Log successful response
    console.log("Successfully received OpenAI response for contract analysis")

    return NextResponse.json({ response: text })
  } catch (error: any) {
    // Detailed error logging
    console.error("Error in contract analyzer API:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    })

    // Return a more detailed error message
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error.message,
        suggestion: "Please check your API key configuration and network connection.",
      },
      { status: 500 },
    )
  }
}
