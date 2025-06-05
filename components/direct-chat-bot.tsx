"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  X,
  Send,
  Bot,
  User,
  Loader2,
  AlertTriangle,
  Search,
  Wallet,
  Clock,
  ArrowUpRight,
  Twitter,
  Users,
  Brain,
} from "lucide-react"
import { generateChatResponse, generateWalletOpinion } from "@/app/actions/openai-actions"
import { Badge } from "@/components/ui/badge"

interface Message {
  role: "user" | "assistant"
  content: string
  isError?: boolean
  addressType?: "wallet" | "contract" | "unknown"
  showRedirectButton?: boolean
  tokenAddress?: string
  walletData?: WalletAnalysisData
}

interface WalletAnalysisData {
  address: string
  summary?: string
  avatar?: string
  twitterUrl?: string
  twitterFollowers?: number
  databaseDescription?: string
  aiOpinion?: string
  performance?: {
    winRate?: string
    roi?: string
    totalTrades?: number
    profitableTrades?: number
    pnl?: string
    totalValue?: string
    solBalance?: string
    recentProfit7d?: string
    recentProfit30d?: string
  }
  holdings?: Array<{
    symbol: string
    name?: string
    amount?: string
    value?: string
    usdValue?: number
  }>
  activity?: Array<{
    type: string
    symbol: string
    time: string
    profit?: string
    isWin?: boolean
    pnl?: string
    amount?: string
  }>
  rawData?: any // Store the raw API response for debugging
}

interface DirectChatBotProps {
  isOpen: boolean
  onClose: () => void
}

// Update the generateFallbackResponse function to remove toLowerCase() calls
const generateFallbackResponse = (input: string | undefined): string => {
  // Ensure input is a string
  const safeInput = input || ""

  // Use case-insensitive regex instead of toLowerCase()
  if (/wallet|address/i.test(safeInput)) {
    return "To look up a Solana wallet address, you can use explorers like Solscan (solscan.io), Solana Explorer (explorer.solana.com), or Solana FM (solana.fm). Simply paste the wallet address into the search bar of any of these explorers to view its balance, transaction history, and token holdings."
  }

  if (/transaction|tx/i.test(safeInput)) {
    return "To analyze a Solana transaction, copy the transaction ID (a long string of characters) and paste it into Solscan or Solana Explorer. This will show you the sender, receiver, amount transferred, transaction fee, and other details about the transaction."
  }

  if (/token|nft/i.test(safeInput)) {
    return "Solana tokens and NFTs can be viewed on explorers like Solscan. You can see details like the token's supply, holders, and transaction history. For NFTs, you can also use specialized marketplaces like Magic Eden to view the collection and trading history."
  }

  return "I'm currently having trouble connecting to my knowledge base, but I can help with basic Solana blockchain questions. You can look up wallet addresses, transactions, and tokens using explorers like Solscan (solscan.io) or Solana Explorer (explorer.solana.com). For more specific information, please try again later when my connection is restored."
}

// Simple function to detect if input looks like a Solana address
const isSolanaAddress = (input: string): boolean => {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(input.trim())
}

