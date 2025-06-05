import { cache } from "react"
import type { DiscordMessage, WhaleActivity } from "./discord-service"

// Cache the fetch to avoid unnecessary API calls during rendering
export const fetchWebhookMessages = cache(
  async (): Promise<{
    messages: DiscordMessage[]
    whaleActivity: WhaleActivity[]
  }> => {
    try {
      const response = await fetch(`/api/discord-webhook`, {
        next: { revalidate: 30 }, // Revalidate every 30 seconds
      })

      if (!response.ok) {
        throw new Error(`Webhook API error: ${response.status}`)
      }

      const data = await response.json()
      return {
        messages: data.messages || [],
        whaleActivity: data.whaleActivity || [],
      }
    } catch (error) {
      console.error("Error fetching webhook messages:", error)
      return {
        messages: [],
        whaleActivity: [],
      }
    }
  },
)
