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
import AnimatedTitle from "@/components/animated-title"
import { Button } from "@/components/ui/button"
import { Twitter, Github, Menu, X } from "lucide-react"

// Dynamically import the 3D background to avoid SSR issues
const BackgroundScene = dynamic(() => import("@/components/background-scene"), { ssr: false })

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false)
  const [isDirectAnalyzerOpen, setIsDirectAnalyzerOpen] = useState(false)
  const [isDirectChatOpen, setIsDirectChatOpen] = useState(false)
  const [prefilledContractAddress, setPrefilledContractAddress] = useState<string>("")
  const [prefilledWalletAddress, setPrefilledWalletAddress] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const setIsContractAnalyzerOpen = useState(false)[1]

  useEffect(() => {
    setMounted(true)
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

  return (
    <div className="bg-black text-white overflow-hidden relative font-extralight h-screen">
      {/* Background effects */}
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
        {mounted && <BackgroundScene />}

        {/* Main content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header with logo and navigation */}
          <header className="container mx-auto py-2 px-4 flex-shrink-0">
            <div className="flex justify-between items-center w-full">
              {/* Left side - Social links */}
              <div className="flex items-center gap-3">
                <Link
                  href="https://twitter.com/LyxAI_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Twitter size={20} />
                </Link>
                <Link
                  href="https://github.com/LyxAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Github size={20} />
                </Link>
              </div>

              {/* Center - Logo */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <div className="w-32 sm:w-36 md:w-40 flex items-center">
                  <img
                    src="/lyxai-logo-main.png"
                    alt="LyxAI"
                    className="w-full h-auto"
                    style={{ filter: "drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))" }}
                  />
                </div>
              </div>

              {/* Right side - Navigation */}
              <nav className="flex items-center gap-6">
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
                  <div className="absolute right-0 mt-2 w-48 bg-[#0a0a18]/90 backdrop-blur-sm border border-purple-900/30 rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-purple-900/20"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/docs"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-purple-900/20"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Documentation
                    </Link>
                    <Link
                      href="/saved-wallets"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-purple-900/20"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Saved Wallets
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </header>

          {/* Main content - positioned higher */}
          <main className="container mx-auto px-4 flex-1 flex flex-col justify-start items-center pt-16 md:pt-20">
            <div className="flex flex-col items-center justify-start text-center relative max-w-4xl">
              {/* Animated Title */}
              <div className="mb-3">
                <AnimatedTitle />
              </div>

              <p className="text-zinc-400 text-sm mb-5 font-extralight max-w-xl leading-relaxed">
                LyxAI delivers instant, data-driven answers to your wallet questions.
                <br />
                From token buys and sells to current holdings, our AI-powered engine reveals exactly what you need—no
                noise, just truth.
              </p>

              <div className="flex flex-col md:flex-row gap-3 items-center mb-5">
                <Button
                  onClick={openChat}
                  className="glass-button destructured-button px-6 py-3 rounded-full flex items-center transform rotate-1 cursor-pointer"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="1.5" />
                    <path d="M9 12L15 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="font-light text-sm">Analyze Wallet</span>
                </Button>

                <Button
                  onClick={openAnalyzer}
                  className="glass-button px-6 py-3 rounded-full flex items-center cursor-pointer hover:bg-white/10 transition-all duration-300"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="1.5" />
                    <path d="M16.5 16.5L21 21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="font-light text-sm">Why did it send?</span>
                </Button>
              </div>

              {/* Backed by section - Compact */}
              <div className="w-full">
                <h2 className="text-base font-extralight text-gray-400 mb-2 text-center">Backed by</h2>
                <div className="flex flex-wrap justify-center items-center gap-4">
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
          </main>
        </div>
      </div>
    </div>
  )
}
