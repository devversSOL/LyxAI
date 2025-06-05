"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import BlockchainDisplay from "@/components/blockchain-display"
import FloatingChatButton from "@/components/floating-chat-button"
import FloatingAnalyzerButton from "@/components/floating-analyzer-button"

// Provider data
const providers = [
  {
    id: 1,
    name: "Ethereum Staking",
    symbol: "ETH",
    logo: "/ethereal-threads.png",
    apr: 5.8,
    tvl: "$24.5B",
    verified: true,
    rating: 4.9,
    reviews: 1240,
    minStake: 0.01,
    lockPeriod: "Flexible",
    rewards: "Daily",
    description: "Stake ETH and earn rewards while securing the Ethereum network.",
    features: ["No minimum lock period", "Daily rewards distribution", "Compound interest", "Insurance coverage"],
    performance: {
      day: 0.016,
      week: 0.11,
      month: 0.48,
      year: 5.8,
    },
  },
  {
    id: 2,
    name: "Solana Staking",
    symbol: "SOL",
    logo: "/abstract-sol.png",
    apr: 7.2,
    tvl: "$8.7B",
    verified: true,
    rating: 4.7,
    reviews: 890,
    minStake: 1,
    lockPeriod: "None",
    rewards: "Every 2 days",
    description: "Stake SOL and earn rewards from Solana's high-performance blockchain.",
    features: ["No lock period", "Low fees", "Instant unstaking option", "Validator selection"],
    performance: {
      day: 0.02,
      week: 0.14,
      month: 0.6,
      year: 7.2,
    },
  },
  {
    id: 3,
    name: "Polkadot Staking",
    symbol: "DOT",
    logo: "/red-dot-on-white.png",
    apr: 14.5,
    tvl: "$5.2B",
    verified: true,
    rating: 4.8,
    reviews: 720,
    minStake: 5,
    lockPeriod: "28 days",
    rewards: "Weekly",
    description: "Stake DOT and participate in Polkadot's nominated proof-of-stake system.",
    features: ["Validator nomination", "Weekly rewards", "Governance participation", "Parachain support"],
    performance: {
      day: 0.04,
      week: 0.28,
      month: 1.2,
      year: 14.5,
    },
  },
  {
    id: 4,
    name: "Cardano Staking",
    symbol: "ADA",
    logo: "/abstract-geometric-ada.png",
    apr: 5.5,
    tvl: "$9.1B",
    verified: true,
    rating: 4.6,
    reviews: 950,
    minStake: 10,
    lockPeriod: "None",
    rewards: "Every 5 days",
    description: "Stake ADA and earn rewards while supporting the Cardano ecosystem.",
    features: ["No lock period", "Low fees", "Stake pool selection", "Delegation certificates"],
    performance: {
      day: 0.015,
      week: 0.105,
      month: 0.45,
      year: 5.5,
    },
  },
  {
    id: 5,
    name: "Avalanche Staking",
    symbol: "AVAX",
    logo: "/avalanche-landscape.png",
    apr: 9.2,
    tvl: "$3.8B",
    verified: true,
    rating: 4.5,
    reviews: 680,
    minStake: 1,
    lockPeriod: "14 days",
    rewards: "Daily",
    description: "Stake AVAX and earn rewards from Avalanche's high-throughput blockchain.",
    features: ["Validator selection", "Daily rewards", "Delegation flexibility", "P-Chain staking"],
    performance: {
      day: 0.025,
      week: 0.175,
      month: 0.75,
      year: 9.2,
    },
  },
]

// Stars component for ratings
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className="ml-2 text-sm font-light">{rating}</span>
    </div>
  )
}

// Performance indicator component
function PerformanceIndicator({ value }: { value: number }) {
  const isPositive = value >= 0
  return (
    <div className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
      <span className="text-sm font-light">
        {isPositive ? "+" : ""}
        {value.toFixed(2)}%
      </span>
    </div>
  )
}

// Stars background component
function StarsBackground() {
  return (
    <div className="absolute inset-0 z-0">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 2 + 1 + "px",
            height: Math.random() * 2 + 1 + "px",
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5 + 0.2,
          }}
        />
      ))}
    </div>
  )
}

