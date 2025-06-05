"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Send, User, Loader2, Search, AlertTriangle, Wallet } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  isError?: boolean
  showRedirectButton?: boolean
  walletAddress?: string
}

interface ContractAnalyzerBotProps {
  isOpen: boolean
  onClose: () => void
}

// Simple function to detect if input looks like a Solana address
const isSolanaAddress = (input: string): boolean => {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(input.trim())
}

function ContractAnalyzerBot({ isOpen, onClose }: ContractAnalyzerBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm the Solana Contract Analyzer. Paste any Solana **token contract address** and I'll tell you why it might have been sent to you. I'll analyze the token creator's reputation and social media presence.\n\n*Note: If you paste a wallet address, I'll redirect you to our Wallet Analyzer.*",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userInput = input.trim()
    const userMessage: Message = {
      role: "user",
      content: userInput,
    }

    console.log("🔥 NEW SIMPLIFIED VERSION - No API calls!")
    console.log("🚀 Processing input:", userInput)

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Check if it's a Solana address
    if (isSolanaAddress(userInput)) {
      console.log("✅ Valid Solana address - showing redirect")

      // Always show redirect for valid addresses
      const redirectMessage: Message = {
        role: "assistant",
        content: `## Wallet Address Detected! 🏦

The address you entered appears to be a **wallet address**:

\`${userInput}\`

For wallet analysis including:
• Trading performance & win rate
• Token holdings & portfolio value  
• Recent trading activity
• Smart money insights

Please use our **Wallet Analyzer** instead.`,
        showRedirectButton: true,
        walletAddress: userInput,
      }

      setMessages((prev) => [...prev, redirectMessage])
      setIsLoading(false)
      return // STOP HERE - no API calls
    }

    // If not a valid Solana address format, show error
    console.log("❌ Not a valid Solana address format")

    const errorMessage: Message = {
      role: "assistant",
      content: `This doesn't appear to be a valid Solana address. 

Please paste a Solana token contract address (typically 32-44 characters starting with a letter or number).

Example: \`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\` (USDC token)`,
      isError: true,
    }

    setMessages((prev) => [...prev, errorMessage])
    setIsLoading(false)
  }

  // Handle redirect to wallet analyzer
  const handleRedirectToWalletAnalyzer = (address: string) => {
    console.log("🔄 Redirecting to Wallet Analyzer:", address)

    // Close this chat
    onClose()

    // Open wallet analyzer with the address
    window.dispatchEvent(
      new CustomEvent("openWalletAnalyzer", {
        detail: { address },
      }),
    )
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
            <h2 className="text-lg font-light">Why Did It Send?</h2>
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
                      <Search className="h-4 w-4 text-purple-400" />
                    )
                  ) : (
                    <User className="h-4 w-4 text-purple-400" />
                  )}
                  <span className="text-xs text-purple-300 font-medium">
                    {message.role === "user" ? "You" : "Contract Analyzer"}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                {/* Show redirect button for wallet addresses */}
                {message.showRedirectButton && message.walletAddress && (
                  <div className="mt-4 space-y-2">
                    <Button
                      onClick={() => handleRedirectToWalletAnalyzer(message.walletAddress!)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center justify-center gap-2 py-3"
                    >
                      <Wallet className="h-4 w-4" />
                      <span className="font-medium">Analyze Wallet</span>
                    </Button>
                    <p className="text-xs text-zinc-400 text-center">
                      This will open our Wallet Analyzer with your address pre-filled
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-[#1a1a3a]/50 border border-purple-900/20">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium">Contract Analyzer</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                  <p className="text-sm">Checking address...</p>
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
              placeholder="Paste a Solana token contract address..."
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
            For token contracts only. Wallet addresses will be redirected to our Wallet Analyzer.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default ContractAnalyzerBot
