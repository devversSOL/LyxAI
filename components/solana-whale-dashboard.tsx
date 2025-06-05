"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, AlertTriangle, ExternalLink, TrendingUp } from "lucide-react"
import Link from "next/link"

// Sample data for the Solana whale dashboard
const solanaWhaleData = {
  whaleActivity: [
    {
      token: "SOL",
      amount: "245,000 SOL",
      value: "$35.0M",
      type: "Exchange Deposit",
      from: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpNGZSZnHULbpU",
      to: "Binance",
      time: "2 hours ago",
      impact: "High",
    },
    {
      token: "BONK",
      amount: "12,500,000,000 BONK",
      value: "$8.2M",
      type: "Transfer",
      from: "7YHpNFBxFTAZ8Mn1UrXQy3eLJ9NdJx3G3xhUh9C3WBt2",
      to: "3xJ3MoUVFPNFEHfWdtNFYLsrKFLZjHUZrJpzFXP7C4Vh",
      time: "35 mins ago",
      impact: "Medium",
    },
    {
      token: "WIF",
      amount: "8,750,000 WIF",
      value: "$4.3M",
      type: "Swap",
      from: "DuZtEhEaANzQN3NjNX9GgpiE7zA1954xAeTQTbVKTrKe",
      to: "SOL",
      time: "1 hour ago",
      impact: "Medium",
    },
    {
      token: "BOME",
      amount: "32,000,000 BOME",
      value: "$2.1M",
      type: "Exchange Withdrawal",
      from: "Kraken",
      to: "9B8e8dF2Cc32e7b6Aea4107F3080c6c72D3C9b99",
      time: "3 hours ago",
      impact: "Low",
    },
    {
      token: "SAMO",
      amount: "18,500,000 SAMO",
      value: "$1.8M",
      type: "Transfer",
      from: "3F4D6BF08CB7A003488Ef082102C2e6418a4551e",
      to: "7YHpNFBxFTAZ8Mn1UrXQy3eLJ9NdJx3G3xhUh9C3WBt2",
      time: "4 hours ago",
      impact: "Low",
    },
    {
      token: "SOL",
      amount: "120,000 SOL",
      value: "$17.2M",
      type: "Swap",
      from: "742d35Cc6634C0532925a3b844Bc454e4438f44e",
      to: "USDC",
      time: "5 hours ago",
      impact: "High",
    },
    {
      token: "POPCAT",
      amount: "45,000,000 POPCAT",
      value: "$3.6M",
      type: "Transfer",
      from: "1F8b6Cc5d8B193Bd680891f53F93A41538B5A1A0",
      to: "DuZtEhEaANzQN3NjNX9GgpiE7zA1954xAeTQTbVKTrKe",
      time: "6 hours ago",
      impact: "Medium",
    },
  ],
  topWhaleWallets: [
    {
      address: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpNGZSZnHULbpU",
      holdings: "$142.5M",
      tokens: ["SOL", "BONK", "WIF", "SAMO"],
      activity: "High",
      lastActive: "2 hours ago",
    },
    {
      address: "7YHpNFBxFTAZ8Mn1UrXQy3eLJ9NdJx3G3xhUh9C3WBt2",
      holdings: "$98.3M",
      tokens: ["SOL", "BONK", "BOME", "POPCAT"],
      activity: "Medium",
      lastActive: "35 mins ago",
    },
    {
      address: "3xJ3MoUVFPNFEHfWdtNFYLsrKFLZjHUZrJpzFXP7C4Vh",
      holdings: "$76.1M",
      tokens: ["SOL", "WIF", "SAMO", "POPCAT"],
      activity: "High",
      lastActive: "1 hour ago",
    },
    {
      address: "DuZtEhEaANzQN3NjNX9GgpiE7zA1954xAeTQTbVKTrKe",
      holdings: "$54.8M",
      tokens: ["SOL", "BONK", "BOME"],
      activity: "Medium",
      lastActive: "6 hours ago",
    },
    {
      address: "742d35Cc6634C0532925a3b844Bc454e4438f44e",
      holdings: "$38.2M",
      tokens: ["SOL", "WIF", "SAMO"],
      activity: "Low",
      lastActive: "5 hours ago",
    },
  ],
  tokenAlerts: [
    {
      token: "BONK",
      alert: "Unusual whale accumulation detected",
      severity: "high",
      time: "1 hour ago",
    },
    {
      token: "WIF",
      alert: "Large token movement from exchange to wallet",
      severity: "medium",
      time: "3 hours ago",
    },
    {
      token: "POPCAT",
      alert: "Significant increase in whale wallet concentration",
      severity: "medium",
      time: "5 hours ago",
    },
    {
      token: "SOL",
      alert: "Multiple large swaps to stablecoins",
      severity: "high",
      time: "6 hours ago",
    },
  ],
  memecoins: [
    { name: "BONK", logo: "/bonk-logo.png" },
    { name: "WIF", logo: "/wif-logo.png" },
    { name: "BOME", logo: "/bome-logo.png" },
    { name: "POPCAT", logo: "/popcat-logo.png" },
    { name: "SAMO", logo: "/samo-logo.png" },
  ],
}

