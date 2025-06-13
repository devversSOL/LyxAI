"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import mermaid from "mermaid" // Import the Mermaid library

export default function WhaleTrackerDocs() {
  useEffect(() => {
    // Increase timeout to ensure rendering happens after page is stable
    const timer = setTimeout(() => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          primaryColor: "#a855f7",
          primaryTextColor: "#ffffff",
          primaryBorderColor: "#7c3aed",
          lineColor: "#6366f1",
        },
        securityLevel: "loose",
      })

      mermaid.init(undefined, document.querySelectorAll(".mermaid"))
    }, 1000) // Longer timeout

    return () => clearTimeout(timer)
  }, [])

  // Define Mermaid diagram content as strings to avoid JSX parsing issues
  const flowchartDiagram = `
flowchart TD
  A[Discord Bot] -->|Listens to| B[Solana Whale Transactions]
  B -->|Filters by| C{Transaction Size}
  C -->|${">"} 10,000 SOL| D[High Priority Alert]
  C -->|${">"} 1,000 SOL| E[Medium Priority Alert]
  C -->|${">"} 100 SOL| F[Low Priority Alert]
  D --> G[Notification System]
  E --> G
  F --> G
  G -->|Sends to| H[User Dashboard]
  G -->|Sends to| I[Discord Channel]
  `

  const sequenceDiagram = `
sequenceDiagram
  participant Blockchain as Solana Blockchain
  participant Service as Whale Tracking Service
  participant DB as Database
  participant UI as User Interface
  
  Blockchain->>Service: New Transaction Event
  Service->>Service: Filter & Analyze Transaction
  alt Is Whale Transaction
    Service->>DB: Store Transaction Data
    Service->>UI: Real-time Update
    UI->>UI: Notify User
  else Not Significant
    Service->>Service: Discard Transaction
  end
  `

  const classDiagram = `
classDiagram
  class WhaleTransaction {
    +String transactionId
    +String walletAddress
    +String amount
    +Timestamp time
    +String tokenSymbol
    +Number usdValue
    +analyze()
    +categorize()
  }
  
  class WalletProfile {
    +String address
    +Number totalValue
    +Number transactionCount
    +Array transactions
    +calculateRisk()
    +getHistory()
  }
  
  class AlertSystem {
    +notify()
    +filterAlerts()
    +prioritize()
  }
  
  WhaleTransaction --> WalletProfile
  WhaleTransaction --> AlertSystem
  `

  return (
    <div className="min-h-screen bg-black text-white no-3d-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
          <Link href="/" className="hover:text-white">
            <Home size={14} />
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
          <h1 className="text-4xl font-bold mb-6">Whale Activity Tracker</h1>

          <p className="text-xl text-zinc-300 mb-8">
            Real-time monitoring of large Solana transactions and whale movements
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How It Works</h2>
          <p>
            The system continuously monitors the Solana blockchain for transactions exceeding certain thresholds. When a
            significant transaction is detected, it's analyzed, categorized, and displayed in real-time.
          </p>

          {/* First diagram - using string variable */}
          <div className="my-8 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <h3 className="text-xl font-medium mb-4">Whale Transaction Flow</h3>
            <div className="overflow-x-auto py-4">
              <div className="mermaid">{flowchartDiagram}</div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Real-time Updates</h2>
          <p>
            The Whale Tracker provides real-time notifications for significant transactions, allowing users to react
            quickly to market movements. The system categorizes transactions by size and potential market impact.
          </p>

          {/* Second diagram */}
          <div className="my-8 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <h3 className="text-xl font-medium mb-4">Real-time Update Sequence</h3>
            <div className="overflow-x-auto py-4">
              <div className="mermaid">{sequenceDiagram}</div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Technical Implementation</h2>
          <p>
            The Whale Tracker is built using a combination of blockchain listeners, data processing services, and
            real-time notification systems. It integrates with Discord for alerts and provides a comprehensive
            dashboard.
          </p>

          {/* Third diagram */}
          <div className="my-8 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <h3 className="text-xl font-medium mb-4">System Architecture</h3>
            <div className="overflow-x-auto py-4">
              <div className="mermaid">{classDiagram}</div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Key Features</h2>
          <ul>
            <li>Real-time monitoring of large Solana transactions</li>
            <li>Automatic categorization by transaction size and impact</li>
            <li>Historical data analysis and pattern recognition</li>
            <li>Discord integration for instant alerts</li>
            <li>Customizable notification thresholds</li>
            <li>Wallet profiling for known whale addresses</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Use Cases</h2>
          <ul>
            <li>Identifying potential market movements before they occur</li>
            <li>Tracking institutional investor behavior</li>
            <li>Monitoring project treasury movements</li>
            <li>Analyzing whale accumulation and distribution patterns</li>
            <li>Research on market manipulation tactics</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
