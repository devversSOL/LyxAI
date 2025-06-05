"use client"

import Link from "next/link"
import DiscordWhaleFeed from "@/components/discord-whale-feed"
import BlockchainDisplay from "@/components/blockchain-display"
import FloatingChatButton from "@/components/floating-chat-button"
import FloatingAnalyzerButton from "@/components/floating-analyzer-button"

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

export default function DashboardPage() {
  return (
    <div className="bg-[#070318] text-white min-h-screen overflow-hidden relative font-extralight">
      {/* Background effects */}
      <StarsBackground />
      <BlockchainDisplay className="opacity-20" />

      {/* Main content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-light mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
            Whale Activity Tracker
          </h1>
          <p className="text-zinc-400">
            Monitor large transactions and whale movements in real-time from Discord channels
          </p>
        </div>

        {/* Discord Whale Feed */}
        <DiscordWhaleFeed
          channelId={process.env.DISCORD_WHALE_CHANNEL_ID}
          refreshInterval={30000} // Refresh every 30 seconds
        />
      </div>

      {/* Navigation */}
      <div className="fixed top-8 right-8 z-20">
        <Link
          href="/"
          className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center hover:bg-white/10 transition-all duration-300"
        >
          <span className="font-light">Back to Home</span>
        </Link>
      </div>

      {/* Floating buttons */}
      <FloatingChatButton />
      <FloatingAnalyzerButton />
    </div>
  )
}
