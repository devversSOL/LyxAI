import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

// Add this line to force dynamic rendering
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchQuery = request.nextUrl.searchParams.get("q")
    if (!searchQuery || searchQuery.trim() === "") {
      return NextResponse.json({ tokens: [] })
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Check if the search query looks like an address
    const isAddressSearch = searchQuery.length > 30

    let query = supabase.from("token_narratives").select("*")

    if (isAddressSearch) {
      // Search by address (exact or partial match)
      query = query.ilike("address", `%${searchQuery}%`)
    } else {
      // Search by name
      query = query.ilike("name", `%${searchQuery}%`)
    }

    // Add ordering and limit
    const { data: tokens, error } = await query.order("created_at", { ascending: false }).limit(20)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          error: "Failed to search tokens",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      count: tokens?.length || 0,
      tokens: tokens || [],
    })
  } catch (error) {
    console.error("Error searching tokens:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
