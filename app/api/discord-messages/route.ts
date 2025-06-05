import { NextResponse } from "next/server"

// In-memory storage for messages
let messages: any[] = []

export async function POST(request: Request) {
  console.log("POST request received at /api/discord-messages")

  try {
    // Log headers for debugging
    const headers = Object.fromEntries(request.headers.entries())
    console.log("Request headers:", JSON.stringify(headers, null, 2))

    // Parse the message data
    const data = await request.json()
    console.log("Received data:", JSON.stringify(data, null, 2))

    // Create a message object
    const message = {
      id: Date.now().toString(),
      username: data.username || "Unknown User",
      content: data.content || "",
      timestamp: new Date().toISOString(),
      attachments: data.attachments || [],
      embeds: data.embeds || [],
    }

    // Store the message
    messages.unshift(message)

    // Keep only the last 100 messages
    if (messages.length > 100) {
      messages = messages.slice(0, 100)
    }

    console.log("Message stored successfully")

    // Return success
    return NextResponse.json({
      success: true,
      message: "Message received",
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

export async function GET() {
  return NextResponse.json({ messages })
}
