"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import SimpleMermaid from "@/components/simple-mermaid"

export default function WhaleTrackerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
        <Link href="/docs" className="hover:text-white flex items-center gap-1">
          <ChevronLeft size={16} />
          <span>Documentation</span>
        </Link>
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-6">🐋 Whale Tracker</h1>

        <p className="text-xl text-zinc-300 mb-8">
          The Whale Tracker provides real-time monitoring of large Solana transactions and whale movements with live
          Discord integration.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">How It Works</h2>
        <SimpleMermaid
          chart={`
graph TD
    A["Discord Webhook"] --> B["Message Processing"]
    B --> C["Whale Detection"]
    C --> D["Data Enrichment"]
    D --> E["Real-time Display"]
    
    F["User Filters"] --> E
    G["Historical Data"] --> E
    
    E --> H["Whale Activity Feed"]
    E --> I["Analytics Dashboard"]
`}
        />

        <h2 className="text-2xl font-bold mt-8 mb-4">Key Features</h2>
        <ul className="list-disc pl-6 mb-6 text-zinc-300">
          <li>Real-time whale transaction monitoring</li>
          <li>Discord integration for instant alerts</li>
          <li>Token filtering and search capabilities</li>
          <li>Historical whale activity analysis</li>
          <li>Performance metrics and win rates</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Using the Whale Tracker</h2>
        <div className="bg-zinc-800/50 p-6 rounded-lg mb-8">
          <ol className="list-decimal pl-6 mb-0 text-zinc-300">
            <li className="mb-2">Navigate to the Dashboard to view real-time whale activity</li>
            <li className="mb-2">Use filters to focus on specific tokens or transaction sizes</li>
            <li className="mb-2">Click on whale activities to analyze wallet details</li>
            <li className="mb-2">Monitor performance metrics and trends</li>
            <li className="mb-2">Set up alerts for specific whale movements</li>
          </ol>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Data Sources</h2>
        <p className="text-zinc-300 mb-4">The Whale Tracker aggregates data from multiple sources:</p>
        <ul className="list-disc pl-6 mb-6 text-zinc-300">
          <li>Discord whale alert channels</li>
          <li>Solana blockchain transaction data</li>
          <li>DexScreener for token metadata</li>
          <li>Birdeye for market cap and price data</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Technical Implementation</h2>
        <SimpleMermaid
          chart={`
sequenceDiagram
    participant Discord
    participant Webhook as Webhook Handler
    participant DB as Database
    participant UI as User Interface
    
    Discord->>Webhook: Whale Alert Message
    Webhook->>Webhook: Parse Message Data
    Webhook->>DB: Store Whale Activity
    DB->>UI: Real-time Update
    UI->>UI: Display New Activity
`}
        />

        <h2 className="text-2xl font-bold mt-8 mb-4">Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Market Intelligence</h3>
            <p className="text-zinc-300 text-sm">Track whale movements to understand market sentiment and trends.</p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Investment Strategy</h3>
            <p className="text-zinc-300 text-sm">Follow successful whale strategies and timing.</p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Risk Management</h3>
            <p className="text-zinc-300 text-sm">Monitor large sell-offs and potential market impacts.</p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Token Discovery</h3>
            <p className="text-zinc-300 text-sm">Discover new tokens through whale activity patterns.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
