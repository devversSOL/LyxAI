import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  console.log("POST request received at /api/new-message")

  try {
    // Check authorization
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Authorization failed: Invalid header format")
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    if (token !== process.env.DISCORD_TO_VERCEL_SECRET) {
      console.log("Authorization failed: Token mismatch")
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    // Parse the message data
    const data = await request.json()
    console.log("Received message data:", JSON.stringify(data))

    // Validate the message data
    if (!data.username || !data.content) {
      console.log("Invalid message format - missing username or content")
      return NextResponse.json({ error: "Invalid message format - missing username or content" }, { status: 400 })
    }

    // Create a message object with timestamp
    const message = {
      id: Date.now().toString(),
      username: data.username,
      content: data.content,
      timestamp: new Date().toISOString(),
      attachments: data.attachments || [],
      embeds: data.embeds || [],
    }

    // Get Supabase admin client
    const supabaseAdmin = getSupabaseAdmin()

    // Store the message in Supabase
    const { error } = await supabaseAdmin.from("discord_messages").insert([message])

    if (error) {
      console.error("Error storing message in Supabase:", error)
      return NextResponse.json(
        {
          error: "Failed to store message in database",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log("Message stored successfully in Supabase")

    // Return success
    return NextResponse.json({
      success: true,
      message: "Message received and stored successfully",
      messageId: message.id,
    })
  } catch (error) {
    console.error("Error processing message:", error)
    return NextResponse.json(
      {
        error: "Error processing message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    // Get search query
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")?.toLowerCase()

    // Get Supabase admin client
    const supabaseAdmin = getSupabaseAdmin()

    // Query Supabase for messages
    let query = supabaseAdmin.from("discord_messages").select("*").order("timestamp", { ascending: false }).limit(100)

    // Add search filter if provided
    if (search) {
      query = query.or(`content.ilike.%${search}%,username.ilike.%${search}%`)
      console.log(`Searching for messages containing "${search}"`)
    }

    const { data: messages, error } = await query

    if (error) {
      console.error("Error fetching messages from Supabase:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch messages from database",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log(`Retrieved ${messages?.length || 0} messages from Supabase`)
    return NextResponse.json({
      messages: messages || [],
    })
  } catch (error) {
    console.error("Error retrieving messages:", error)
    return NextResponse.json(
      {
        error: "Error retrieving messages",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
