import { type NextRequest, NextResponse } from "next/server"
import { authenticate, rateLimit } from "../../../middleware"
import { db } from "../../../db"

export async function GET(req: NextRequest, { params }: { params: { address: string } }) {
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

    const { address } = params

    // Get social data
    const socialData = db.social.getByAddress(address)

    if (!socialData) {
      return NextResponse.json(
        {
          success: false,
          error: "Social data not found",
          message: "No social data available for this token",
        },
        { status: 404, headers: rateLimitResult.headers },
      )
    }

    // Return social data
    return NextResponse.json(
      {
        success: true,
        data: socialData,
      },
      { headers: rateLimitResult.headers },
    )
  } catch (error: any) {
    console.error("Error in token-social API:", error)

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