// Replace the checkAddressTypeWithHelius function with a call to our API route:
async function checkAddressTypeWithAPI(address: string): Promise<{ isWallet: boolean; isToken: boolean }> {
  try {
    console.log("🔍 Checking address type via API route:", address)

    const response = await fetch(`/api/check-address-type?address=${encodeURIComponent(address)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    console.log(`Address type API response status: ${response.status}`)

    if (!response.ok) {
      console.error(`Address type API error: ${response.status}`)
      // Default to assuming it's a wallet if there's an error
      return { isWallet: true, isToken: false }
    }

    const data = await response.json()
    console.log("Address type API response:", data)

    return {
      isWallet: data.isWallet || false,
      isToken: data.isToken || false,
    }
  } catch (error) {
    console.error("❌ Error checking address type via API:", error)
    // Default to assuming it's a wallet if there's an error
    return { isWallet: true, isToken: false }
  }
}

// Enhanced function to parse wallet data from Railway API response
function parseWalletData(address: string, rawData: any): WalletAnalysisData {
  console.log("🔍 Parsing wallet data from Railway API response...")

  // Helper function to safely get nested values
  const safeGet = (obj: any, path: string, defaultValue: any = "Unknown") => {
    try {
      return path.split(".").reduce((current, key) => current?.[key], obj) ?? defaultValue
    } catch {
      return defaultValue
    }
  }

  // Helper function to format numbers
  const formatNumber = (value: any) => {
    if (typeof value === "number") return value.toLocaleString()
    if (typeof value === "string" && !isNaN(Number(value))) return Number(value).toLocaleString()
    return value || "Unknown"
  }

  // Helper function to format percentage
  const formatPercentage = (value: any) => {
    if (typeof value === "number") return `${value.toFixed(2)}%`
    if (typeof value === "string" && value.includes("%")) return value
    if (typeof value === "string" && !isNaN(Number(value))) return `${Number(value).toFixed(2)}%`
    return value || "Unknown"
  }

  // Helper function to format currency
  const formatCurrency = (value: any) => {
    if (typeof value === "number") return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    if (typeof value === "string" && !isNaN(Number(value)))
      return `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    return value || "Unknown"
  }

  // Helper function to format follower count
  const formatFollowers = (value: any) => {
    if (typeof value === "number") {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
      return value.toLocaleString()
    }
    if (typeof value === "string" && !isNaN(Number(value))) {
      const num = Number(value)
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
      return num.toLocaleString()
    }
    return null
  }

  // Check if data is nested in a "data" property
  const data = rawData.data || rawData

  // Extract database description from API response
  const databaseDescription = rawData.databaseDescription || null

  // Extract performance metrics
  const performance = {
    winRate: formatPercentage(safeGet(data, "winrate") || safeGet(data, "win_rate")),
    totalValue: formatCurrency(safeGet(data, "total_value")),
    solBalance: formatNumber(safeGet(data, "sol_balance")),
    pnl: formatCurrency(safeGet(data, "total_profit")),
    recentProfit7d: formatCurrency(safeGet(data, "realized_profit_7d")),
    recentProfit30d: formatCurrency(safeGet(data, "realized_profit_30d")),
  }

  // Extract social info
  const avatar = safeGet(data, "avatar", null)
  const twitterUrl = safeGet(data, "twitter_url", null)
  const twitterFollowers = formatFollowers(
    safeGet(data, "twitter_followers") ||
      safeGet(data, "followers") ||
      safeGet(data, "follower_count") ||
      safeGet(data, "followers_count"),
  )
  const twitterHandle = twitterUrl ? twitterUrl.split("/").pop() : null

  // Generate summary with database description seamlessly integrated
  let summary = ""

  // Integrate database description naturally into the analysis
  if (databaseDescription) {
    summary = `${databaseDescription} `
  }

  if (twitterHandle) {
    summary += `This wallet belongs to Twitter user @${twitterHandle}`
    if (twitterFollowers) {
      summary += ` (${twitterFollowers} followers)`
    }
    summary += `. `
  }

  if (performance.winRate !== "Unknown") {
    summary += `It has a ${performance.winRate} win rate on trades. `
  }

  if (performance.pnl !== "Unknown") {
    summary += `Total profit is ${performance.pnl}. `
  }

  if (performance.recentProfit30d !== "Unknown") {
    summary += `In the last 30 days, this wallet has made ${performance.recentProfit30d}. `
  }

  if (performance.solBalance !== "Unknown") {
    summary += `Current SOL balance is ${performance.solBalance} SOL. `
  }

  if (!summary || summary === `${databaseDescription} `) {
    summary += "Wallet analysis completed. Check the metrics below for detailed information."
  }

  // Create holdings from SOL balance
  const holdings = []
  if (data.sol_balance) {
    holdings.push({
      symbol: "SOL",
      name: "Solana",
      amount: formatNumber(data.sol_balance),
      value: formatCurrency(Number(data.sol_balance) * 150), // Approximate SOL price
    })
  }

  // Create activity from profit data
  const activity = []
  if (data.realized_profit_7d) {
    activity.push({
      type: "Trading",
      symbol: "Multiple",
      time: "Last 7 days",
      profit: formatCurrency(data.realized_profit_7d),
      isWin: Number(data.realized_profit_7d) > 0,
    })
  }
  if (data.realized_profit_30d) {
    activity.push({
      type: "Trading",
      symbol: "Multiple",
      time: "Last 30 days",
      profit: formatCurrency(data.realized_profit_30d),
      isWin: Number(data.realized_profit_30d) > 0,
    })
  }

  console.log("✅ Parsed performance metrics:", performance)

  return {
    address,
    rawData,
    summary,
    avatar,
    twitterUrl,
    twitterFollowers: typeof twitterFollowers === "string" ? null : twitterFollowers,
    databaseDescription,
    performance,
    holdings,
    activity,
  }
}

// Function to get wallet info using our API route
async function getWalletInfoFromAPI(address: string): Promise<WalletAnalysisData | null> {
  try {
    console.log("🔍 Fetching wallet info via API route:", address)

    const response = await fetch(`/api/wallet-info?address=${encodeURIComponent(address)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    console.log(`Wallet info API response status: ${response.status}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Wallet info API error: ${response.status}`, errorData)
      return null
    }

    const data = await response.json()
    console.log("Raw wallet data received:", JSON.stringify(data).substring(0, 500) + "...")

    // Use the enhanced parsing function
    const walletData = parseWalletData(address, data)

    // Generate AI opinion about the wallet
    try {
      console.log("🤖 Generating AI opinion for wallet...")
      const opinionResult = await generateWalletOpinion(data, walletData.databaseDescription)

      if (opinionResult.success && opinionResult.opinion) {
        walletData.aiOpinion = opinionResult.opinion
        console.log("✅ Successfully generated AI opinion")
      } else {
        console.log("⚠️ Could not generate AI opinion:", opinionResult.error)
      }
    } catch (error) {
      console.error("❌ Error generating AI opinion:", error)
      // Continue without AI opinion
    }

    console.log("✅ Successfully processed wallet data")
    return walletData
  } catch (error) {
    console.error("❌ Error fetching wallet info via API route:", error)
    return null
  }
}

export default function DirectChatBot({ isOpen, onClose }: DirectChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm LyxAI, your Solana wallet assistant. Paste any Solana wallet address and I'll analyze its trading performance, holdings, and activity. I specialize in wallet analysis - for token contracts, use our 'Why did it send?' analyzer.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a message using server action
  const handleSendMessage = async () => {
    // Don't proceed if there's no input or if we're already loading
    if (!input.trim() || isLoading) return

    // Get the user's input and create a user message
    const userContent = input.trim()
    const userMessage: Message = {
      role: "user",
      content: userContent,
    }

    // Update UI state
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setErrorDetails(null)

    // Check if this looks like a Solana address
    if (isSolanaAddress(userContent)) {
      try {
        // Use proper API to check if it's a wallet or token
        console.log("🔍 Checking if address is wallet or token:", userContent)
        const addressType = await checkAddressTypeWithAPI(userContent)

        if (addressType.isToken) {
          console.log("✅ Confirmed as token contract, showing redirect")
          const tokenRedirectMessage: Message = {
            role: "assistant",
            content: `## Token Contract Detected

The address \`${userContent}\` appears to be a token contract, not a wallet address.

For token analysis and to understand "why did it send" to your wallet, please use our specialized contract analyzer.`,
            addressType: "contract",
            showRedirectButton: true,
            tokenAddress: userContent,
          }

          setMessages((prev) => [...prev, tokenRedirectMessage])
          setIsLoading(false)
          return
        } else {
          console.log("✅ Confirmed as wallet address, proceeding with wallet analysis")

          // Fetch wallet data using our API route
          const walletData = await getWalletInfoFromAPI(userContent)

          if (walletData) {
            console.log("✅ Successfully fetched wallet data")

            // Create a message with the wallet analysis data
            const walletAnalysisMessage: Message = {
              role: "assistant",
              content: `## Wallet Analysis: ${userContent.slice(0, 4)}...${userContent.slice(-4)}

${walletData.summary || ""}

**Performance Metrics:**
- Win Rate: ${walletData.performance?.winRate || "Unknown"}
- Total Profit: ${walletData.performance?.pnl || "Unknown"}
- 30-Day Profit: ${walletData.performance?.recentProfit30d || "Unknown"}
- 7-Day Profit: ${walletData.performance?.recentProfit7d || "Unknown"}
- Portfolio Value: ${walletData.performance?.totalValue || "Unknown"}
- SOL Balance: ${walletData.performance?.solBalance || "Unknown"} SOL

Check the wallet details below for holdings and recent activity.`,
              addressType: "wallet",
              walletData: walletData,
            }

            setMessages((prev) => [...prev, walletAnalysisMessage])
            setIsLoading(false)
            return
          } else {
            // If we couldn't get wallet data, show a fallback message
            const fallbackMessage: Message = {
              role: "assistant",
              content: `## Wallet Address Detected

I've identified \`${userContent}\` as a wallet address, but I'm having trouble fetching detailed analysis data right now.

You can view this wallet on [Solscan](https://solscan.io/account/${userContent}) or [Solana Explorer](https://explorer.solana.com/address/${userContent}) for basic information.

Please try again in a moment, or ask me any other questions about Solana!`,
              addressType: "wallet",
            }

            setMessages((prev) => [...prev, fallbackMessage])
            setIsLoading(false)
            return
          }
        }
      } catch (error) {
        console.error("❌ Error checking address type:", error)
        // If there's an error checking the address type, proceed with normal chat
        console.log("⚠️ Proceeding with normal chat due to address check error")
      }
    }

    try {
      // Call the server action to generate a response
      const result = await generateChatResponse(userContent)

      if (!result.success) {
        throw new Error(result.error || "Failed to generate response: " + (result.details || "Unknown error"))
      }

      // Create and add the assistant message
      const assistantMessage: Message = {
        role: "assistant",
        content: result.response,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error("Error generating response:", error)

      // Store error details for debugging
      setErrorDetails(error.message || "Unknown error")

      // Use fallback response
      const fallbackContent = generateFallbackResponse(userContent)
      const fallbackMessage: Message = {
        role: "assistant",
        content: fallbackContent,
        isError: true,
      }

      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[80vh] bg-[#0a0a18] border border-purple-900/30 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-purple-900/30 flex justify-between items-center bg-[#1a1a3a]/50">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-light">LyxAI Wallet Assistant</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-purple-900/20">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-purple-900/30 text-white"
                    : message.isError
                      ? "bg-red-900/30 border border-red-500/30"
                      : "bg-[#1a1a3a]/50 border border-purple-900/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === "assistant" ? (
                    message.isError ? (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    ) : (
                      <Bot className="h-4 w-4 text-purple-400" />
                    )
                  ) : (
                    <User className="h-4 w-4 text-purple-400" />
                  )}
                  <span className="text-xs text-purple-300 font-medium">
                    {message.role === "user" ? "You" : "LyxAI"}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                {/* Show wallet data if available */}
                {message.walletData && (
                  <div className="mt-4 space-y-4">
                    {/* AI Opinion Section */}
                    {message.walletData.aiOpinion && (
                      <div className="p-3 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/30">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Brain className="h-3.5 w-3.5 text-purple-400" />
                          <h3 className="text-xs font-medium text-purple-300">AI ANALYSIS</h3>
                        </div>
                        <p className="text-xs text-zinc-200 leading-relaxed">{message.walletData.aiOpinion}</p>
                      </div>
                    )}

                    {/* Twitter profile if available */}
                    {message.walletData.twitterUrl && (
                      <div className="flex items-center gap-2 p-2 bg-[#1a1a3a]/30 rounded-lg border border-purple-900/20">
                        {message.walletData.avatar && (
                          <img
                            src={message.walletData.avatar || "/placeholder.svg"}
                            alt="Twitter avatar"
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <Twitter className="h-3.5 w-3.5 text-[#1DA1F2]" />
                            <a
                              href={message.walletData.twitterUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#1DA1F2] hover:underline"
                            >
                              @{message.walletData.twitterUrl.split("/").pop()}
                            </a>
                            {message.walletData.twitterFollowers && (
                              <div className="flex items-center gap-1 ml-2">
                                <Users className="h-3 w-3 text-zinc-400" />
                                <span className="text-xs text-zinc-400">
                                  {typeof message.walletData.twitterFollowers === "number"
                                    ? message.walletData.twitterFollowers.toLocaleString()
                                    : message.walletData.twitterFollowers}{" "}
                                  followers
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400">Twitter account linked to this wallet</p>
                        </div>
                      </div>
                    )}

                    {/* Holdings Section */}
                    {message.walletData.holdings && message.walletData.holdings.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Wallet className="h-3.5 w-3.5 text-purple-400" />
                          <h3 className="text-xs font-medium text-purple-300">TOP HOLDINGS</h3>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {message.walletData.holdings.slice(0, 5).map((holding, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-purple-900/20 text-purple-100 border-purple-500/30"
                            >
                              {holding.symbol} {holding.amount && `(${holding.amount})`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent Activity Section */}
                    {message.walletData.activity && message.walletData.activity.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-purple-400" />
                          <h3 className="text-xs font-medium text-purple-300">RECENT ACTIVITY</h3>
                        </div>
                        <div className="space-y-1.5">
                          {message.walletData.activity.slice(0, 3).map((activity, idx) => (
                            <div
                              key={idx}
                              className={`text-xs px-2 py-1 rounded flex items-center justify-between ${
                                activity.isWin === false
                                  ? "bg-red-900/20 border border-red-500/20"
                                  : activity.isWin === true
                                    ? "bg-green-900/20 border border-green-500/20"
                                    : "bg-purple-900/20 border border-purple-500/20"
                              }`}
                            >
                              <span>
                                {activity.type} {activity.symbol}
                              </span>
                              <div className="flex items-center gap-1">
                                <span>{activity.time}</span>
                                {activity.profit && (
                                  <span className={activity.isWin ? "text-green-400" : "text-red-400"}>
                                    {activity.profit}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View on Explorer Button */}
                    <div className="pt-1">
                      <a
                        href={`https://solscan.io/account/${message.walletData.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300"
                      >
                        View on Solscan <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Show redirect button for token contracts */}
                {message.showRedirectButton && message.tokenAddress && (
                  <div className="mt-3">
                    <Button
                      onClick={() => {
                        onClose() // Close current chat
                        // Trigger opening the contract analyzer with the token address
                        window.dispatchEvent(
                          new CustomEvent("openContractAnalyzer", {
                            detail: { address: message.tokenAddress },
                          }),
                        )
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                    >
                      <Search className="h-4 w-4" />
                      Analyze with "Why did it send?"
                    </Button>
                  </div>
                )}

                {/* Show error details for debugging if available */}
                {message.isError && errorDetails && (
                  <div className="mt-2 pt-2 border-t border-red-500/30 text-xs text-red-300">
                    <p>Error details (for debugging): {errorDetails}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-[#1a1a3a]/50 border border-purple-900/20">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium">LyxAI</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                  <p className="text-sm">Analyzing wallet...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-purple-900/30 bg-[#1a1a3a]/30">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Paste a Solana wallet address to analyze trading performance..."
              className="bg-[#0a0a18] border-purple-900/30 focus-visible:ring-purple-500"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-purple-900 hover:bg-purple-800"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            LyxAI provides Solana wallet analysis and trading insights. Your conversations may be reviewed to improve
            our service.
          </p>
        </div>
      </Card>
    </div>
  )
}