export default function ProvidersPage() {
  const [sortBy, setSortBy] = useState("apr")

  // Sort providers based on selected criteria
  const sortedProviders = [...providers].sort((a, b) => {
    if (sortBy === "apr") return b.apr - a.apr
    if (sortBy === "rating") return b.rating - a.rating
    if (sortBy === "tvl")
      return (
        Number.parseFloat(b.tvl.replace("$", "").replace("B", "")) -
        Number.parseFloat(a.tvl.replace("$", "").replace("B", ""))
      )
    return 0
  })

  return (
    <div className="bg-[#070318] text-white min-h-screen overflow-hidden relative font-extralight">
      {/* Background effects */}
      <StarsBackground />
      <BlockchainDisplay className="opacity-20" />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header with navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <Badge className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-light mb-4">
              LYXAI
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extralight tracking-tight mb-2">Verified Staking Providers</h1>
            <p className="text-zinc-400 text-lg font-extralight max-w-2xl">
              Compare and select from our curated list of trusted staking providers with enhanced rewards and security
            </p>
          </div>

          <div className="flex gap-4 mt-6 md:mt-0">
            <Link
              href="/staking"
              className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center hover:bg-white/10 transition-all duration-300"
            >
              <span className="font-light">Back to Staking</span>
            </Link>
            <Link
              href="/"
              className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center hover:bg-white/10 transition-all duration-300"
            >
              <span className="font-light">Home</span>
            </Link>
          </div>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <TabsList className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-900/50">
                All Providers
              </TabsTrigger>
              <TabsTrigger value="verified" className="data-[state=active]:bg-purple-900/50">
                Verified Only
              </TabsTrigger>
              <TabsTrigger value="popular" className="data-[state=active]:bg-purple-900/50">
                Most Popular
              </TabsTrigger>
              <TabsTrigger value="highest" className="data-[state=active]:bg-purple-900/50">
                Highest APR
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-sm font-light mr-2">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 rounded-md px-3 py-1 text-sm font-light focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="apr">APR</option>
                <option value="rating">Rating</option>
                <option value="tvl">TVL</option>
              </select>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="verified" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProviders
                .filter((p) => p.verified)
                .map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProviders
                .sort((a, b) => b.reviews - a.reviews)
                .map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="highest" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProviders
                .sort((a, b) => b.apr - a.apr)
                .map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Comparison table */}
        <div className="mt-16">
          <h2 className="text-3xl font-extralight mb-6">Provider Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10 rounded-lg">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-light">Provider</th>
                  <th className="px-6 py-4 text-left text-sm font-light">APR</th>
                  <th className="px-6 py-4 text-left text-sm font-light">TVL</th>
                  <th className="px-6 py-4 text-left text-sm font-light">Min Stake</th>
                  <th className="px-6 py-4 text-left text-sm font-light">Lock Period</th>
                  <th className="px-6 py-4 text-left text-sm font-light">Rewards</th>
                  <th className="px-6 py-4 text-left text-sm font-light">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-light">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedProviders.map((provider) => (
                  <tr key={provider.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={provider.logo || "/placeholder.svg"}
                          alt={provider.symbol}
                          className="w-8 h-8 mr-3 rounded-full"
                        />
                        <div>
                          <div className="font-light">{provider.name}</div>
                          <div className="text-xs text-purple-400">{provider.symbol}</div>
                        </div>
                        {provider.verified && <Badge className="ml-2 bg-purple-900/50 text-xs">Verified</Badge>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-light text-green-400">{provider.apr}%</div>
                    </td>
                    <td className="px-6 py-4 font-light">{provider.tvl}</td>
                    <td className="px-6 py-4 font-light">
                      {provider.minStake} {provider.symbol}
                    </td>
                    <td className="px-6 py-4 font-light">{provider.lockPeriod}</td>
                    <td className="px-6 py-4 font-light">{provider.rewards}</td>
                    <td className="px-6 py-4">
                      <Stars rating={provider.rating} />
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-purple-900/50 border-purple-500/30 hover:bg-purple-800/70"
                      >
                        Stake Now
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistics section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-extralight">Total Value Locked</CardTitle>
              <CardDescription>Across all verified providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">$51.3B</div>
              <div className="text-sm text-green-400">+5.2% this week</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-extralight">Average APR</CardTitle>
              <CardDescription>Weighted by TVL</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">8.4%</div>
              <div className="text-sm text-green-400">+0.3% from last month</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-extralight">Active Stakers</CardTitle>
              <CardDescription>Unique wallets staking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">1.2M</div>
              <div className="text-sm text-green-400">+12.5% this quarter</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-extralight">Total Rewards</CardTitle>
              <CardDescription>Distributed in last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">$358M</div>
              <div className="text-sm text-green-400">+8.7% from previous period</div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ section */}
        <div className="mt-16">
          <h2 className="text-3xl font-extralight mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-light">What is staking?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 font-extralight">
                  Staking is the process of actively participating in transaction validation on a proof-of-stake
                  blockchain. When you stake your crypto, you lock up your assets to support network operations and earn
                  rewards in return.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-light">How are rewards calculated?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 font-extralight">
                  Staking rewards are typically calculated based on several factors: the amount staked, the duration of
                  staking, the total network stake, and the inflation rate of the cryptocurrency. Each provider may have
                  slightly different calculation methods.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-light">What are the risks of staking?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 font-extralight">
                  The main risks include price volatility of the staked asset, potential slashing penalties for
                  validator misbehavior, opportunity costs during lock-up periods, and smart contract risks. Our
                  verified providers implement various security measures to minimize these risks.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-light">What makes a provider "verified"?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 font-extralight">
                  Verified providers undergo a rigorous assessment process that evaluates their security practices,
                  operational history, technical infrastructure, and financial stability. They must maintain high
                  uptime, demonstrate proper key management, and have transparent fee structures.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating chat button */}
      <FloatingChatButton />
      <FloatingAnalyzerButton />
    </div>
  )
}

