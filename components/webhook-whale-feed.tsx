"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ExternalLink, RefreshCw, AlertTriangle, Webhook } from "lucide-react"
import type { WhaleActivity } from "@/app/services/discord-service"

interface WebhookWhaleFeedProps {
  initialData?: WhaleActivity[]
  refreshInterval?: number // in milliseconds
}

export default function WebhookWhaleFeed({
  initialData = [],
  refreshInterval = 30000, // Default: refresh every 30 seconds
}: WebhookWhaleFeedProps) {
  const [whaleActivity, setWhaleActivity] = useState<WhaleActivity[]>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [impactFilter, setImpactFilter] = useState<string[]>([])
  const [filteredActivity, setFilteredActivity] = useState<WhaleActivity[]>(whaleActivity)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Function to fetch whale activity from webhooks
  const fetchWhaleActivity = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/discord-webhook`)

      if (!response.ok) {
        throw new Error(`Failed to fetch webhook data: ${response.status}`)
      }

      const data = await response.json()

      if (data.whaleActivity && Array.isArray(data.whaleActivity)) {
        setWhaleActivity(data.whaleActivity)
        setLastUpdated(new Date())
      } else {
        console.warn("Received invalid webhook data:", data)
      }
    } catch (err) {
      console.error("Error fetching webhook data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch webhook data")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch and setup refresh interval
  useEffect(() => {
    // Only fetch if we don't have initial data
    if (initialData.length === 0) {
      fetchWhaleActivity()
    }

    // Set up refresh interval
    const intervalId = setInterval(fetchWhaleActivity, refreshInterval)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [refreshInterval])

  // Filter whale activity based on search and filters
  useEffect(() => {
    let filtered = whaleActivity

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (activity) =>
          activity.token.toLowerCase().includes(query) ||
          activity.from.toLowerCase().includes(query) ||
          activity.to.toLowerCase().includes(query),
      )
    }

    // Apply token filter
    if (selectedTokens.length > 0) {
      filtered = filtered.filter((activity) => selectedTokens.includes(activity.token))
    }

    // Apply impact filter
    if (impactFilter.length > 0) {
      filtered = filtered.filter((activity) => impactFilter.includes(activity.impact))
    }

    setFilteredActivity(filtered)
  }, [searchQuery, selectedTokens, impactFilter, whaleActivity])

  const toggleTokenFilter = (token: string) => {
    setSelectedTokens((prev) => (prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token]))
  }

  const toggleImpactFilter = (impact: string) => {
    setImpactFilter((prev) => (prev.includes(impact) ? prev.filter((i) => i !== impact) : [...prev, impact]))
  }

  // Get unique tokens from whale activity
  const uniqueTokens = Array.from(new Set(whaleActivity.map((activity) => activity.token))).filter(
    (token) => token !== "Unknown",
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extralight flex items-center">
            <Webhook className="mr-2 h-5 w-5" /> Discord Webhook Feed
          </h2>
          <p className="text-zinc-400 text-sm">
            Live whale activity from Discord webhooks
            <span className="ml-2 text-xs">(Last updated: {lastUpdated.toLocaleTimeString()})</span>
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchWhaleActivity}
          disabled={isLoading}
          className="border-white/10 hover:bg-white/10"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {error && (
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-400" />
              <p>Error: {error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {whaleActivity.length === 0 && !isLoading && !error && (
        <Card className="bg-blue-900/20 border-blue-500/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-blue-400" />
              <div>
                <p className="font-medium">No webhook messages received yet</p>
                <p className="text-sm mt-1">
                  Waiting for new messages from Discord. Make sure your webhook is properly set up and pointing to this
                  endpoint.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by token, wallet address..."
            className="w-full bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10 rounded-full py-3 pl-10 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {uniqueTokens.map((token) => (
            <Button
              key={token}
              variant="outline"
              size="sm"
              className={`border-white/10 ${selectedTokens.includes(token) ? "bg-purple-900/50" : "bg-transparent"}`}
              onClick={() => toggleTokenFilter(token)}
            >
              {token}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`border-white/10 ${
              impactFilter.includes("High") ? "bg-red-900/50 text-red-300" : "bg-transparent"
            }`}
            onClick={() => toggleImpactFilter("High")}
          >
            High Impact
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`border-white/10 ${
              impactFilter.includes("Medium") ? "bg-yellow-900/50 text-yellow-300" : "bg-transparent"
            }`}
            onClick={() => toggleImpactFilter("Medium")}
          >
            Medium Impact
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`border-white/10 ${
              impactFilter.includes("Low") ? "bg-green-900/50 text-green-300" : "bg-transparent"
            }`}
            onClick={() => toggleImpactFilter("Low")}
          >
            Low Impact
          </Button>
        </div>
      </div>

      <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-extralight">Discord Webhook Transactions</CardTitle>
          <CardDescription>Live feed from Discord webhook messages</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && filteredActivity.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredActivity.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              {whaleActivity.length === 0
                ? "No webhook messages received yet. Waiting for new messages from Discord."
                : "No whale activity found matching your filters"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-light">Token</th>
                    <th className="px-6 py-4 text-left text-sm font-light">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-light">Value</th>
                    <th className="px-6 py-4 text-left text-sm font-light">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-light">From</th>
                    <th className="px-6 py-4 text-left text-sm font-light">To</th>
                    <th className="px-6 py-4 text-left text-sm font-light">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-light">Impact</th>
                    <th className="px-6 py-4 text-left text-sm font-light">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivity.map((activity) => (
                    <tr key={activity.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-light">{activity.token}</td>
                      <td className="px-6 py-4 font-light">{activity.amount}</td>
                      <td className="px-6 py-4 font-light">{activity.value}</td>
                      <td className="px-6 py-4">
                        <Badge
                          className={
                            activity.type === "Transfer"
                              ? "bg-blue-900/50 text-blue-300"
                              : activity.type === "Exchange Deposit"
                                ? "bg-purple-900/50 text-purple-300"
                                : activity.type === "Exchange Withdrawal"
                                  ? "bg-orange-900/50 text-orange-300"
                                  : "bg-green-900/50 text-green-300"
                          }
                        >
                          {activity.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-light truncate max-w-[120px]" title={activity.from}>
                          {activity.from}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-light truncate max-w-[120px]" title={activity.to}>
                          {activity.to}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-light">{activity.time}</td>
                      <td className="px-6 py-4">
                        <Badge
                          className={
                            activity.impact === "High"
                              ? "bg-red-900/50 text-red-300"
                              : activity.impact === "Medium"
                                ? "bg-yellow-900/50 text-yellow-300"
                                : "bg-green-900/50 text-green-300"
                          }
                        >
                          {activity.impact}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {activity.transactionUrl ? (
                          <a
                            href={activity.transactionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 rounded-md bg-purple-900/30 text-purple-300 hover:bg-purple-800/50 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" /> Explorer
                          </a>
                        ) : (
                          <Button size="sm" variant="outline" className="border-purple-500/30 hover:bg-purple-800/70">
                            <ExternalLink className="h-4 w-4 mr-1" /> Explorer
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Original Discord Messages View */}
      <Tabs defaultValue="parsed" className="mt-8">
        <TabsList className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 p-1 mb-6">
          <TabsTrigger value="parsed" className="data-[state=active]:bg-purple-900/50">
            Parsed Data
          </TabsTrigger>
          <TabsTrigger value="original" className="data-[state=active]:bg-purple-900/50">
            Original Webhook Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parsed">{/* Current table view is already the parsed data */}</TabsContent>

        <TabsContent value="original">
          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-extralight">Original Webhook Messages</CardTitle>
              <CardDescription>Raw messages received from Discord webhooks</CardDescription>
            </CardHeader>
            <CardContent>
              {whaleActivity.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">No webhook messages received yet</div>
              ) : (
                <div className="space-y-4">
                  {whaleActivity.map((activity) => (
                    <div key={activity.id} className="p-4 bg-[#2a2a4a]/30 rounded-lg border border-white/10">
                      <div className="flex items-start gap-3">
                        <div className="flex-grow">
                          {activity.originalMessage.content && (
                            <p className="mb-2">{activity.originalMessage.content}</p>
                          )}

                          {activity.originalMessage.embeds?.map((embed, i) => (
                            <div
                              key={i}
                              className="border-l-4 pl-3 py-1"
                              style={{
                                borderColor: embed.color ? `#${embed.color.toString(16).padStart(6, "0")}` : "#7289da",
                              }}
                            >
                              {embed.title && <p className="font-medium">{embed.title}</p>}
                              {embed.description && <p className="text-sm mt-1">{embed.description}</p>}

                              {embed.fields && embed.fields.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  {embed.fields.map((field, fi) => (
                                    <div key={fi} className={field.inline ? "" : "col-span-2"}>
                                      <p className="text-xs font-medium text-zinc-400">{field.name}</p>
                                      <p className="text-sm">{field.value}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {embed.footer && <p className="text-xs text-zinc-400 mt-2">{embed.footer.text}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
