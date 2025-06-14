"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import LightningEffect from "@/components/lightning-effect"
import GeometricShape from "@/components/geometric-shape"
import ScrollIndicator from "@/components/scroll-indicator"
import ChatBot from "@/components/chat-bot"
import ContractAnalyzerBot from "@/components/contract-analyzer-bot"
import DirectContractAnalyzer from "@/components/direct-contract-analyzer"
import DirectChatBot from "@/components/direct-chat-bot"
import TrendingCoinsConveyor from "@/components/trending-coins-conveyor"
import { Button } from "@/components/ui/button"
import { Twitter, Github, Menu, X, RefreshCw } from "lucide-react"
import AnimatedTitle from "@/components/animated-title"

// Dynamically import the 3D background with loading optimization
const BackgroundScene = dynamic(() => import("@/components/background-scene"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0 opacity-80">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-purple-800/20" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-700/5 rounded-full blur-[120px]" />
    </div>
  ),
})

interface TrendingCoin {
  name: string
  symbol: string
  image: string | null
  rugcheck_status: string
  token_address: string
  trending_rank: number
  price: number
  change_24h: number
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false)
  const [isDirectAnalyzerOpen, setIsDirectAnalyzerOpen] = useState(false)
  const [isDirectChatOpen, setIsDirectChatOpen] = useState(false)
  const [prefilledContractAddress, setPrefilledContractAddress] = useState<string>("")
  const [prefilledWalletAddress, setPrefilledWalletAddress] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([])
  const [isLoadingTrending, setIsLoadingTrending] = useState(true)
  const [trendingError, setTrendingError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [enable3D, setEnable3D] = useState(true)

  const setIsContractAnalyzerOpen = useState(false)[1]

  useEffect(() => {
    setMounted(true)

    // Detect if device might struggle with 3D
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isLowEnd = navigator.hardwareConcurrency <= 4

    if (isMobile && isLowEnd) {
      // Delay 3D loading on low-end mobile devices
      setTimeout(() => setEnable3D(true), 1000)
    }
  }, [])

  useEffect(() => {
    const handleOpenContractAnalyzer = (event: CustomEvent) => {
      console.log("🎯 openContractAnalyzer event received")
      setIsContractAnalyzerOpen(true)
    }

    const handleOpenWalletAnalyzer = (event: CustomEvent) => {
      console.log("🎯 openWalletAnalyzer event received:", event.detail)

      if (event.detail && event.detail.address) {
        console.log("📝 Setting prefilled wallet address:", event.detail.address)
        setPrefilledWalletAddress(event.detail.address)
        setIsChatOpen(true)
      }
    }

    window.addEventListener("openContractAnalyzer", handleOpenContractAnalyzer as EventListener)
    window.addEventListener("openWalletAnalyzer", handleOpenWalletAnalyzer as EventListener)

    return () => {
      window.removeEventListener("openContractAnalyzer", handleOpenContractAnalyzer as EventListener)
      window.removeEventListener("openWalletAnalyzer", handleOpenWalletAnalyzer as EventListener)
    }
  }, [])

  const fetchTrendingCoins = async () => {
    try {
      setIsLoadingTrending(true)
      setTrendingError(null)
      setIsRefreshing(true)

      const response = await fetch("/api/trending-coins")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setTrendingCoins(data)
    } catch (error) {
      console.error("Error fetching trending coins:", error)
      setTrendingError(error instanceof Error ? error.message : "Failed to fetch trending coins")
    } finally {
      setIsLoadingTrending(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTrendingCoins()
  }, [])

  const openChat = () => {
    setIsDirectChatOpen(true)
    setIsAnalyzerOpen(false)
    setIsDirectAnalyzerOpen(false)
  }

  const closeChat = () => {
    setIsChatOpen(false)
  }

  const closeDirectChat = () => {
    setIsDirectChatOpen(false)
    setPrefilledWalletAddress(null)
  }

  const openAnalyzer = () => {
    setIsDirectAnalyzerOpen(true)
    setIsChatOpen(false)
    setIsDirectChatOpen(false)
  }

  const closeAnalyzer = () => {
    setIsAnalyzerOpen(false)
  }

  const closeDirectAnalyzer = () => {
    setIsDirectAnalyzerOpen(false)
    setPrefilledContractAddress("")
  }

  const handleAnalyzeToken = (address: string) => {
    setPrefilledContractAddress(address)
    setIsDirectAnalyzerOpen(true)
  }

  return (
    <div className="bg-black text-white overflow-hidden relative font-extralight h-screen">
      {/* Background effects - optimized loading */}
      {mounted && (
        <>
          <LightningEffect />
          <GeometricShape />
          <ScrollIndicator />
        </>
      )}

      {/* Chat Bots */}
      <ChatBot isOpen={isChatOpen} onClose={closeChat} />
      <ContractAnalyzerBot isOpen={isAnalyzerOpen} onClose={closeAnalyzer} />
      <DirectContractAnalyzer
        isOpen={isDirectAnalyzerOpen}
        onClose={closeDirectAnalyzer}
        prefilledAddress={prefilledContractAddress}
      />
      <DirectChatBot isOpen={isDirectChatOpen} onClose={closeDirectChat} prefilledAddress={prefilledWalletAddress} />

      {/* Hero Section */}
      <div className="relative h-screen flex flex-col">
        {mounted && enable3D ? (
          <BackgroundScene />
        ) : (
          <div className="fixed inset-0 z-0 opacity-80">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-purple-800/20" />
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-700/5 rounded-full blur-[120px]" />
          </div>
        )}

        {/* Main content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header with logo and navigation */}
          <header className="container mx-auto py-4 px-4 flex-shrink-0">
            <div className="flex justify-between items-center w-full">
              {/* Left side - Social links */}
              <div className="flex items-center gap-3">
                <Link
                  href="https://x.com/Lyxdotai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Twitter size={20} />
                </Link>
                <Link
                  href="https://github.com/devversSOL/LyxAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Github size={20} />
                </Link>
              </div>

              {/* Center - LYXAI Image Logo with Glow Effect */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <div className="relative h-30 w-96 md:h-36 md:w-120 glow-effect">
                  <Image
                    src="/lyxai-logo-transparent.png"
                    alt="LYXAI"
                    fill
                    style={{ objectFit: "contain" }}
                    className="drop-shadow-glow animate-pulse-subtle"
                    priority
                  />
                </div>
              </div>

              {/* Right side - Navigation */}
              <nav className="flex items-center gap-6 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>

                {/* Mobile Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-black/95 backdrop-blur-md border border-purple-900/50 rounded-lg shadow-2xl py-3 z-[9999]">
                    <Link
                      href="/"
                      className="block px-5 py-3 text-white hover:bg-purple-900/30 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-5 py-3 text-white hover:bg-purple-900/30 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/docs"
                      className="block px-5 py-3 text-white hover:bg-purple-900/30 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Documentation
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </header>

          {/* Main content - centered */}
          <main className="container mx-auto px-4 flex-1 flex flex-col justify-center items-center overflow-y-auto">
            <div className="flex flex-col items-center justify-center text-center relative max-w-4xl">
              {/* Main Title */}
              <div className="mb-6">
                <AnimatedTitle />
              </div>

              <p className="text-zinc-400 text-lg mb-8 font-light max-w-2xl leading-relaxed">
                LyxAI delivers instant, data-driven answers to your wallet questions.
                <br />
                From token buys and sells to current holdings, our AI-powered engine reveals exactly what you need—no
                noise, just truth.
              </p>

              <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                <Button
                  onClick={openChat}
                  className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M9 12L15 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="font-light">Analyze Wallet</span>
                </Button>

                <Button
                  onClick={openAnalyzer}
                  className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="font-light">Why did it send?</span>
                </Button>
              </div>

              {/* Third button - Watch Whale Activity */}
              <div className="mb-12">
                <Link href="/dashboard">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span className="font-light">Watch Whale Activity</span>
                  </Button>
                </Link>
              </div>
            </div>
          </main>

          {/* Trending Coins Conveyor Belt - Fixed at bottom */}
          <div className="w-full bg-black/50 backdrop-blur-md border-t border-white/10 py-2">
            <div className="flex justify-between items-center mb-2 px-4">
              <h3 className="text-sm font-light text-white">Top 20 Trending Coins</h3>
              <Button
                onClick={fetchTrendingCoins}
                disabled={isRefreshing}
                variant="ghost"
                size="sm"
                className="text-purple-400 hover:text-purple-300"
              >
                <RefreshCw size={14} className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {isLoadingTrending ? (
              <div className="flex justify-center items-center py-2">
                <div className="text-zinc-400 text-sm">Loading trending coins...</div>
              </div>
            ) : trendingError ? (
              <div className="flex justify-center items-center py-2">
                <div className="text-red-400 text-sm">Error: {trendingError}</div>
              </div>
            ) : trendingCoins.length === 0 ? (
              <div className="flex justify-center items-center py-2">
                <div className="text-zinc-400 text-sm">No trending coins available</div>
              </div>
            ) : (
              <TrendingCoinsConveyor coins={trendingCoins} onCoinClick={handleAnalyzeToken} speed="very-fast" />
            )}
          </div>

          {/* Powered by section - moved above conveyor */}
          <div className="w-full py-4 px-4">
            <h3 className="text-base font-light text-gray-400 mb-4 text-center">Powered by</h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {/* Solana Logo */}
              <div className="relative h-8 w-24">
                <Image
                  src="/solana-logo.png"
                  alt="Solana"
                  fill
                  style={{ objectFit: "contain" }}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* DexScreener Logo */}
              <div className="relative h-8 w-24">
                <Image
                  src="/dexscreener-logo.png"
                  alt="DexScreener"
                  fill
                  style={{ objectFit: "contain" }}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* Jupiter Logo */}
              <div className="relative h-8 w-24">
                <Image
                  src="/jupiter-logo.png"
                  alt="Jupiter"
                  fill
                  style={{ objectFit: "contain" }}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
