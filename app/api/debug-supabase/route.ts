import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 })
    }

    // Test query to fetch the most recent messages
    const { data, error } = await supabase
      .from("discord_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    if (error) {
      console.error("Supabase query error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return the data and connection info
    return NextResponse.json({
      success: true,
      connectionSuccessful: true,
      messageCount: data.length,
      recentMessages: data,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      // Don't include the full key, just a preview for debugging
      anonKeyPreview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...`
        : "not set",
      serviceRoleKeySet: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    })
  } catch (error) {
    console.error("Error in debug-supabase API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to Supabase",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
