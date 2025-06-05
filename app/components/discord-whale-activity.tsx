import { fetchDiscordMessages, parseWhaleActivity } from "@/app/services/discord-service"
import DiscordWhaleFeed from "@/components/discord-whale-feed"

interface DiscordWhaleActivityProps {
  channelId?: string
}

export default async function DiscordWhaleActivity({ channelId }: DiscordWhaleActivityProps) {
  // Use the environment variable if channelId is not provided
  const discordChannelId = channelId || process.env.DISCORD_WHALE_CHANNEL_ID

  // Fetch initial data on the server
  let initialData = []

  try {
    if (discordChannelId) {
      const messages = await fetchDiscordMessages(discordChannelId)
      initialData = parseWhaleActivity(messages)
    }
  } catch (error) {
    console.error("Error pre-fetching Discord messages:", error)
    // Continue with empty initial data
  }

  return (
    <DiscordWhaleFeed
      channelId={discordChannelId}
      initialData={initialData}
      refreshInterval={60000} // Refresh every minute
    />
  )
}
