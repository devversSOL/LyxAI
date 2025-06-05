import { DiscordMessageDisplay } from "@/components/discord-message-display"

export default function DiscordMessagesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Discord Message Feed</h1>
      <DiscordMessageDisplay />
    </div>
  )
}
