"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, AlertTriangle } from "lucide-react"
import Link from "next/link"

// Sample data for the dashboard
const marketData = {
  marketOverview: {
    totalMarketCap: "$1.24T",
    volume24h: "$48.7B",
    btcDominance: "52.3%",
    fearGreedIndex: 72,
    fearGreedLabel: "Greed",
    topGainers: [
      { name: "Solana", symbol: "SOL", logo: "/abstract-sol.png", change: "+15.4%", price: "$142.87" },
      { name: "Avalanche", symbol: "AVAX", logo: "/avalanche-landscape.png", change: "+12.2%", price: "$38.45" },
      { name: "Cardano", symbol: "ADA", logo: "/abstract-geometric-ada.png", change: "+8.7%", price: "$0.58" },
    ],
    topLosers: [
      { name: "Polkadot", symbol: "DOT", logo: "/red-dot-on-white.png", change: "-4.2%", price: "$7.32" },
      { name: "Ethereum", symbol: "ETH", logo: "/ethereal-threads.png", change: "-2.8%", price: "$2,387.45" },
      { name: "Polygon", symbol: "MATIC", logo: "/polygon-logo.png", change: "-1.9%", price: "$0.78" },
    ],
  },
  trendingTokens: [
    {
      name: "Solana",
      symbol: "SOL",
      logo: "/abstract-sol.png",
      price: "$142.87",
      change: "+15.4%",
      marketCap: "$58.2B",
      volume: "$4.8B",
      socialScore: 92,
      riskLevel: "Low",
    },
    {
      name: "Avalanche",
      symbol: "AVAX",
      logo: "/avalanche-landscape.png",
      price: "$38.45",
      change: "+12.2%",
      marketCap: "$14.1B",
      volume: "$1.2B",
      socialScore: 84,
      riskLevel: "Medium",
    },
    {
      name: "Cardano",
      symbol: "ADA",
      logo: "/abstract-geometric-ada.png",
      price: "$0.58",
      change: "+8.7%",
      marketCap: "$20.5B",
      volume: "$980M",
      socialScore: 78,
      riskLevel: "Low",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      logo: "/ethereal-threads.png",
      price: "$2,387.45",
      change: "-2.8%",
      marketCap: "$287.3B",
      volume: "$12.4B",
      socialScore: 88,
      riskLevel: "Low",
    },
    {
      name: "Polkadot",
      symbol: "DOT",
      logo: "/red-dot-on-white.png",
      price: "$7.32",
      change: "-4.2%",
      marketCap: "$9.8B",
      volume: "$620M",
      socialScore: 72,
      riskLevel: "Medium",
    },
  ],
  recentNews: [
    {
      title: "Solana Breaks $150 Barrier as Institutional Interest Grows",
      source: "CryptoNews",
      time: "2 hours ago",
      sentiment: "positive",
    },
    {
      title: "New Regulatory Framework for Crypto Proposed by SEC",
      source: "Bloomberg",
      time: "5 hours ago",
      sentiment: "neutral",
    },
    {
      title: "Major Exchange Faces Security Breach, Users Advised to Reset Passwords",
      source: "CoinDesk",
      time: "8 hours ago",
      sentiment: "negative",
    },
    {
      title: "Ethereum Layer 2 Solutions See Record Adoption in Q2",
      source: "The Block",
      time: "12 hours ago",
      sentiment: "positive",
    },
  ],
  whaleActivity: [
    {
      token: "ETH",
      amount: "12,500 ETH",
      value: "$29.8M",
      type: "Transfer",
      from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      to: "0x9B8e8dF2Cc32e7b6Aea4107F3080c6c72D3C9b99",
      time: "35 mins ago",
    },
    {
      token: "SOL",
      amount: "245,000 SOL",
      value: "$35.0M",
      type: "Exchange Deposit",
      from: "0x1F8b6Cc5d8B193Bd680891f53F93A41538B5A1A0",
      to: "Binance",
      time: "2 hours ago",
    },
    {
      token: "USDC",
      amount: "18,500,000 USDC",
      value: "$18.5M",
      type: "Swap",
      from: "0x3F4D6BF08CB7A003488Ef082102C2e6418a4551e",
      to: "ETH",
      time: "4 hours ago",
    },
  ],
  tokenAlerts: [
    {
      token: "MEMECOIN",
      alert: "Unusual social media activity detected",
      severity: "medium",
      time: "1 hour ago",
    },
    {
      token: "DEFI-PROTOCOL",
      alert: "Large insider token unlock scheduled",
      severity: "high",
      time: "5 hours ago",
    },
    {
      token: "GAMING-TOKEN",
      alert: "Positive sentiment spike after partnership announcement",
      severity: "low",
      time: "12 hours ago",
    },
  ],
}