// Provider card component
function ProviderCard({ provider }: { provider: any }) {
  return (
    <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <img
              src={provider.logo || "/placeholder.svg"}
              alt={provider.symbol}
              className="w-10 h-10 mr-3 rounded-full"
            />
            <div>
              <h3 className="font-light text-lg">{provider.name}</h3>
              <div className="text-xs text-purple-400">{provider.symbol}</div>
            </div>
          </div>
          {provider.verified && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-purple-900/50 p-1 rounded-full">
                    <Check className="h-4 w-4 text-purple-300" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Verified Provider</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-light">Annual Percentage Rate</span>
            <span className="text-green-400 font-medium">{provider.apr}%</span>
          </div>
          <Progress value={provider.apr * 5} className="h-1 bg-white/10" indicatorClassName="bg-purple-500" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-zinc-400 mb-1">Total Value Locked</div>
            <div className="font-light">{provider.tvl}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-400 mb-1">Min Stake</div>
            <div className="font-light">
              {provider.minStake} {provider.symbol}
            </div>
          </div>
          <div>
            <div className="text-xs text-zinc-400 mb-1">Lock Period</div>
            <div className="font-light">{provider.lockPeriod}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-400 mb-1">Rewards</div>
            <div className="font-light">{provider.rewards}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-zinc-400 mb-1">Performance</div>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <div className="text-xs text-zinc-400">24h</div>
              <PerformanceIndicator value={provider.performance.day} />
            </div>
            <div>
              <div className="text-xs text-zinc-400">7d</div>
              <PerformanceIndicator value={provider.performance.week} />
            </div>
            <div>
              <div className="text-xs text-zinc-400">30d</div>
              <PerformanceIndicator value={provider.performance.month} />
            </div>
            <div>
              <div className="text-xs text-zinc-400">1y</div>
              <PerformanceIndicator value={provider.performance.year} />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Stars rating={provider.rating} />
          <span className="text-xs text-zinc-400">{provider.reviews} reviews</span>
        </div>

        <p className="text-sm text-zinc-300 font-extralight mb-4">{provider.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {provider.features.map((feature: string, index: number) => (
            <Badge key={index} className="bg-purple-900/30 text-xs font-light">
              {feature}
            </Badge>
          ))}
        </div>

        <Button className="w-full bg-purple-900 hover:bg-purple-800 text-white border-none">
          Stake Now <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
