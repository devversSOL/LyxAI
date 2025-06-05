"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { DiscordMessageRecord } from "@/lib/supabase"

export function DiscordMessageDisplay() {
  const [messages, setMessages] = useState<DiscordMessageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const fetchMessages = async (searchTerm?: string) => {
    try {
      setLoading(true)
      const url = searchTerm ? `/api/new-message?search=${encodeURIComponent(searchTerm)}` : "/api/new-message"

      const response = await fetch(url)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setMessages(data.messages || [])
        setError(null)
      }
    } catch (err) {
      setError("Failed to fetch messages")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => fetchMessages(search), 30000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchMessages(search)
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString()
    } catch (e) {
      return timestamp
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Discord Messages</CardTitle>
        <CardDescription>Recent messages from Discord</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </Button>
        </form>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {loading ? "Loading messages..." : "No messages found"}
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="font-semibold">{message.username}</div>
                  <div className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</div>
                </div>
                <div className="mt-2 whitespace-pre-wrap">{message.content}</div>

                {/* Display embeds if present */}
                {message.embeds && message.embeds.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {message.embeds.map((embed, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-3 py-2 bg-blue-50 rounded">
                        {embed.title && <div className="font-semibold">{embed.title}</div>}
                        {embed.description && <div className="text-sm mt-1">{embed.description}</div>}

                        {/* Display embed fields if present */}
                        {embed.fields && embed.fields.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {embed.fields.map((field, fieldIndex) => (
                              <div key={fieldIndex} className={field.inline ? "col-span-1" : "col-span-2"}>
                                <div className="text-xs font-semibold">{field.name}</div>
                                <div className="text-xs">{field.value}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Display attachments if present */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">Attachments: {message.attachments.length}</div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Also add a default export that points to the named export
// This allows both import styles to work
export default DiscordMessageDisplay
