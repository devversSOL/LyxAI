import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

// Simple in-memory API key store (in production, use a database)
const API_KEYS = {
  "test-api-key-1": {
    id: "1",
    name: "Test API Key",
    permissions: ["read", "write"],
    rateLimit: 100,
  },
  // The actual API key from environment variables
  [process.env.SOLSCAN_API_KEY || ""]: {
    id: "2",
    name: "Production API Key",
    permissions: ["read", "write", "admin"],
    rateLimit: 1000,
  },
}

export async function authenticate(req: NextRequest) {
  // Get API key from header
  const headersList = headers()
  const apiKey = headersList.get("x-api-key") || ""

  // Check if API key exists
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Authentication failed",
        message: "API key is required",
      },
      { status: 401 },
    )
  }

  // Validate API key
  const keyData = API_KEYS[apiKey]
  if (!keyData) {
    return NextResponse.json(
      {
        error: "Authentication failed",
        message: "Invalid API key",
      },
      { status: 401 },
    )
  }

  // Return success with key data
  return { isAuthenticated: true, keyData }
}

// Rate limiting middleware (simple in-memory implementation)
const rateLimits: Record<string, { count: number; resetTime: number }> = {}

export async function rateLimit(req: NextRequest, keyData: any) {
  const keyId = keyData.id
  const now = Date.now()

  // Initialize rate limit data if not exists
  if (!rateLimits[keyId] || rateLimits[keyId].resetTime < now) {
    rateLimits[keyId] = {
      count: 0,
      resetTime: now + 60000, // Reset after 1 minute
    }
  }

  // Increment count
  rateLimits[keyId].count++

  // Check if rate limit exceeded
  if (rateLimits[keyId].count > keyData.rateLimit) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        message: "Too many requests, please try again later",
        resetAt: new Date(rateLimits[keyId].resetTime).toISOString(),
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": keyData.rateLimit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": Math.floor(rateLimits[keyId].resetTime / 1000).toString(),
        },
      },
    )
  }

  // Return rate limit headers
  return {
    headers: {
      "X-RateLimit-Limit": keyData.rateLimit.toString(),
      "X-RateLimit-Remaining": (keyData.rateLimit - rateLimits[keyId].count).toString(),
      "X-RateLimit-Reset": Math.floor(rateLimits[keyId].resetTime / 1000).toString(),
    },
  }
}
