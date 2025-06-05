import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "API key is not defined" }, { status: 500 })
    }

    // Log the first few characters of the API key for debugging (never log the full key)
    const keyPrefix = apiKey.substring(0, 7) + "..." + apiKey.substring(apiKey.length - 4)
    console.log(`Testing OpenAI API key: ${keyPrefix}`)

    // Make a simple models list request to test the API key
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenAI API Error:", errorData)
      return NextResponse.json(
        {
          success: false,
          error: "API key validation failed",
          details: errorData.error?.message || "Unknown error",
          status: response.status,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      message: "API key is valid",
      models_count: data.data?.length || 0,
    })
  } catch (error: any) {
    console.error("Error testing OpenAI API key:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error testing API key",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
