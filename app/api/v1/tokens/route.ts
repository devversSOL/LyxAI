import { type NextRequest, NextResponse } from "next/server"
import { authenticate, rateLimit } from "../../middleware"
import { db } from "../../db"

export async function GET(req: NextRequest) {
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

    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("query") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

    // Get tokens
    let tokens = query ? db.tokens.search(query) : db.tokens.getAll()

    // Apply pagination
    const total = tokens.length
    tokens = tokens.slice(offset, offset + limit)

    // Return tokens
    return NextResponse.json(
      {
        success: true,
        data: {
          tokens,
          pagination: {
            total,
            limit,
            offset,
          },
        },
      },
      { headers: rateLimitResult.headers },
    )
  } catch (error: any) {
    console.error("Error in tokens API:", error)

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
