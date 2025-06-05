import { type NextRequest, NextResponse } from "next/server"
import { authenticate, rateLimit } from "../../middleware"
import { db } from "../../db"

export async function POST(req: NextRequest) {
  try {
    // Authenticate request
    const authResult = await authenticate(req)
    if ("status" in authResult) {
      return authResult
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(req, authResult.keyData)
    if ("status" in rateLimitResult) {
      return rateLimitResult
    }

    // Parse request body
    const body = await req.json()
    const { messages } = body

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
          message: "Messages array is required and must not be empty",
        },
        { status: 400, headers: rateLimitResult.headers },
      )
    }

    // Get the last user message
    const lastUserMessage = messages.filter((msg) => msg.role === "user").pop()?.content || ""

    // Generate response
    const response = await db.chat.generateResponse(lastUserMessage)

    // Return response
    return NextResponse.json(
      {
        success: true,
        response,
      },
      { headers: rateLimitResult.headers },
    )
  } catch (error: any) {
    console.error("Error in chat API:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