export default function SolanaWhaleDashboard() {
  const [activeTab, setActiveTab] = useState("activity")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredActivity, setFilteredActivity] = useState(solanaWhaleData.whaleActivity)
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [impactFilter, setImpactFilter] = useState<string[]>([])

  // Add pagination state variables after the other state variables
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  useEffect(() => {
    let filtered = solanaWhaleData.whaleActivity

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
  }, [searchQuery, selectedTokens, impactFilter])

  // Add pagination calculation logic after the filtering useEffect
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredActivity.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredActivity.length / itemsPerPage)

  // Add pagination control functions
  const goToPage = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)))
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Add a function to handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const toggleTokenFilter = (token: string) => {
    setSelectedTokens((prev) => (prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token]))
  }

  const toggleImpactFilter = (impact: string) => {
    setImpactFilter((prev) => (prev.includes(impact) ? prev.filter((i) => i !== impact) : [...prev, impact]))
  }

  return (
    <div className="bg-[#070318] text-white min-h-screen overflow-hidden relative font-extralight py-16">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black to-purple-950/20"></div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <Badge className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-light mb-4">
              SOLANA WHALE TRACKER
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extralight tracking-tight mb-2">Solana Whale Activity</h1>
            <p className="text-zinc-400 text-lg font-extralight max-w-2xl">
              Track large movements of SOL and Solana memecoins in real-time
            </p>
          </div>

          <div className="flex gap-4 mt-6 md:mt-0">
            <Link
              href="/analyzer"
              className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center hover:bg-white/10 transition-all duration-300"
            >
              <span className="font-light">Token Analyzer</span>
            </Link>
            <Link
              href="/docs"
              className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center hover:bg-white/10 transition-all duration-300"
            >
              <span className="font-light">Documentation</span>
            </Link>
          </div>
        </div>

        {/* Solana Price Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-extralight">Solana Price</CardTitle>
              <CardDescription>Current SOL market data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">$143.27</div>
              <div className="text-sm text-green-400">+5.8% in 24h</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-extralight">Whale Transactions</CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">32</div>
              <div className="text-sm text-green-400">+12% from yesterday</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-extralight">Total Value Moved</CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">$128.5M</div>
              <div className="text-sm text-yellow-400">-3.2% from yesterday</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 p-1 mb-6">
            <TabsTrigger value="activity" className="data-[state=active]:bg-purple-900/50">
              Whale Activity
            </TabsTrigger>
            <TabsTrigger value="wallets" className="data-[state=active]:bg-purple-900/50">
              Top Whale Wallets
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-purple-900/50">
              Whale Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-0">
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
                {solanaWhaleData.memecoins.map((coin) => (
                  <Button
                    key={coin.name}
                    variant="outline"
                    size="sm"
                    className={`border-white/10 ${
                      selectedTokens.includes(coin.name) ? "bg-purple-900/50" : "bg-transparent"
                    }`}
                    onClick={() => toggleTokenFilter(coin.name)}
                  >
                    {coin.name}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-white/10 ${selectedTokens.includes("SOL") ? "bg-purple-900/50" : "bg-transparent"}`}
                  onClick={() => toggleTokenFilter("SOL")}
                >
                  SOL
                </Button>
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
                <CardTitle className="text-2xl font-extralight">Whale Transactions</CardTitle>
                <CardDescription>Large movements of SOL and Solana memecoins</CardDescription>
              </CardHeader>
              <CardContent>
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
                      {currentItems.map((activity, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
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
                            <Button size="sm" variant="outline" className="border-purple-500/30 hover:bg-purple-800/70">
                              <ExternalLink className="h-4 w-4 mr-1" /> Explorer
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredActivity.length > 0 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-white/10">
                    <div className="flex items-center mb-4 sm:mb-0">
                      <span className="text-sm text-zinc-400 mr-2">Rows per page:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 rounded-md py-1 px-2 text-white text-sm"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                      <span className="text-sm text-zinc-400 ml-4">
                        {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredActivity.length)} of{" "}
                        {filteredActivity.length}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="border-white/10 hover:bg-white/10 mr-2"
                      >
                        Previous
                      </Button>

                      <div className="flex items-center mx-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          // Show pages around current page
                          let pageNum = 0
                          if (totalPages <= 5) {
                            // If 5 or fewer pages, show all
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            // If near start, show first 5
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            // If near end, show last 5
                            pageNum = totalPages - 4 + i
                          } else {
                            // Otherwise show current and 2 on each side
                            pageNum = currentPage - 2 + i
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant="outline"
                              size="sm"
                              onClick={() => goToPage(pageNum)}
                              className={`w-8 h-8 p-0 mx-1 border-white/10 ${
                                currentPage === pageNum ? "bg-purple-900/50" : "hover:bg-white/10"
                              }`}
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="border-white/10 hover:bg-white/10 ml-2"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallets" className="mt-0">
            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-extralight">Top Whale Wallets</CardTitle>
                <CardDescription>Largest Solana wallets by holdings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-sm font-light">Wallet Address</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Total Holdings</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Top Tokens</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Activity Level</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Last Active</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solanaWhaleData.topWhaleWallets.map((wallet, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-light truncate max-w-[180px]" title={wallet.address}>
                              {wallet.address}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-light">{wallet.holdings}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {wallet.tokens.map((token, i) => (
                                <Badge key={i} className="bg-purple-900/30 text-purple-300">
                                  {token}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              className={
                                wallet.activity === "High"
                                  ? "bg-red-900/50 text-red-300"
                                  : wallet.activity === "Medium"
                                    ? "bg-yellow-900/50 text-yellow-300"
                                    : "bg-green-900/50 text-green-300"
                              }
                            >
                              {wallet.activity}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 font-light">{wallet.lastActive}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-500/30 hover:bg-purple-800/70"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" /> Explorer
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-500/30 hover:bg-purple-800/70"
                              >
                                <TrendingUp className="h-4 w-4 mr-1" /> Activity
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extralight">Whale Alerts</CardTitle>
                    <CardDescription>Important notifications about whale activity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {solanaWhaleData.tokenAlerts.map((alert, index) => (
                      <div
                        key={index}
                        className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle
                            className={
                              alert.severity === "high"
                                ? "text-red-400"
                                : alert.severity === "medium"
                                  ? "text-yellow-400"
                                  : "text-blue-400"
                            }
                          />
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-light">
                                <span className="font-medium">{alert.token}:</span> {alert.alert}
                              </h3>
                              <Badge
                                className={
                                  alert.severity === "high"
                                    ? "bg-red-900/50 text-red-300"
                                    : alert.severity === "medium"
                                      ? "bg-yellow-900/50 text-yellow-300"
                                      : "bg-blue-900/50 text-blue-300"
                                }
                              >
                                {alert.severity}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm text-zinc-400">
                              <span>{alert.time}</span>
                              <Button size="sm" variant="link" className="text-purple-400 p-0 h-auto font-normal">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10 mb-6">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extralight">Alert Settings</CardTitle>
                    <CardDescription>Customize your whale alerts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-light block mb-2">Minimum Transaction Value</label>
                        <select className="w-full bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 rounded-md py-2 px-3 text-white">
                          <option value="1000000">$1,000,000+</option>
                          <option value="5000000">$5,000,000+</option>
                          <option value="10000000" selected>
                            $10,000,000+
                          </option>
                          <option value="50000000">$50,000,000+</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-light block mb-2">Tokens to Track</label>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-purple-900/50 text-purple-300 px-3 py-1">SOL ✓</Badge>
                          <Badge className="bg-purple-900/50 text-purple-300 px-3 py-1">BONK ✓</Badge>
                          <Badge className="bg-purple-900/50 text-purple-300 px-3 py-1">WIF ✓</Badge>
                          <Badge className="bg-white/10 text-white px-3 py-1">SAMO</Badge>
                          <Badge className="bg-white/10 text-white px-3 py-1">BOME</Badge>
                          <Badge className="bg-purple-900/50 text-purple-300 px-3 py-1">POPCAT ✓</Badge>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-light block mb-2">Alert Types</label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="checkbox" id="exchange-deposits" className="mr-2" checked />
                            <label htmlFor="exchange-deposits" className="text-sm">
                              Exchange Deposits
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="exchange-withdrawals" className="mr-2" checked />
                            <label htmlFor="exchange-withdrawals" className="text-sm">
                              Exchange Withdrawals
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="large-transfers" className="mr-2" checked />
                            <label htmlFor="large-transfers" className="text-sm">
                              Large Transfers
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="large-swaps" className="mr-2" checked />
                            <label htmlFor="large-swaps" className="text-sm">
                              Large Swaps
                            </label>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full bg-purple-600 hover:bg-purple-700">Save Alert Preferences</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extralight">Market Impact</CardTitle>
                    <CardDescription>Potential price impact of recent whale movements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-light">SOL</span>
                          <span className="text-sm font-light">Medium Impact</span>
                        </div>
                        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-yellow-500" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-light">BONK</span>
                          <span className="text-sm font-light">High Impact</span>
                        </div>
                        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-red-500" style={{ width: "72%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-light">WIF</span>
                          <span className="text-sm font-light">Medium Impact</span>
                        </div>
                        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-yellow-500" style={{ width: "58%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-light">SAMO</span>
                          <span className="text-sm font-light">Low Impact</span>
                        </div>
                        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-green-500" style={{ width: "25%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
