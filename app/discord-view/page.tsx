"use client"

import { useEffect, useState } from "react"
import { getDiscordMessages } from "@/app/actions/discord-actions"

export default function DiscordView() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMessages() {
      try {
        setLoading(true)
        const result = await getDiscordMessages()
        setMessages(result.messages || [])
        setError(null)
      } catch (err) {
        setError("Failed to load messages")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Refresh every 30 seconds
    const interval = setInterval(fetchMessages, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Discord Messages</h1>

      <div className="mb-4">
        <button
          onClick={() => getDiscordMessages().then((result) => setMessages(result.messages || []))}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {loading && messages.length === 0 && <div className="text-center p-4">Loading messages...</div>}

      {error && <div className="text-red-500 p-4">{error}</div>}

      {messages.length === 0 && !loading && <div className="text-center p-4">No messages yet</div>}

      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="border p-4 rounded-lg bg-gray-50">
            <div className="flex items-center mb-2">
              <div className="font-bold">{message.username}</div>
              <div className="text-gray-500 text-sm ml-2">{new Date(message.timestamp).toLocaleString()}</div>
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>

            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2">
                <div className="font-semibold">Attachments:</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {message.attachments.map((attachment: any, index: number) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {attachment.content_type?.includes("image") ? (
                        <img
                          src={attachment.url || "/placeholder.svg"}
                          alt="Attachment"
                          className="max-w-xs max-h-40 rounded"
                        />
                      ) : (
                        "Attachment"
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {message.embeds && message.embeds.length > 0 && (
              <div className="mt-2">
                <div className="font-semibold">Embeds:</div>
                <div className="space-y-2 mt-1">
                  {message.embeds.map((embed: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-2 py-1">
                      {embed.title && <div className="font-bold">{embed.title}</div>}
                      {embed.description && <div>{embed.description}</div>}
                      {embed.url && (
                        <a
                          href={embed.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm"
                        >
                          {embed.url}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
