"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the mermaid component with SSR disabled
const SimpleMermaid = dynamic(() => import("@/components/simple-mermaid"), {
  ssr: false,
  loading: () => <div className="p-4 bg-zinc-800/50 rounded-lg">Loading diagram...</div>,
})

export default function WhaleTrackerDocPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
          <Link href="/" className="hover:text-white">
            <Home size={16} />
          </Link>
          <ChevronRight size={14} />
          <Link href="/docs" className="hover:text-white">
            Documentation
          </Link>
          <ChevronRight size={14} />
          <Link href="/docs/features" className="hover:text-white">
            Features
          </Link>
          <ChevronRight size={14} />
          <span className="text-white">Whale Tracker</span>
        </div>

        <h1 className="text-4xl font-bold mb-6">Whale Tracker</h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg mb-6">
            The Whale Tracker feature allows you to monitor large transactions and whale movements in real-time,
            providing valuable insights into market trends and potential price impacts.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How It Works</h2>

          <p className="mb-6">
            Our system continuously monitors blockchain transactions and Discord channels for significant token
            movements, filtering and analyzing them to identify patterns and notable wallet activities.
          </p>

          {isClient && (
            <SimpleMermaid
              chart={`
graph TD
    A["Discord Channels"] -->|"Monitor Messages"| B["Message Processor"]
    B -->|"Extract Transaction Data"| C["Transaction Analyzer"]
    C -->|"Filter by Size/Importance"| D["Whale Activity Database"]
    D -->|"Retrieve Activity"| E["User Dashboard"]
    F["Blockchain Events"] -->|"Monitor Transactions"| C
              `}
            />
          )}

          <h2 className="text-2xl font-semibold mt-8 mb-4">Key Features</h2>

          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Real-time monitoring of large transactions across multiple blockchains</li>
            <li>Discord integration for community-sourced whale alerts</li>
            <li>Customizable alerts for specific tokens or transaction sizes</li>
            <li>Historical data analysis to identify patterns</li>
            <li>Wallet profiling to track known whale behaviors</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Getting Started</h2>

          <p className="mb-6">To start using the Whale Tracker:</p>

          <ol className="list-decimal pl-6 mb-6 space-y-2">
            <li>Navigate to the Dashboard section from the main navigation</li>
            <li>Review the latest whale activities displayed in the feed</li>
            <li>Click on any transaction to view detailed information</li>
            <li>Use filters to focus on specific tokens or transaction sizes</li>
          </ol>

          <div className="bg-zinc-800/50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-2">Pro Tip</h3>
            <p>
              Combine Whale Tracker data with the Narrative Analysis feature to understand how large movements might be
              influencing market sentiment and token narratives.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