export default function MarketIntelligenceDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTokens, setFilteredTokens] = useState(marketData.trendingTokens)

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTokens(marketData.trendingTokens)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredTokens(
        marketData.trendingTokens.filter(
          (token) => token.name.toLowerCase().includes(query) || token.symbol.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery])

  return (
    <div className="bg-[#070318] text-white min-h-screen overflow-hidden relative font-extralight py-16">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black to-purple-950/20"></div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <Badge className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-light mb-4">
              LYXAI INTELLIGENCE
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extralight tracking-tight mb-2">Market & Token Intelligence</h1>
            <p className="text-zinc-400 text-lg font-extralight max-w-2xl">
              Real-time insights, analytics, and AI-powered market intelligence
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

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-extralight">Total Market Cap</CardTitle>
              <CardDescription>Global crypto market</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">{marketData.marketOverview.totalMarketCap}</div>
              <div className="text-sm text-green-400">+3.2% in 24h</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-extralight">24h Volume</CardTitle>
              <CardDescription>Trading activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">{marketData.marketOverview.volume24h}</div>
              <div className="text-sm text-green-400">+8.7% from yesterday</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-extralight">BTC Dominance</CardTitle>
              <CardDescription>Market share</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">{marketData.marketOverview.btcDominance}</div>
              <div className="text-sm text-red-400">-0.8% this week</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-extralight">Fear & Greed</CardTitle>
              <CardDescription>Market sentiment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">{marketData.marketOverview.fearGreedIndex}</div>
              <div className="text-sm text-yellow-400">{marketData.marketOverview.fearGreedLabel}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 p-1 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-900/50">
              Market Overview
            </TabsTrigger>
            <TabsTrigger value="tokens" className="data-[state=active]:bg-purple-900/50">
              Token Analytics
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-purple-900/50">
              Social & News
            </TabsTrigger>
            <TabsTrigger value="whale" className="data-[state=active]:bg-purple-900/50">
              Whale Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extralight">Market Trends</CardTitle>
                    <CardDescription>Price movement visualization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-light mb-2">Market Trend Chart</div>
                        <div className="text-sm text-zinc-400">
                          (This would be a chart showing market trends over time)
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10 mb-6">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extralight">Top Gainers</CardTitle>
                    <CardDescription>Best performing tokens (24h)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {marketData.marketOverview.topGainers.map((token, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={token.logo || "/placeholder.svg"}
                            alt={token.symbol}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div>
                            <div className="font-light">{token.name}</div>
                            <div className="text-xs text-zinc-400">{token.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-light">{token.price}</div>
                          <div className="text-xs text-green-400">{token.change}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extralight">Top Losers</CardTitle>
                    <CardDescription>Worst performing tokens (24h)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {marketData.marketOverview.topLosers.map((token, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={token.logo || "/placeholder.svg"}
                            alt={token.symbol}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div>
                            <div className="font-light">{token.name}</div>
                            <div className="text-xs text-zinc-400">{token.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-light">{token.price}</div>
                          <div className="text-xs text-red-400">{token.change}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tokens" className="mt-0">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search tokens by name or symbol..."
                  className="w-full bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10 rounded-full py-3 pl-10 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-extralight">Token Analytics</CardTitle>
                <CardDescription>Detailed metrics for trending tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-sm font-light">Token</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Price</th>
                        <th className="px-6 py-4 text-left text-sm font-light">24h Change</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Market Cap</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Volume (24h)</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Social Score</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Risk Level</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTokens.map((token, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img
                                src={token.logo || "/placeholder.svg"}
                                alt={token.symbol}
                                className="w-8 h-8 mr-3 rounded-full"
                              />
                              <div>
                                <div className="font-light">{token.name}</div>
                                <div className="text-xs text-purple-400">{token.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-light">{token.price}</td>
                          <td className="px-6 py-4">
                            <div className={token.change.startsWith("+") ? "text-green-400" : "text-red-400"}>
                              {token.change}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-light">{token.marketCap}</td>
                          <td className="px-6 py-4 font-light">{token.volume}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden mr-2">
                                <div
                                  className={`h-full rounded-full ${
                                    token.socialScore > 80
                                      ? "bg-green-500"
                                      : token.socialScore > 60
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                  style={{ width: `${token.socialScore}%` }}
                                ></div>
                              </div>
                              <span>{token.socialScore}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              className={
                                token.riskLevel === "Low"
                                  ? "bg-green-900/50 text-green-300"
                                  : token.riskLevel === "Medium"
                                    ? "bg-yellow-900/50 text-yellow-300"
                                    : "bg-red-900/50 text-red-300"
                              }
                            >
                              {token.riskLevel}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-500/30 hover:bg-purple-800/70"
                              onClick={() => {}}
                            >
                              Analyze
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extralight">Recent News</CardTitle>
                    <CardDescription>Latest crypto news and developments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {marketData.recentNews.map((news, index) => (
                        <div
                          key={index}
                          className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-light">{news.title}</h3>
                            <Badge
                              className={
                                news.sentiment === "positive"
                                  ? "bg-green-900/50 text-green-300"
                                  : news.sentiment === "neutral"
                                    ? "bg-blue-900/50 text-blue-300"
                                    : "bg-red-900/50 text-red-300"
                              }
                            >
                              {news.sentiment}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm text-zinc-400">
                            <span>{news.source}</span>
                            <span>{news.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10 mb-6">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extralight">Social Sentiment</CardTitle>
                    <CardDescription>Aggregated social media sentiment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-light">Bitcoin</span>
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden mr-2">
                            <div className="h-full rounded-full bg-green-500" style={{ width: "78%" }}></div>
                          </div>
                          <span className="text-green-400">78%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-light">Ethereum</span>
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden mr-2">
                            <div className="h-full rounded-full bg-green-500" style={{ width: "65%" }}></div>
                          </div>
                          <span className="text-green-400">65%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-light">Solana</span>
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden mr-2">
                            <div className="h-full rounded-full bg-green-500" style={{ width: "92%" }}></div>
                          </div>
                          <span className="text-green-400">92%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-light">Cardano</span>
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden mr-2">
                            <div className="h-full rounded-full bg-yellow-500" style={{ width: "54%" }}></div>
                          </div>
                          <span className="text-yellow-400">54%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-light">Dogecoin</span>
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden mr-2">
                            <div className="h-full rounded-full bg-yellow-500" style={{ width: "58%" }}></div>
                          </div>
                          <span className="text-yellow-400">58%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extralight">Token Alerts</CardTitle>
                    <CardDescription>Important notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {marketData.tokenAlerts.map((alert, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border border-white/10 rounded-lg">
                        <AlertTriangle
                          className={
                            alert.severity === "high"
                              ? "text-red-400"
                              : alert.severity === "medium"
                                ? "text-yellow-400"
                                : "text-blue-400"
                          }
                        />
                        <div>
                          <div className="font-light mb-1">
                            <span className="font-medium">{alert.token}:</span> {alert.alert}
                          </div>
                          <div className="text-xs text-zinc-400">{alert.time}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="whale" className="mt-0">
            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10 mb-6">
              <CardHeader>
                <CardTitle className="text-2xl font-extralight">Whale Activity</CardTitle>
                <CardDescription>Large transactions in the last 24 hours</CardDescription>
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
                      </tr>
                    </thead>
                    <tbody>
                      {marketData.whaleActivity.map((activity, index) => (
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl font-extralight">Whale Distribution</CardTitle>
                  <CardDescription>Token concentration by whale wallets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-light mb-2">Whale Distribution Chart</div>
                      <div className="text-sm text-zinc-400">
                        (This would be a chart showing token distribution among whale wallets)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl font-extralight">Market Impact</CardTitle>
                  <CardDescription>Potential price impact of whale movements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-light">Bitcoin (BTC)</span>
                        <span className="text-sm font-light">Low Impact</span>
                      </div>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-green-500" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-light">Ethereum (ETH)</span>
                        <span className="text-sm font-light">Medium Impact</span>
                      </div>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-yellow-500" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-light">Solana (SOL)</span>
                        <span className="text-sm font-light">High Impact</span>
                      </div>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-red-500" style={{ width: "72%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-light">Cardano (ADA)</span>
                        <span className="text-sm font-light">Medium Impact</span>
                      </div>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-yellow-500" style={{ width: "58%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
