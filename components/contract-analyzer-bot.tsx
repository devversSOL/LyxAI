"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Send, User, Loader2, Search, AlertTriangle } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  isError?: boolean
}

interface ContractAnalyzerBotProps {
  isOpen: boolean
  onClose: () => void
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

function ContractAnalyzerBot({ isOpen, onClose }: ContractAnalyzerBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm the Solana Contract Analyzer. Paste any Solana **token contract address** or SPL token, and I'll tell you why it might have been sent to you. I'll analyze the token creator's reputation on X (Twitter), check if they're famous or known, and determine if the token is part of a viral trend on social media platforms.\n\n**Note:** If you want to analyze a wallet address, please use our dedicated Wallet Analyzer tool instead.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [apiFailCount, setApiFailCount] = useState(0)
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

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setErrorDetails(null)

    // Check if input looks like a Solana address and determine if it's a wallet
    const isSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(input.trim())

    if (isSolanaAddress) {
      try {
        // Check if it's a wallet using a simple heuristic or API call
        const response = await fetch("/api/check-address-type", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: input.trim() }),
        })

        const addressData = await response.json()

        if (addressData.isWallet) {
          // Show wallet redirect message
          const walletRedirectMessage: Message = {
            role: "assistant",
            content: `## Wallet Address Detected

The address \`${input.trim()}\` appears to be a wallet address, not a token contract.

For wallet analysis including trading performance, holdings, and activity history, please use our specialized wallet analyzer.`,
          }

          setMessages((prev) => [...prev, walletRedirectMessage])
          setIsLoading(false)

          // Add redirect button after a short delay
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: "REDIRECT_BUTTON_WALLET",
              },
            ])
          }, 500)

          return
        }
      } catch (error) {
        console.log("Could not determine address type, proceeding with contract analysis")
      }
    }

    // Check if we should use fallback mode (after 2 consecutive API failures)
    const useFallback = apiFailCount >= 2

    if (!useFallback) {
      try {
        console.log("Sending request to analyze contract...")

        // Use the API route
        const response = await fetch("/api/analyze-contract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.details || data.error || "Unknown error occurred")
        }

        if (data.error) {
          throw new Error(data.details || data.error)
        }

        // Add assistant response to messages
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setApiFailCount(0) // Reset fail count on success
      } catch (error: any) {
        console.error("Error generating response:", error)
        setApiFailCount((prev) => prev + 1) // Increment fail count

        // Store error details for debugging
        setErrorDetails(error.message || "Unknown error")

        // Use fallback response
        const fallbackContent = generateFallbackResponse(userMessage.content)
        const fallbackMessage: Message = {
          role: "assistant",
          content: fallbackContent,
          isError: true,
        }

        setMessages((prev) => [...prev, fallbackMessage])
      }
    } else {
      // Use fallback directly
      console.log("Using fallback response after multiple API failures")
      const fallbackContent = generateFallbackResponse(userMessage.content)
      const fallbackMessage: Message = {
        role: "assistant",
        content: fallbackContent,
      }

      setMessages((prev) => [...prev, fallbackMessage])
    }

    setIsLoading(false)
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
                    {message.role === "user" ? "You" : "Solana Analyzer"}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                {/* Show error details for debugging if available */}
                {message.isError && errorDetails && (
                  <div className="mt-2 pt-2 border-t border-red-500/30 text-xs text-red-300">
                    <p>Error details (for debugging): {errorDetails}</p>
                  </div>
                )}
                {message.content === "REDIRECT_BUTTON_WALLET" && (
                  <div className="mt-3">
                    <Button
                      onClick={() => {
                        onClose() // Close current analyzer
                        // Trigger opening the wallet analyzer
                        window.dispatchEvent(
                          new CustomEvent("openWalletAnalyzer", {
                            detail: { address: input.trim() },
                          }),
                        )
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Open Wallet Analyzer
                    </Button>
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
                  <span className="text-xs text-purple-300 font-medium">Solana Analyzer</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                  <p className="text-sm">Analyzing contract...</p>
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
              placeholder="Paste a Solana token contract address (e.g., 5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp...)"
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
            Paste any Solana token contract address to analyze why it might have been sent to you. For wallet analysis,
            use the Wallet Analyzer tool.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default ContractAnalyzerBot
