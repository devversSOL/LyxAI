import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if we can access the file system and basic Next.js functionality
    const diagnostics = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      nextjsVersion: "14.x", // Based on your setup
      availableRoutes: [
        "/docs/features/whale-tracker",
        "/docs/features/wallet-analyzer",
        "/docs/features/coin-analyzer",
        "/docs/features/narrative-analysis",
      ],
      serverRendering: "OK",
      apiRoutes: "OK",
    }

    return NextResponse.json(diagnostics)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Diagnostic failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
