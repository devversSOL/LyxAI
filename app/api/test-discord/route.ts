import { NextResponse } from "next/server"

// Add this line to force dynamic rendering
export const dynamic = "force-dynamic"

export async function GET() {
  const channelId = process.env.DISCORD_WHALE_CHANNEL_ID
  const token = process.env.DISCORD_BOT_TOKEN

  // Check if environment variables are set
  if (!channelId || !token) {
    return NextResponse.json(
      {
        error: "Missing environment variables",
        channelIdExists: !!channelId,
        tokenExists: !!token,
        message: "Please ensure both DISCORD_BOT_TOKEN and DISCORD_WHALE_CHANNEL_ID are set in your .env.local file",
      },
      { status: 400 },
    )
  }

  try {
    console.log(`Attempting to fetch messages from Discord channel: ${channelId}`)

    // Attempt to fetch messages from Discord
    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages?limit=10`, {
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Discord API error: ${response.status}`, errorText)

      let errorMessage = `Discord API error: ${response.status}`

      // Provide more helpful messages for common error codes
      if (response.status === 401) {
        errorMessage = "Authentication failed. Your Discord bot token is invalid or expired."
      } else if (response.status === 403) {
        errorMessage = "Permission denied. Your bot doesn't have access to this channel."
      } else if (response.status === 404) {
        errorMessage = "Channel not found. The channel ID may be incorrect or the bot is not in the server."
      } else if (response.status === 429) {
        errorMessage = "Rate limited by Discord. Try again later."
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: errorText,
          channelId,
        },
        { status: response.status },
      )
    }

    // Process successful response
    const messages = await response.json()

    // Extract useful information from messages
    const messageInfo = messages.map((msg: any) => ({
      id: msg.id,
      content: msg.content.substring(0, 100) + (msg.content.length > 100 ? "..." : ""),
      author: msg.author.username,
      timestamp: msg.timestamp,
      hasEmbeds: msg.embeds && msg.embeds.length > 0,
      embedCount: msg.embeds ? msg.embeds.length : 0,
    }))

    return NextResponse.json({
      success: true,
      messageCount: messages.length,
      channelId,
      messages: messageInfo,
    })
  } catch (error) {
    console.error("Error fetching Discord messages:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch Discord messages",
        details: error instanceof Error ? error.message : String(error),
        channelId,
      },
      { status: 500 },
    )
  }
}
