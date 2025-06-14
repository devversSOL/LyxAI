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

export default function WhaleTrackerPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
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

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-6">🐋 Whale Activity Tracker</h1>

          <p className="text-xl text-zinc-300 mb-8">
            The Whale Activity Tracker is LyxAI's flagship feature for monitoring large Solana transactions and whale
            movements in real-time.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Process Overview</h2>

          {isClient && (
            <SimpleMermaid
              chart={`
%%{init: {'theme': 'dark', 'themeVariables': { 'primaryColor': '#a855f7', 'primaryTextColor': '#fff', 'primaryBorderColor': '#7c3aed', 'lineColor': '#6366f1', 'secondaryColor': '#ec4899', 'tertiaryColor': '#10b981' }}}%%
graph TB
   A["Discord Channels"] --> B["Webhook Receiver"]
   B --> C["Message Parser"]
   C --> D["Whale Detection"]
   D --> E{"Valid Whale Alert?"}
   
   E -->|Yes| F["Extract Token Info"]
   E -->|No| G["Discard Message"]
   
   F --> H["Fetch Token Data"]
   H --> I["DexScreener API"]
   H --> J["Birdeye API"]
   
   I --> K["Data Aggregation"]
   J --> K
   
   K --> L["Store in Database"]
   L --> M["Real-time UI Update"]
   M --> N["User Dashboard"]
   
   O["User Filters"] --> P["Token Selection"]
   P --> Q["Filter Results"]
   Q --> N
`}
            />
          )}

          <h2 className="text-2xl font-bold mt-8 mb-4">Key Features</h2>
          <ul className="list-disc pl-6 mb-6 text-zinc-300">
            <li>Real-time monitoring of large transactions on Solana</li>
            <li>Automatic token identification and data enrichment</li>
            <li>Customizable alerts and notifications</li>
            <li>Historical transaction data and analytics</li>
            <li>Integration with token analysis for comprehensive insights</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Data Sources</h2>
          <p className="text-zinc-300 mb-6">
            The Whale Activity Tracker aggregates data from multiple sources to provide comprehensive insights:
          </p>
          <ul className="list-disc pl-6 mb-6 text-zinc-300">
            <li>Discord whale alert channels</li>
            <li>DexScreener API for token pricing and liquidity data</li>
            <li>Birdeye API for additional market metrics</li>
            <li>Solana blockchain explorers for transaction verification</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">User Interface</h2>
          <p className="text-zinc-300">
            The Whale Activity Tracker features a real-time dashboard with customizable filters, allowing users to focus
            on specific tokens, transaction sizes, or time periods. The interface includes visual indicators for
            transaction size and impact, as well as quick links to token analysis and historical data.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Implementation Details</h2>

          {isClient && (
            <SimpleMermaid
              chart={`
%%{init: {'theme': 'dark', 'themeVariables': { 'primaryColor': '#a855f7', 'primaryTextColor': '#fff', 'primaryBorderColor': '#7c3aed', 'lineColor': '#6366f1', 'secondaryColor': '#ec4899', 'tertiaryColor': '#10b981' }}}%%
sequenceDiagram
   participant Discord as Discord Bot
   participant Webhook as Webhook Receiver
   participant Parser as Message Parser
   participant API as External APIs
   participant DB as Database
   participant UI as User Interface
   
   Discord->>Webhook: Send Whale Alert
   Webhook->>Parser: Process Message
   Parser->>Parser: Extract Token Info
   Parser->>API: Fetch Token Data
   API-->>Parser: Return Token Data
   Parser->>DB: Store Transaction
   DB-->>UI: Update Dashboard
   UI->>UI: Notify User
`}
            />
          )}

          <h2 className="text-2xl font-bold mt-8 mb-4">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-zinc-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Market Monitoring</h3>
              <p className="text-zinc-300 text-sm">
                Track large movements that might impact token prices and market sentiment.
              </p>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Investment Research</h3>
              <p className="text-zinc-300 text-sm">
                Identify patterns in whale behavior to inform investment decisions.
              </p>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Risk Management</h3>
              <p className="text-zinc-300 text-sm">
                Get early warnings about potential market manipulation or large sell-offs.
              </p>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Token Discovery</h3>
              <p className="text-zinc-300 text-sm">
                Discover new tokens that are attracting significant whale interest.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <Link href="/docs" className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
            ← Back to Documentation
          </Link>
        </div>
      </div>
    </div>
  )
}
