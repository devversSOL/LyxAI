import { NextResponse } from "next/server"
import { type DiscordMessage, parseWhaleActivity } from "@/app/services/discord-service"

// This is a simple in-memory store for received webhook messages
// In a production app, you'd use a database instead
let receivedMessages: DiscordMessage[] = []

export async function POST(request: Request) {
  try {
    // Verify the request is coming from Discord (optional but recommended)
    // You would typically check a signature or token here

    // Parse the webhook payload
    const payload = await request.json()

    // Log the received webhook for debugging
    console.log("Received Discord webhook:", JSON.stringify(payload).substring(0, 200) + "...")

    // Process the message based on the type of webhook
    // Discord sends different types of payloads depending on the event
    if (payload.type === 1) {
      // This is a ping from Discord to verify the webhook endpoint
      return NextResponse.json({ type: 1 })
    }

    // For a message webhook
    if (payload.content || (payload.embeds && payload.embeds.length > 0)) {
      // Convert the webhook payload to our DiscordMessage format
      const message: DiscordMessage = {
        id: payload.id || `webhook-${Date.now()}`,
        content: payload.content || "",
        timestamp: payload.timestamp || new Date().toISOString(),
        author: {
          username: payload.author?.username || payload.username || "Discord Webhook",
          avatar: payload.author?.avatar_url || payload.avatar_url,
        },
        embeds: payload.embeds,
      }

      // Store the message
      receivedMessages.unshift(message) // Add to the beginning of the array

      // Keep only the last 100 messages to prevent memory issues
      if (receivedMessages.length > 100) {
        receivedMessages = receivedMessages.slice(0, 100)
      }

      return NextResponse.json({ success: true, message: "Webhook received and processed" })
    }

    // Default response for other webhook types
    return NextResponse.json({ success: true, message: "Webhook received" })
  } catch (error) {
    console.error("Error processing Discord webhook:", error)
    return NextResponse.json(
      { error: "Failed to process webhook", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // Parse the stored messages into whale activity
    const whaleActivity = parseWhaleActivity(receivedMessages)

    // Return both the raw messages and the parsed activity
    return NextResponse.json({
      success: true,
      messages: receivedMessages,
      whaleActivity,
    })
  } catch (error) {
    console.error("Error retrieving webhook messages:", error)
    return NextResponse.json(
      { error: "Failed to retrieve webhook messages", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
