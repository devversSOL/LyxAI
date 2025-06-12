"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { useEffect, useRef, useState } from "react"

// Copy the exact working component from the test page
function WorkingMermaid({ chart, title }: { chart: string; title?: string }) {
  const mermaidRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState("Loading...")

  useEffect(() => {
    const loadMermaid = async () => {
      try {
        setStatus("Importing Mermaid...")
        const mermaid = (await import("mermaid")).default

        setStatus("Initializing...")
        mermaid.initialize({
          startOnLoad: true,
          theme: "dark",
          themeVariables: {
            primaryColor: "#a855f7",
            primaryTextColor: "#ffffff",
            primaryBorderColor: "#7c3aed",
            lineColor: "#6366f1",
            sectionBkgColor: "#1f2937",
            altSectionBkgColor: "#374151",
            gridColor: "#4b5563",
            secondaryColor: "#ec4899",
            tertiaryColor: "#10b981",
          },
        })

        if (mermaidRef.current) {
          setStatus("Rendering diagram...")
          mermaidRef.current.innerHTML = `
            <pre class="mermaid">
              ${chart}
            </pre>
          `

          await mermaid.contentLoaded()
          setStatus("Complete!")
        }
      } catch (error) {
        console.error("Mermaid error:", error)
        setStatus(`Error: ${error}`)
      }
    }

    loadMermaid()
  }, [chart])

  return (
    <div className="my-6">
      {title && <h3 className="text-lg font-semibold mb-3 text-white">{title}</h3>}
      <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
        <div className="text-sm text-gray-400 mb-2">Status: {status}</div>
        <div ref={mermaidRef} />
      </div>
    </div>
  )
}

export default function WhaleTrackerDocs() {
  const whaleTrackerFlow = `
    graph TB
      A[Discord Alert] --> B[Webhook Receiver]
      B --> C[Message Parser]
      C --> D{Valid Whale Alert?}
      D -->|Yes| E[Extract Token Info]
      D -->|No| F[Discard Message]
      E --> G[Fetch Token Data]
      G --> H[DexScreener API]
      G --> I[Birdeye API]
      H --> J[Data Aggregation]
      I --> J
      J --> K[Store in Database]
      K --> L[Real-time UI Update]
      L --> M[User Dashboard]
  `

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4">
            <Home size={16} />
            Back to Home
          </Link>

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/docs" className="hover:text-white">
              Documentation
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">Whale Activity Tracker</span>
          </div>
        </div>

        {/* Content */}
        <article className="prose prose-invert prose-purple max-w-none">
          <h1 className="text-4xl font-bold mb-6">🐋 Whale Activity Tracker</h1>

          <p className="text-xl text-zinc-300 mb-8">
            Real-time monitoring of large Solana transactions and whale movements with live Discord integration.
          </p>

          <h2 className="text-2xl font-bold mb-4">Data Flow Process</h2>
          <p className="text-zinc-300 mb-4">The complete flow from Discord whale alerts to user dashboard updates:</p>

          <WorkingMermaid chart={whaleTrackerFlow} title="Whale Tracker Data Flow" />

          <h3 className="text-xl font-semibold mb-4">Key Features</h3>
          <ul className="text-zinc-300 space-y-2 mb-6">
            <li>
              <strong>Live Discord Integration:</strong> Captures whale alerts from Discord channels instantly
            </li>
            <li>
              <strong>Token Filtering:</strong> Filter whale activity by specific Solana tokens
            </li>
            <li>
              <strong>Real-time Updates:</strong> Immediate UI updates via WebSocket connections
            </li>
            <li>
              <strong>Historical Data:</strong> Access to past whale activities and trends
            </li>
            <li>
              <strong>Performance Metrics:</strong> Win rates, biggest wins, market cap analysis
            </li>
          </ul>
        </article>

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
