import { NextResponse } from "next/server"

export async function GET() {
  const token = process.env.DISCORD_BOT_TOKEN

  if (!token) {
    return NextResponse.json(
      {
        error: "Discord bot token is not set",
        suggestion: "Add DISCORD_BOT_TOKEN to your .env.local file",
      },
      { status: 400 },
    )
  }

  try {
    // Try to get the bot's own information as a simple validity check
    const response = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bot ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()

      if (response.status === 401) {
        return NextResponse.json(
          {
            error: "Invalid Discord bot token",
            status: response.status,
            details: errorText,
            tokenPreview: `${token.substring(0, 4)}...${token.substring(token.length - 4)}`,
            suggestions: [
              "Check if you've copied the correct token from the Discord Developer Portal",
              "Make sure you're using the bot token, not the client secret",
              "Try regenerating your bot token in the Discord Developer Portal",
              "Ensure you're prefixing the token with 'Bot ' in the Authorization header (this is done automatically in the code)",
            ],
          },
          { status: 401 },
        )
      }

      return NextResponse.json(
        {
          error: `Discord API error: ${response.status}`,
          details: errorText,
        },
        { status: response.status },
      )
    }

    const botInfo = await response.json()

    return NextResponse.json({
      success: true,
      botInfo: {
        id: botInfo.id,
        username: botInfo.username,
        discriminator: botInfo.discriminator,
        avatar: botInfo.avatar,
        verified: botInfo.verified,
      },
      message: "Discord bot token is valid",
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to verify Discord bot token",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
