"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  X,
  Send,
  User,
  Loader2,
  Search,
  AlertTriangle,
  ExternalLink,
  Shield,
  BarChart3,
  Calendar,
  Wallet,
  FileCode,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { analyzeSolanaToken, fetchTokenData, checkAddressType } from "@/app/actions/openai-actions"

// Update the Message interface to include walletData
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  isError?: boolean
  tokenData?: TokenData | null
  note?: string
  addressType?: "wallet" | "contract" | "unknown"
  walletData?: {
    address: string
    winRate?: string
    roi?: string
    totalTrades?: number
    profitableTrades?: number
    lastTradedCoins?: Array<{
      symbol: string
      name?: string
      time?: string
      profit?: string
      isWin?: boolean
    }>
  }
}

// Update the TokenData interface to remove sentiment fields
interface TokenData {
  name?: string
  symbol?: string
  image?: string
  address: string
  decimals?: number
  marketCap?: number
  socials?: {
    twitter?: string
    telegram?: string
    discord?: string
    website?: string
  }
  isVerified?: boolean
  dexScreenerData?: any
  createdAt?: string
  pairId?: string
}

interface DirectContractAnalyzerProps {
  isOpen: boolean
  onClose: () => void
  prefilledAddress?: string
}

// Function to generate a colorful token icon based on the token symbol
function generateTokenIcon(symbol: string | undefined): { background: string; text: string } {
  // Default values
  if (!symbol || symbol === "???") {
    return { background: "#8b5cf6", text: "#ffffff" }
  }

  // Generate a consistent color based on the symbol
  const hash = symbol.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  // Generate a hue between 0 and 360
  const hue = Math.abs(hash) % 360

  // Use a high saturation and medium lightness for vibrant colors
  const background = `hsl(${hue}, 70%, 40%)`

  // Always use white text for better contrast
  const text = "#ffffff"

  return { background, text }
}

