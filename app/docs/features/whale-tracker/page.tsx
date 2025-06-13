import type React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

// Add error boundary and debugging
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>
  } catch (error) {
    console.error("Whale Tracker page error:", error)
    return (
      <div className="text-red-500 p-4">
        <h2>Error in Whale Tracker page</h2>
        <pre>{String(error)}</pre>
      </div>
    )
  }
}

export default function WhaleTrackerPage() {
  // Add console log to verify the component is being called
  console.log("WhaleTrackerPage component rendering...")

  return (
    <ErrorBoundary>
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
            <span className="text-zinc-400">Features</span>
            <ChevronRight size={14} />
            <span className="text-white">Whale Tracker</span>
          </div>

          {/* Debug info - remove after fixing */}
          <div className="bg-red-900/20 border border-red-500 p-4 mb-4 rounded">
            <p className="text-red-300">Debug: Whale Tracker page is rendering</p>
            <p className="text-red-300">Timestamp: {new Date().toISOString()}</p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div>
              <h1 className="text-4xl font-bold mb-6 text-white">🐋 Whale Activity Tracker</h1>
              <p className="text-xl text-zinc-300 mb-8">
                The Whale Activity Tracker is LyxAI's flagship feature for monitoring large Solana transactions and
                whale movements in real-time.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Process Overview</h2>
              <div className="bg-zinc-900/50 p-6 rounded-lg mb-8 border border-zinc-800">
                <div className="text-center text-zinc-300 mb-4">Whale Tracking Process Flow</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-zinc-800/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-white">Data Collection</h3>
                    <ul className="list-disc pl-4 text-sm text-zinc-300">
                      <li>Discord Channels</li>
                      <li>Webhook Receiver</li>
                      <li>Message Parser</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-800/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-white">Processing</h3>
                    <ul className="list-disc pl-4 text-sm text-zinc-300">
                      <li>Whale Detection</li>
                      <li>Token Info Extraction</li>
                      <li>External API Calls</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-800/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-white">Presentation</h3>
                    <ul className="list-disc pl-4 text-sm text-zinc-300">
                      <li>Data Aggregation</li>
                      <li>Database Storage</li>
                      <li>Real-time UI Updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Key Features</h2>
              <ul className="list-disc pl-6 mb-6 text-zinc-300 space-y-2">
                <li>Real-time monitoring of large transactions on Solana</li>
                <li>Automatic token identification and data enrichment</li>
                <li>Customizable alerts and notifications</li>
                <li>Historical transaction data and analytics</li>
                <li>Integration with token analysis for comprehensive insights</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Data Sources</h2>
              <p className="text-zinc-300 mb-6">
                The Whale Activity Tracker aggregates data from multiple sources to provide comprehensive insights:
              </p>
              <ul className="list-disc pl-6 mb-6 text-zinc-300 space-y-2">
                <li>Discord whale alert channels</li>
                <li>DexScreener API for token pricing and liquidity data</li>
                <li>Birdeye API for additional market metrics</li>
                <li>Solana blockchain explorers for transaction verification</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mt-8 mb-4 text-white">User Interface</h2>
              <p className="text-zinc-300 mb-6">
                The Whale Activity Tracker features a real-time dashboard with customizable filters, allowing users to
                focus on specific tokens, transaction sizes, or time periods. The interface includes visual indicators
                for transaction size and impact, as well as quick links to token analysis and historical data.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Implementation Details</h2>
              <div className="bg-zinc-900/50 p-6 rounded-lg mb-8 border border-zinc-800">
                <div className="text-center text-zinc-300 mb-4">Whale Alert Processing Sequence</div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-1/3 text-right pr-4 text-zinc-400">Discord Bot</div>
                    <div className="w-1/3 border-t border-purple-500"></div>
                    <div className="w-1/3 pl-4 text-zinc-300">Webhook Receiver</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/3 text-right pr-4 text-zinc-400">Webhook Receiver</div>
                    <div className="w-1/3 border-t border-purple-500"></div>
                    <div className="w-1/3 pl-4 text-zinc-300">Message Parser</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/3 text-right pr-4 text-zinc-400">Message Parser</div>
                    <div className="w-1/3 border-t border-purple-500"></div>
                    <div className="w-1/3 pl-4 text-zinc-300">External APIs</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/3 text-right pr-4 text-zinc-400">External APIs</div>
                    <div className="w-1/3 border-t border-purple-500"></div>
                    <div className="w-1/3 pl-4 text-zinc-300">Database</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/3 text-right pr-4 text-zinc-400">Database</div>
                    <div className="w-1/3 border-t border-purple-500"></div>
                    <div className="w-1/3 pl-4 text-zinc-300">User Interface</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Use Cases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-white">Market Monitoring</h3>
                  <p className="text-zinc-300 text-sm">
                    Track large movements that might impact token prices and market sentiment.
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-white">Investment Research</h3>
                  <p className="text-zinc-300 text-sm">
                    Identify patterns in whale behavior to inform investment decisions.
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-white">Risk Management</h3>
                  <p className="text-zinc-300 text-sm">
                    Get early warnings about potential market manipulation or large sell-offs.
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-white">Token Discovery</h3>
                  <p className="text-zinc-300 text-sm">
                    Discover new tokens that are attracting significant whale interest.
                  </p>
                </div>
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
    </ErrorBoundary>
  )
}
