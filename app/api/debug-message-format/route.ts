import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic" // No caching
export const revalidate = 0 // Revalidate at every request

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 })
    }

    // Get a sample message from the database
    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)

    if (messagesError) {
      return NextResponse.json(
        { error: `Failed to fetch from messages table: ${messagesError.message}` },
        { status: 500 },
      )
    }

    // Get the data from new-message endpoint for comparison
    const newMessageResponse = await fetch(
      `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""}/api/new-message`,
    )
    const newMessageData = await newMessageResponse.json()

    return NextResponse.json({
      sampleFromDatabase: messagesData[0],
      dataFromNewMessageEndpoint: newMessageData,
      explanation: "Compare these two data structures to see how they differ",
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to debug message format", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
