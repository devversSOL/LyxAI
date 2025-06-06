import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Parse the incoming JSON data
    const data = await request.json()
    console.log("Received data:", JSON.stringify(data, null, 2))

    // Extract and map the fields to match your database schema
    const tokenData = {
      address: data.address,
      name: data.name,
      image_description: data.imageDescription,
      image_references: data.imageReferences || [],
      full_analysis: data.fullAnalysis,
      short_summary: data.shortSummary,
      bundle_analysis: data.bundleAnalysis,
      total_percentage: data.bundleAnalysis?.totalPercentage || null,
      risk_assessment: data.riskAssessment,
      risk_score: data.riskAssessment?.riskScore || null,
    }

    console.log("Mapped token data:", tokenData)

    // Insert or update the data in Supabase
    const { data: result, error } = await supabase
      .from("token_narratives")
      .upsert(tokenData, {
        onConflict: "address",
        ignoreDuplicates: false,
      })
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          error: "Failed to store data",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log("Successfully stored:", result)
    return NextResponse.json({
      success: true,
      message: "Token narrative stored successfully",
      data: result,
    })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Also handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: "POST to this endpoint to store token narrative data",
    endpoint: "/api/store-narrative",
    method: "POST",
    expectedFormat: {
      address: "string",
      name: "string",
      imageDescription: "string",
      imageReferences: ["array of strings"],
      fullAnalysis: "string",
      shortSummary: "string",
      bundleAnalysis: "object",
      riskAssessment: "object",
    },
  })
}