// Function to try getting token image from Solscan as a fallback
async function getSolscanTokenImage(address: string): Promise<string | null> {
  try {
    // Use the Solscan API to get token info
    const apiKey = process.env.SOLSCAN_API_KEY
    const url = `https://public-api.solscan.io/token/meta?tokenAddress=${address}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(apiKey ? { token: apiKey } : {}),
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.icon || data.logoURI || null
  } catch (error) {
    console.error("Error fetching Solscan token image:", error)
    return null
  }
}

// Helper function to format addresses
function formatAddress(address: string): string {
  if (!address || address.length < 10) return address
  return address.substring(0, 6) + "..." + address.substring(address.length - 4)
}

// Helper function to format large numbers
function formatNumber(num: number | undefined): string {
  if (!num) return "Unknown"

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + "B"
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K"
  }
  return num.toFixed(2)
}

// Fallback response function in case the API fails
const generateFallbackResponse = (input: string): string => {
  // Check if input looks like a Solana address (simplified check)
  const isSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(input.trim())

  if (!isSolanaAddress) {
    return "I need a Solana address or token to analyze. Please provide a valid Solana address (typically 32-44 characters starting with a letter or number)."
  }

  return `I'm currently having trouble connecting to my analysis service, but I can tell you that ${input.substring(0, 8)}... appears to be a Solana address or token. 

To analyze this token:

1. You can check it on Solscan by visiting: https://solscan.io/account/${input}
2. Look for details like token name, creator, and transaction history
3. Be cautious with unknown tokens, especially if they were sent to you unexpectedly
4. Check social media platforms like Twitter for mentions of this token

For security reasons, I recommend researching any token thoroughly before interacting with it.`
}

export default function DirectContractAnalyzer({ isOpen, onClose, prefilledAddress }: DirectContractAnalyzerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm the Solana Contract Analyzer. Paste any Solana contract address or SPL token, and I'll tell you why it might have been sent to you. I'll analyze the token creator's reputation on X (Twitter), check if they're famous or known, and determine if the token is part of a viral trend on social media platforms.",
    },
  ])
  const [input, setInput] = useState(prefilledAddress || "")
  const [isLoading, setIsLoading] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // Add a state to track iframe loading
  const [iframeLoading, setIframeLoading] = useState<{ [key: string]: boolean }>({})

  // Update input when prefilledAddress changes
  useEffect(() => {
    if (prefilledAddress) {
      setInput(prefilledAddress)
      // Auto-analyze the prefilled address
      setTimeout(() => {
        handleSendMessage()
      }, 500)
    }
  }, [prefilledAddress])

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

  // Combined function to handle sending a message
  const handleSendMessage = async () => {
    // Don't proceed if there's no input or if we're already loading
    if (!input.trim() || isLoading) return

    // Get the user's input and create a user message
    const userContent = input.trim()
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userContent,
    }

    // Update UI state
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setErrorDetails(null)

    try {
      // Check if input looks like a Solana address
      const isSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(userContent.trim())

      if (!isSolanaAddress) {
        throw new Error("Please provide a valid Solana address (typically 32-44 characters).")
      }

      // Check if the address is a wallet or token using Helius API
      console.log("Checking if address is a wallet or token...")
      const addressTypeResult = await checkAddressType(userContent)

      // Log the result for debugging
      console.log("Address type check result:", addressTypeResult)

      // If it's a wallet, show wallet info
      if (addressTypeResult.type === "wallet") {
        console.log("Address is a wallet. Showing wallet data.")

        // Check if login is required
        const loginRequired =
          addressTypeResult.winRate === "Login required" ||
          addressTypeResult.winRate === "Login required to view" ||
          addressTypeResult.winRate === "Unknown"

        // Create and add the wallet info message with the last traded coins
        const walletInfoMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: loginRequired
            ? `## Wallet Address Detected

The address \`${userContent}\` is a valid Solana wallet.

${
  addressTypeResult.winRate === "Unknown"
    ? ""
    : "**Note:** Login is required on GMGN.ai to view this wallet's trading metrics and history."
}

You can view detailed trading performance for this wallet on GMGN.ai by clicking the button below.

You can also check this wallet's token holdings and transaction history on:
- [Solscan](https://solscan.io/account/${userContent})
- [Solana Explorer](https://explorer.solana.com/address/${userContent})`
            : `## Wallet Address Detected

The address \`${userContent}\` appears to be a Solana wallet.

${
  (addressTypeResult.winRate && addressTypeResult.winRate !== "Unknown") ||
  (addressTypeResult.roi && addressTypeResult.roi !== "Unknown") ||
  addressTypeResult.totalTrades ||
  addressTypeResult.profitableTrades
    ? "**Wallet Performance:**"
    : ""
}
${addressTypeResult.winRate && addressTypeResult.winRate !== "Unknown" ? `- **Win Rate:** ${addressTypeResult.winRate}` : ""}
${addressTypeResult.roi && addressTypeResult.roi !== "Unknown" ? `- **ROI:** ${addressTypeResult.roi}` : ""}
${addressTypeResult.totalTrades ? `- **Total Trades:** ${addressTypeResult.totalTrades}` : ""}
${addressTypeResult.profitableTrades ? `- **Profitable Trades:** ${addressTypeResult.profitableTrades}` : ""}

You can view detailed trading performance for this wallet on GMGN.ai by clicking the button below.

You can also check this wallet's token holdings and transaction history on:
- [Solscan](https://solscan.io/account/${userContent})
- [Solana Explorer](https://explorer.solana.com/address/${userContent})`,
          addressType: "wallet",
          walletData: {
            address: userContent,
            winRate: addressTypeResult.winRate,
            roi: addressTypeResult.roi,
            totalTrades: addressTypeResult.totalTrades,
            profitableTrades: addressTypeResult.profitableTrades,
            lastTradedCoins: addressTypeResult.lastTradedCoins,
          },
        }

        setMessages((prev) => [...prev, walletInfoMessage])
        setIsLoading(false)
        return
      }

      // If we get here, it's a token or unknown, so proceed with token analysis
      console.log("Address is a token or unknown. Proceeding with token analysis...")

      // Step 1: Fetch token data from DexScreener using server action
      console.log("Fetching token data from DexScreener...")
      const tokenDataResult = await fetchTokenData(userContent)

      let tokenData = null
      let note = undefined

      if (tokenDataResult.success && tokenDataResult.data) {
        tokenData = tokenDataResult.data
        note = tokenDataResult.note

        // Step 2: Generate analysis using server action
        console.log("Generating token analysis...")
        const analysisResult = await analyzeSolanaToken(userContent, tokenData, note)

        if (!analysisResult.success) {
          throw new Error(
            analysisResult.error || "Failed to analyze token: " + (analysisResult.details || "Unknown error"),
          )
        }

        // Create the response message
        const responseContent = analysisResult.analysis

        // Create and add the assistant message
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: responseContent,
          tokenData: tokenData,
          note: note,
          addressType: "contract",
        }

        // If we don't have an image, try to get one from Solscan
        if (!tokenData.image) {
          try {
            console.log("Trying to get token image from Solscan...")
            const solscanImage = await getSolscanTokenImage(userContent)
            if (solscanImage) {
              console.log("Found image from Solscan:", solscanImage)
              tokenData.image = solscanImage
            }
          } catch (error) {
            console.error("Error getting Solscan image:", error)
          }
        }

        // Initialize iframe loading state for this message
        setIframeLoading((prev) => ({ ...prev, [assistantMessage.id]: true }))

        setMessages((prev) => [...prev, assistantMessage])
      } else {
        // Handle the case where token data wasn't found
        const errorMessage = tokenDataResult.error || "Token not found"
        const errorDetails = tokenDataResult.details || "No additional details available"

        // Get the analysis from analyzeSolanaToken even for error cases
        const analysisResult = await analyzeSolanaToken(userContent, null)

        // Create and add the error message
        const errorResponseMessage: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            analysisResult.analysis ||
            `## Address Analysis

The address \`${userContent}\` was not found in DexScreener and doesn't appear to be a wallet with trading activity.

This could be because:
- It's a new or inactive wallet
- It's a contract that's not a tradable token
- It's a program address
- The address may be incorrect

You can try checking this address directly on:
- [Solscan](https://solscan.io/account/${userContent})
- [Solana Explorer](https://explorer.solana.com/address/${userContent})`,
          isError: true,
          addressType: "unknown",
        }

        setMessages((prev) => [...prev, errorResponseMessage])
        setErrorDetails(`${errorMessage}: ${errorDetails}`)
      }
    } catch (error: any) {
      console.error("Error analyzing address:", error)

      // Store error details for debugging
      setErrorDetails(error.message || "Unknown error")

      // Create a direct error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `## Error Analyzing Address

There was an error while analyzing this address: ${error.message || "Unknown error"}

You can try checking this address directly on:
- [Solscan](https://solscan.io/account/${input})
- [DexScreener](https://dexscreener.com/solana/${input})
- [Solana Explorer](https://explorer.solana.com/address/${input})
- [GMGN.ai](https://gmgn.ai/sol/address/${input})`,
        isError: true,
      }

      setMessages((prev) => [...prev, errorMessage])
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
            <Search className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-light text-white">Why Did It Send?</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-purple-900/20">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => {
            const userContent = message.content
            const addressTypeResult = message.tokenData ? message.tokenData : {}
            return (
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
                      ) : message.addressType === "wallet" ? (
                        <Wallet className="h-4 w-4 text-blue-400" />
                      ) : (
                        <FileCode className="h-4 w-4 text-purple-400" />
                      )
                    ) : (
                      <User className="h-4 w-4 text-purple-400" />
                    )}
                    <span className="text-xs text-purple-300 font-medium">
                      {message.role === "user"
                        ? "You"
                        : message.addressType === "wallet"
                          ? "Wallet Analyzer"
                          : "Token Analyzer"}
                    </span>
                  </div>

                  {/* Token Card - Only show for token data */}
                  {message.role === "assistant" && message.tokenData && message.addressType === "contract" && (
                    <div className="mb-3 p-3 bg-purple-900/20 rounded-md border border-purple-500/30">
                      {/* Token Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-purple-800/50 flex items-center justify-center overflow-hidden">
                          {/* Always use the symbol-based display instead of trying to load images */}
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              backgroundColor: generateTokenIcon(message.tokenData.symbol).background,
                              color: generateTokenIcon(message.tokenData.symbol).text,
                            }}
                          >
                            <span className="text-lg font-bold">
                              {message.tokenData.symbol?.substring(0, 2) || "?"}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg text-white">
                            {message.tokenData.name || "Unknown Token"}
                          </div>
                          <div className="text-sm text-purple-300 flex items-center gap-2 flex-wrap">
                            <span className="bg-purple-800/50 px-2 py-0.5 rounded-full">
                              {message.tokenData.symbol || "???"}
                            </span>
                            {message.tokenData.isVerified && (
                              <span className="bg-green-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Shield className="h-3 w-3" /> Verified
                              </span>
                            )}
                            {message.tokenData.createdAt && (
                              <span className="bg-blue-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Calendar className="h-3 w-3" />{" "}
                                {new Date(message.tokenData.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Limited Data Note */}
                      {message.note && (
                        <div className="mb-3 p-2 bg-yellow-900/20 rounded border border-yellow-500/30 text-yellow-300 text-xs">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{message.note}</span>
                          </div>
                        </div>
                      )}

                      {/* Key Information - Focused on what was requested */}
                      <div className="grid grid-cols-1 gap-2 mb-3">
                        {/* Market Cap */}
                        {message.tokenData.marketCap && (
                          <div className="bg-purple-900/10 p-2 rounded border border-purple-500/20">
                            <div className="text-xs text-purple-300 flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" /> Market Cap
                            </div>
                            <div className="font-medium text-white">${formatNumber(message.tokenData.marketCap)}</div>
                          </div>
                        )}
                      </div>

                      {/* Social Widget - NEW SECTION */}
                      {message.tokenData.symbol && message.tokenData.pairId && (
                        <div className="mb-3 mt-4">
                          <div className="text-sm text-blue-300 mb-2 font-medium">Social Media Activity</div>
                          <div className="bg-blue-900/10 p-2 rounded border border-blue-500/20 relative">
                            {iframeLoading[message.id] !== false && (
                              <div className="absolute inset-0 flex items-center justify-center bg-blue-900/30 z-10">
                                <div className="flex flex-col items-center">
                                  <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-2" />
                                  <span className="text-sm text-blue-300">Loading social data...</span>
                                </div>
                              </div>
                            )}
                            <iframe
                              src={`https://widgets.x-alpha.ai/social-widget?chain=solana&symbol=${message.tokenData.symbol}&pairId=${message.tokenData.pairId}`}
                              width="100%"
                              height="400"
                              title="Token Social Activity"
                              className="border-none rounded"
                              onLoad={() => {
                                setIframeLoading((prev) => ({ ...prev, [message.id]: false }))
                              }}
                              onError={(e) => {
                                setIframeLoading((prev) => ({ ...prev, [message.id]: false }))
                                const target = e.target as HTMLIFrameElement
                                const parent = target.parentElement
                                if (parent) {
                                  const errorDiv = document.createElement("div")
                                  errorDiv.className =
                                    "flex items-center justify-center h-[400px] text-sm text-zinc-400"
                                  errorDiv.innerHTML = "Unable to load social widget. Please check your connection."
                                  parent.appendChild(errorDiv)
                                  target.style.display = "none"
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Social Links - Only show if we have social data */}
                      <div className="mb-3">
                        <div className="text-xs text-purple-300 mb-2">Website:</div>
                        <div className="flex flex-wrap gap-2">
                          {message.tokenData.socials?.website && (
                            <a
                              href={
                                typeof message.tokenData.socials?.website === "object"
                                  ? (message.tokenData.socials.website as { url: string }).url
                                  : message.tokenData.socials?.website
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-purple-900/30 hover:bg-purple-800/50 px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />{" "}
                              {typeof message.tokenData.socials?.website === "object"
                                ? (message.tokenData.socials.website as { label: string }).label
                                : message.tokenData.socials?.website}
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Token Actions */}
                      <div className="flex justify-between mt-2 pt-2 border-t border-purple-500/20">
                        <a
                          href={`https://solscan.io/account/${message.tokenData.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-300 flex items-center gap-1 hover:text-purple-200"
                        >
                          View on Solscan <ExternalLink className="h-3 w-3" />
                        </a>
                        <a
                          href={`https://dexscreener.com/solana/${message.tokenData.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-300 flex items-center gap-1 hover:text-purple-200"
                        >
                          View on DexScreener <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Wallet Card - Only show for wallet addresses */}
                  {message.role === "assistant" && message.addressType === "wallet" && message.walletData && (
                    <div className="mb-3 p-3 bg-blue-900/20 rounded-md border border-blue-500/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-blue-800/50 flex items-center justify-center">
                          <Wallet className="h-6 w-6 text-blue-300" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg text-white">Solana Wallet</div>
                          <div className="text-sm text-blue-300">{formatAddress(message.walletData.address)}</div>
                        </div>
                      </div>

                      {/* Wallet Performance Metrics - Only show if we have actual data */}
                      {(message.walletData.winRate && message.walletData.winRate !== "Unknown") ||
                      (message.walletData.roi && message.walletData.roi !== "Unknown") ? (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {message.walletData.winRate && message.walletData.winRate !== "Unknown" && (
                            <div className="bg-blue-900/10 p-2 rounded border border-blue-500/20">
                              <div className="text-xs text-blue-300 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" /> Win Rate
                              </div>
                              <div className="font-medium text-lg text-white">{message.walletData.winRate}</div>
                            </div>
                          )}
                          {message.walletData.roi && message.walletData.roi !== "Unknown" && (
                            <div className="bg-blue-900/10 p-2 rounded border border-blue-500/20">
                              <div className="text-xs text-blue-300 flex items-center gap-1">
                                <BarChart3 className="h-3 w-3" /> ROI
                              </div>
                              <div className="font-medium text-lg text-white">{message.walletData.roi}</div>
                            </div>
                          )}
                        </div>
                      ) : null}

                      {/* Last Traded Coins */}
                      {message.walletData.lastTradedCoins && message.walletData.lastTradedCoins.length > 0 && (
                        <div className="mb-3">
                          <div className="text-sm text-blue-300 mb-2 font-medium flex items-center gap-1">
                            <Clock className="h-4 w-4" /> Recent Trades
                          </div>
                          <div className="bg-blue-900/10 p-2 rounded border border-blue-500/20">
                            <div className="space-y-2">
                              {message.walletData.lastTradedCoins.map((coin, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                      style={{
                                        backgroundColor: generateTokenIcon(coin.symbol).background,
                                        color: generateTokenIcon(coin.symbol).text,
                                      }}
                                    >
                                      {coin.symbol.substring(0, 1)}
                                    </div>
                                    <div>
                                      <div className="font-medium text-white">{coin.symbol}</div>
                                      {coin.time && <div className="text-xs text-blue-300/70">{coin.time}</div>}
                                    </div>
                                  </div>
                                  {coin.profit && (
                                    <div
                                      className={`flex items-center gap-1 ${coin.isWin ? "text-green-400" : "text-red-400"}`}
                                    >
                                      {coin.isWin ? (
                                        <ArrowUpRight className="h-3 w-3" />
                                      ) : (
                                        <ArrowDownRight className="h-3 w-3" />
                                      )}
                                      <span className="font-medium">{coin.profit}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* GMGN.ai Button - NEW */}
                      <Button
                        onClick={() =>
                          window.open(`https://gmgn.ai/sol/address/${message.walletData.address}`, "_blank")
                        }
                        className="w-full mb-3 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View Detailed Trading Performance on GMGN.ai
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>

                      {/* Wallet Actions */}
                      <div className="flex justify-between mt-2 pt-2 border-t border-blue-500/20">
                        <a
                          href={`https://solscan.io/account/${message.walletData.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-300 flex items-center gap-1 hover:text-blue-200"
                        >
                          View on Solscan <ExternalLink className="h-3 w-3" />
                        </a>
                        <a
                          href={`https://explorer.solana.com/address/${message.walletData.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-300 flex items-center gap-1 hover:text-blue-200"
                        >
                          View on Explorer <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  <p className="text-sm whitespace-pre-wrap text-white">{message.content}</p>

                  {/* Show error details for debugging if available */}
                  {message.isError && errorDetails && (
                    <div className="mt-2 pt-2 border-t border-red-500/30 text-xs text-red-300">
                      <p>Error details (for debugging): {errorDetails}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-[#1a1a3a]/50 border border-purple-900/20">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium">Solana Analyzer</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                  <p className="text-sm text-white">Analyzing contract...</p>
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
              placeholder="Paste a Solana address (e.g., 5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp...)"
              className="bg-[#0a0a18] border-purple-900/30 focus-visible:ring-purple-500 text-white"
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
          <p className="text-xs text-zinc-500 mt-2 text-gray-200">
            Paste any Solana contract address or SPL token to analyze why it might have been sent to you.
          </p>
        </div>
      </Card>
    </div>
  )
}
