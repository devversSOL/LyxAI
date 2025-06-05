import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { parseWhaleActivity } from "@/app/services/discord-service"

export const dynamic = "force-dynamic" // No caching
export const revalidate = 0 // Revalidate at every request

export async function GET(request: Request) {
  const url = new URL(request.url)
  const channelId = url.searchParams.get("channelId") || process.env.DISCORD_WHALE_CHANNEL_ID
  const limit = Number.parseInt(url.searchParams.get("limit") || "50", 10)

  try {
    console.log("Fetching Discord messages from Supabase...")
    console.log("Channel ID:", channelId || "Not specified (using default)")

    // Try to get data from /api/new-message first
    try {
      console.log("Trying to fetch data from /api/new-message...")
      const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""
      const newMessageResponse = await fetch(`${baseUrl}/api/new-message`)

      if (newMessageResponse.ok) {
        const newMessageData = await newMessageResponse.json()
        console.log("Successfully fetched data from /api/new-message")

        if (newMessageData && Array.isArray(newMessageData) && newMessageData.length > 0) {
          console.log(`Found ${newMessageData.length} messages from /api/new-message`)

          // Convert to WhaleActivity format
          const whaleActivity = parseWhaleActivity(newMessageData)
          return NextResponse.json({ whaleActivity })
        }
      }
    } catch (err) {
      console.error("Error fetching from /api/new-message:", err)
      // Continue with the regular flow
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      console.error("Supabase client not initialized")
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 })
    }

    // Try both table names to see which one works
    let data
    let error

    try {
      // First try messages table
      const result = await supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(limit)

      data = result.data
      error = result.error

      if (error || !data || data.length === 0) {
        throw new Error("No data in messages table")
      }

      console.log("Successfully fetched data from messages table")
    } catch (err) {
      console.log("Trying discord_messages table instead...")
      // If that fails, try discord_messages table
      const result = await supabase
        .from("discord_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit)

      data = result.data
      error = result.error

      if (error) {
        console.error("Supabase query error:", error)
        return NextResponse.json({ error: `Failed to fetch messages from database: ${error.message}` }, { status: 500 })
      }

      console.log("Successfully fetched data from discord_messages table")
    }

    console.log(`Successfully fetched ${data?.length || 0} messages from Supabase`)

    if (data && data.length > 0) {
      console.log("Sample message:", JSON.stringify(data[0]).substring(0, 300))
    } else {
      console.log("No messages found in the database")
      return NextResponse.json({ whaleActivity: [] })
    }

    // Convert Supabase records to DiscordMessage format
    const messages =
      data?.map((record) => ({
        ...record, // Include all original fields
        id: record.id || record.message_id || String(Date.now()),
        content: record.content || "",
        timestamp: record.timestamp || record.created_at,
        author: {
          username: record.username || record.author_username || "Unknown",
          avatar: record.avatar_url,
        },
        embeds: record.embeds || [],
        attachments: record.attachments || [],
      })) || []

    console.log(`Converted ${messages.length} records to DiscordMessage format`)

    // Parse messages into whale activity format
    const whaleActivity = parseWhaleActivity(messages)

    console.log(`Parsed ${whaleActivity.length} whale activities`)

    if (whaleActivity.length > 0) {
      console.log("Sample whale activity:", JSON.stringify(whaleActivity[0]).substring(0, 300))
    }

    return NextResponse.json({ whaleActivity })
  } catch (error) {
    console.error("Error fetching Discord whale activity:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch Discord whale activity",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
