"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, RefreshCw, AlertTriangle, ChevronDown } from "lucide-react"
import Image from "next/image"
import WaterDropsBackground from "./water-drops-background"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { WhaleActivity } from "@/app/services/discord-service"

interface DiscordWhaleFeedProps {
  channelId?: string
  initialData?: WhaleActivity[]
  refreshInterval?: number // in milliseconds
}

export default function DiscordWhaleFeed({
  channelId,
  initialData = [],
  refreshInterval = 30000, // Default: refresh every 30 seconds
}: DiscordWhaleFeedProps) {
  const [whaleActivity, setWhaleActivity] = useState<WhaleActivity[]>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(true) // Start with loading state
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [filteredActivity, setFilteredActivity] = useState<WhaleActivity[]>(whaleActivity)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Function to fetch whale activity from Discord
  const fetchWhaleActivity = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (channelId) params.append("channelId", channelId)

      console.log("Fetching whale activity from API...")
      const response = await fetch(`/api/discord-whale-activity?${params.toString()}`)
      const data = await response.json()

      // Store the full API response for debugging
      setApiResponse(data)

      if (!response.ok) {
        throw new Error(`API error: ${data.error || response.status}`)
      }

      console.log(`Received ${data.whaleActivity?.length || 0} whale activities from API`)

      if (!data.whaleActivity || !Array.isArray(data.whaleActivity)) {
        console.error("Invalid response format:", data)
        throw new Error("Invalid response format from API")
      }

      setWhaleActivity(data.whaleActivity)
      setLastRefreshed(new Date())
    } catch (err) {
      console.error("Error fetching whale activity:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch whale activity")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch and setup refresh interval
  useEffect(() => {
    // Always fetch on component mount
    fetchWhaleActivity()

    // Set up refresh interval
    const intervalId = setInterval(fetchWhaleActivity, refreshInterval)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [channelId, refreshInterval])

  // Filter whale activity based on search and filters
  useEffect(() => {
    let filtered = whaleActivity

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (activity) =>
          activity.token.toLowerCase().includes(query) ||
          (activity.from && activity.from.toLowerCase().includes(query)) ||
          (activity.to && activity.to.toLowerCase().includes(query)),
      )
    }

    // Apply token filter
    if (selectedTokens.length > 0) {
      filtered = filtered.filter((activity) => selectedTokens.includes(activity.token))
    }

    setFilteredActivity(filtered)
  }, [searchQuery, selectedTokens, whaleActivity])

  const toggleTokenFilter = (token: string) => {
    setSelectedTokens((prev) => (prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token]))
  }

  // Get unique tokens from whale activity
  const uniqueTokens = Array.from(new Set(whaleActivity.map((activity) => activity.token))).filter(
    (token) => token !== "Unknown",
  )

  // Helper function to parse values like $5.24K to numbers
  const parseValueToNumber = (value: string): number => {
    try {
      // Remove $ and any commas
      const cleanValue = value.replace(/[$,]/g, "")

      // Extract the number and suffix
      const match = cleanValue.match(/^([0-9.]+)([KMB])?$/i)
      if (!match) return 0

      const num = Number.parseFloat(match[1])
      const suffix = match[2]?.toUpperCase()

      // Apply multiplier based on suffix
      if (suffix === "K") return num * 1000
      if (suffix === "M") return num * 1000000
      if (suffix === "B") return num * 1000000000

      return num
    } catch (e) {
      console.error("Error parsing value:", e, value)
      return 0
    }
  }

  // Get stats for the dashboard
  const totalTransactions = filteredActivity.length
  const totalVolume = filteredActivity.reduce((sum, activity) => {
    return sum + parseValueToNumber(activity.buyAmount || "0")
  }, 0)

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`
    } else {
      return `$${value.toFixed(2)}`
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* 3D Water Drops Background */}
      <WaterDropsBackground />

      {/* Main content with glassmorphism */}
      <div className="relative z-10 container mx-auto px-4 py-8 space-y-6">
        {/* Hero section with glassmorphism */}
        <div className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-8 mb-8">
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image src="/whale-icon.png" alt="Whale Icon" width={40} height={40} className="object-contain" />
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-200">
                  Whale Tracker
                </h1>
              </div>
              <p className="text-blue-100/80 max-w-lg">
                Monitor large transactions and whale movements in real-time from Discord channels
              </p>
            </div>

            <div className="flex gap-4">
              <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 transition-all duration-300 hover:bg-white/10">
                <p className="text-xs text-blue-200/70 mb-1">Transactions</p>
                <p className="text-2xl font-bold text-white">{totalTransactions}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 transition-all duration-300 hover:bg-white/10">
                <p className="text-xs text-blue-200/70 mb-1">Total Volume</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalVolume)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {lastRefreshed && (
              <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full text-xs text-blue-200/70 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                Last updated: {lastRefreshed.toLocaleTimeString()}
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchWhaleActivity}
            disabled={isLoading}
            className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-200 hover:scale-105"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {error && (
          <Card className="bg-red-900/20 backdrop-blur-md border-red-500/50 animate-pulse">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-red-400" />
                  <p>Error: {error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300/50" />
            <input
              type="text"
              placeholder="Search by token..."
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-full py-3 pl-10 pr-4 text-white placeholder:text-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative z-50">
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 min-w-[140px] justify-between transition-all duration-200 hover:border-cyan-500/50"
                >
                  {selectedTokens.length > 0
                    ? `${selectedTokens.length} token${selectedTokens.length > 1 ? "s" : ""} selected`
                    : "Filter by token"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-white/10 backdrop-blur-xl border border-white/20 max-h-[300px] overflow-y-auto w-[200px] z-50 animate-in fade-in-80 slide-in-from-top-5"
                style={{ zIndex: 9999 }}
              >
                {uniqueTokens.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-blue-200/70">No tokens available</div>
                ) : (
                  uniqueTokens.map((token) => (
                    <DropdownMenuCheckboxItem
                      key={token}
                      checked={selectedTokens.includes(token)}
                      onCheckedChange={() => toggleTokenFilter(token)}
                      className="cursor-pointer hover:bg-white/20 transition-colors duration-150 text-blue-50"
                    >
                      {token}
                    </DropdownMenuCheckboxItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
          <CardHeader className="relative border-b border-white/10">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-200">
              Whale Transactions
            </CardTitle>
            <CardDescription className="text-blue-200/70">Live feed from Discord whale alert channel</CardDescription>
          </CardHeader>
          <CardContent className="relative p-0">
            {isLoading && filteredActivity.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            ) : filteredActivity.length === 0 ? (
              <div className="text-center py-12 text-blue-200/70">
                {whaleActivity.length === 0
                  ? "No whale activity found in the database. Waiting for new messages..."
                  : "No whale activity found matching your filters"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-6 py-4 text-left text-sm font-medium text-blue-200">Token</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-blue-200">Buy Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-blue-200">MC (Market Cap)</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-blue-200">Token CA</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-blue-200">Biggest Win</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-blue-200">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivity.map((activity, index) => (
                      <tr
                        key={activity.id}
                        className={`border-t border-white/5 hover:bg-white/10 transition-colors group ${
                          index % 2 === 0 ? "bg-white/[0.03]" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                            <span className="font-medium text-cyan-300 group-hover:text-cyan-200 transition-colors">
                              {activity.token}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-green-400">{activity.buyAmount}</td>
                        <td className="px-6 py-4 font-light text-blue-100">{activity.marketCap}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(activity.winRate)
                                // You could add a toast notification here
                              }}
                              className="font-medium text-blue-100 hover:text-cyan-300 transition-colors cursor-pointer text-xs bg-white/10 px-2 py-1 rounded"
                              title="Click to copy Token CA"
                            >
                              {activity.winRate.length > 12
                                ? `${activity.winRate.substring(0, 12)}...`
                                : activity.winRate}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-light text-blue-100">{activity.biggestWin}</td>
                        <td className="px-6 py-4 text-blue-300/50 text-sm">{activity.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
