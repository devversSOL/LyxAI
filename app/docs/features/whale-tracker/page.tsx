"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export default function WhaleTrackerDocs() {
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

          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-zinc-300 mb-6">
            The Whale Activity Tracker captures whale alerts from Discord channels instantly, processes the data, and
            displays real-time whale activities with comprehensive filtering and analysis capabilities.
          </p>

          <h2 className="text-2xl font-bold mb-4">Process Flows</h2>

          <div>Hello World</div>

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

          <div>Hello World</div>

          <h3 className="text-xl font-semibold mb-4">Real-time Architecture</h3>
          <p className="text-zinc-300 mb-6">
            The system uses Supabase real-time subscriptions to ensure users see whale activities as they happen,
            providing instant notifications and updates across all connected clients.
          </p>

          <div>Hello World</div>

          <h3 className="text-xl font-semibold mb-4">Data Sources</h3>
          <ul className="text-zinc-300 space-y-2 mb-6">
            <li>
              <strong>Discord Webhooks:</strong> Primary source for whale activity alerts
            </li>
            <li>
              <strong>DexScreener API:</strong> Token metadata and trading information
            </li>
            <li>
              <strong>Birdeye API:</strong> Market cap and price data
            </li>
            <li>
              <strong>Solscan API:</strong> Blockchain transaction verification
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-4">Performance Optimization</h3>
          <p className="text-zinc-300 mb-6">
            The whale tracker is optimized for real-time performance with efficient data processing, smart caching, and
            minimal UI re-renders to ensure smooth user experience even with high-frequency whale activities.
          </p>
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
