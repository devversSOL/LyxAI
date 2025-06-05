"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

// Sample data for the dashboard
const stakingData = {
  totalStaked: "$24,580",
  totalRewards: "$1,245",
  pendingRewards: "$78.45",
  apr: "8.2%",
  positions: [
    {
      id: 1,
      token: "Ethereum",
      symbol: "ETH",
      logo: "/ethereal-threads.png",
      amount: "5.2 ETH",
      value: "$12,480",
      rewards: "$645",
      apr: "5.8%",
      status: "Active",
    },
    {
      id: 2,
      token: "Solana",
      symbol: "SOL",
      logo: "/abstract-sol.png",
      amount: "120 SOL",
      value: "$8,400",
      rewards: "$420",
      apr: "7.2%",
      status: "Active",
    },
    {
      id: 3,
      token: "Polkadot",
      symbol: "DOT",
      logo: "/red-dot-on-white.png",
      amount: "250 DOT",
      value: "$3,700",
      rewards: "$180",
      apr: "14.5%",
      status: "Active",
    },
  ],
  history: [
    {
      id: 1,
      type: "Stake",
      token: "ETH",
      amount: "2.5 ETH",
      value: "$6,000",
      date: "2023-04-15",
      status: "Completed",
    },
    {
      id: 2,
      type: "Reward",
      token: "ETH",
      amount: "0.12 ETH",
      value: "$288",
      date: "2023-04-10",
      status: "Completed",
    },
    {
      id: 3,
      type: "Stake",
      token: "SOL",
      amount: "120 SOL",
      value: "$8,400",
      date: "2023-04-05",
      status: "Completed",
    },
    {
      id: 4,
      type: "Reward",
      token: "SOL",
      amount: "5.4 SOL",
      value: "$378",
      date: "2023-03-28",
      status: "Completed",
    },
    {
      id: 5,
      type: "Stake",
      token: "DOT",
      amount: "250 DOT",
      value: "$3,700",
      date: "2023-03-20",
      status: "Completed",
    },
  ],
}

export default function DashboardSection() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="bg-[#070318] text-white min-h-screen overflow-hidden relative font-extralight py-16">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black to-purple-950/20"></div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <Badge className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-light mb-4">
              LYXAI DASHBOARD
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extralight tracking-tight mb-2">Your Staking Dashboard</h1>
            <p className="text-zinc-400 text-lg font-extralight max-w-2xl">
              Monitor your staking positions and rewards in real-time
            </p>
          </div>

          <div className="flex gap-4 mt-6 md:mt-0">
            <Link
              href="/staking"
              className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center hover:bg-white/10 transition-all duration-300"
            >
              <span className="font-light">Staking</span>
            </Link>
            <Link
              href="/providers"
              className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center hover:bg-white/10 transition-all duration-300"
            >
              <span className="font-light">Providers</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-extralight">Total Staked</CardTitle>
              <CardDescription>Across all positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">{stakingData.totalStaked}</div>
              <div className="text-sm text-green-400">+5.2% this week</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-extralight">Total Rewards</CardTitle>
              <CardDescription>Earned to date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">{stakingData.totalRewards}</div>
              <div className="text-sm text-green-400">+12.3% this month</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-extralight">Pending Rewards</CardTitle>
              <CardDescription>Available to claim</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">{stakingData.pendingRewards}</div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" className="bg-purple-900 hover:bg-purple-800 text-white border-none">
                  Claim All
                </Button>
                <Button size="sm" variant="outline" className="border-purple-500/30 hover:bg-purple-800/70">
                  Restake
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-extralight">Average APR</CardTitle>
              <CardDescription>Weighted by value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">{stakingData.apr}</div>
              <div className="text-sm text-green-400">+0.3% from last month</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 p-1 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-900/50">
              Overview
            </TabsTrigger>
            <TabsTrigger value="positions" className="data-[state=active]:bg-purple-900/50">
              Staking Positions
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-purple-900/50">
              Transaction History
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-purple-900/50">
              Rewards Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extralight">Portfolio Overview</CardTitle>
                    <CardDescription>Your staking portfolio distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-light mb-2">Portfolio Chart</div>
                        <div className="text-sm text-zinc-400">
                          (This would be a chart showing the distribution of staked assets)
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extralight">Quick Actions</CardTitle>
                    <CardDescription>Common staking operations</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <Button className="bg-purple-900 hover:bg-purple-800 text-white border-none w-full justify-between">
                      Stake New Assets
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-500/30 hover:bg-purple-800/70 w-full justify-between"
                    >
                      Claim All Rewards
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-500/30 hover:bg-purple-800/70 w-full justify-between"
                    >
                      Restake Rewards
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-500/30 hover:bg-purple-800/70 w-full justify-between"
                    >
                      Unstake Assets
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="positions" className="mt-0">
            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-extralight">Active Staking Positions</CardTitle>
                <CardDescription>Your currently staked assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-sm font-light">Token</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Value</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Rewards</th>
                        <th className="px-6 py-4 text-left text-sm font-light">APR</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stakingData.positions.map((position) => (
                        <tr key={position.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img
                                src={position.logo || "/placeholder.svg"}
                                alt={position.symbol}
                                className="w-8 h-8 mr-3 rounded-full"
                              />
                              <div>
                                <div className="font-light">{position.token}</div>
                                <div className="text-xs text-purple-400">{position.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-light">{position.amount}</td>
                          <td className="px-6 py-4 font-light">{position.value}</td>
                          <td className="px-6 py-4 font-light">{position.rewards}</td>
                          <td className="px-6 py-4">
                            <div className="font-light text-green-400">{position.apr}</div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className="bg-green-900/50 text-green-300">{position.status}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-500/30 hover:bg-purple-800/70"
                              >
                                Claim
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-500/30 hover:bg-purple-800/70"
                              >
                                Unstake
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

          <TabsContent value="history" className="mt-0">
            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-extralight">Transaction History</CardTitle>
                <CardDescription>Recent staking activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-sm font-light">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Token</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Value</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-light">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stakingData.history.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <Badge
                              className={
                                transaction.type === "Stake"
                                  ? "bg-blue-900/50 text-blue-300"
                                  : "bg-green-900/50 text-green-300"
                              }
                            >
                              {transaction.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 font-light">{transaction.token}</td>
                          <td className="px-6 py-4 font-light">{transaction.amount}</td>
                          <td className="px-6 py-4 font-light">{transaction.value}</td>
                          <td className="px-6 py-4 font-light">{new Date(transaction.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <Badge className="bg-green-900/50 text-green-300">{transaction.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extralight">Rewards Growth</CardTitle>
                    <CardDescription>Cumulative rewards over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-light mb-2">Rewards Chart</div>
                        <div className="text-sm text-zinc-400">
                          (This would be a chart showing rewards growth over time)
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extralight">Rewards Breakdown</CardTitle>
                    <CardDescription>By token</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stakingData.positions.map((position) => (
                        <div key={position.id} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <img
                              src={position.logo || "/placeholder.svg"}
                              alt={position.symbol}
                              className="w-6 h-6 mr-2 rounded-full"
                            />
                            <span className="font-light">{position.token}</span>
                          </div>
                          <div className="font-light">{position.rewards}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10 mt-6">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extralight">Projected Earnings</CardTitle>
                    <CardDescription>Based on current rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-light">Monthly</span>
                        <span className="font-light">$168</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-light">Quarterly</span>
                        <span className="font-light">$504</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-light">Yearly</span>
                        <span className="font-light">$2,016</span>
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
