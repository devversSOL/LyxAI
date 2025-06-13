import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export default function ArchitecturePage() {
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
          <Link href="/docs/technical" className="hover:text-white">
            Technical
          </Link>
          <ChevronRight size={14} />
          <span className="text-white">System Architecture</span>
        </div>

        <h1 className="text-4xl font-bold mb-6">System Architecture</h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300 mb-6">
            This document provides an overview of the LyxAI platform architecture, including the key components, data
            flow, and integration points.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Overview</h2>
          <p className="text-zinc-300 mb-6">
            LyxAI is built as a modern web application using Next.js, with a focus on real-time data processing and
            AI-powered analysis. The system integrates with multiple blockchain data sources and provides users with
            actionable insights.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Component Architecture</h2>
          <div className="bg-zinc-900/50 p-6 rounded-lg mb-8 border border-zinc-800">
            <div className="text-center text-zinc-300 mb-4">Component Architecture</div>

            <div className="grid grid-cols-1 gap-6">
              {/* User Interface Layer */}
              <div className="border border-purple-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-purple-400">User Interface</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="bg-zinc-800 p-2 rounded text-center text-sm">Chat Interface</div>
                  <div className="bg-zinc-800 p-2 rounded text-center text-sm">Whale Tracker</div>
                  <div className="bg-zinc-800 p-2 rounded text-center text-sm">Contract Analyzer</div>
                  <div className="bg-zinc-800 p-2 rounded text-center text-sm">Saved Wallets</div>
                </div>
              </div>

              {/* State Management Layer */}
              <div className="border border-blue-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-blue-400">State Management</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-zinc-800 p-2 rounded text-center text-sm">React State</div>
                  <div className="bg-zinc-800 p-2 rounded text-center text-sm">Real-time Updates</div>
                  <div className="bg-zinc-800 p-2 rounded text-center text-sm">Performance Monitor</div>
                </div>
              </div>

              {/* API Services Layer */}
              <div className="border border-green-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-green-400">API Services</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="bg-zinc-800 p-2 rounded text-center text-sm">Analysis Service</div>
                  <div className="bg-zinc-800 p-2 rounded text-center text-sm">Whale Service</div>
                  <div className="bg-zinc-800 p-2 rounded text-center text-sm">Chat Service</div>
                  <div className="bg-zinc-800 p-2 rounded text-center text-sm">Wallet Service</div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Data Flow Architecture</h2>
          <div className="bg-zinc-900/50 p-6 rounded-lg mb-8 border border-zinc-800">
            <div className="text-center text-zinc-300 mb-4">Data Flow</div>

            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="bg-zinc-800 p-2 rounded w-40 text-center">User Input</div>
                <div className="h-6 border-l border-zinc-500"></div>
                <div className="bg-zinc-800 p-2 rounded w-40 text-center">Input Validation</div>
                <div className="h-6 border-l border-zinc-500"></div>
                <div className="bg-zinc-800 p-2 rounded w-40 text-center">Address Type Detection</div>
                <div className="h-6 border-l border-zinc-500"></div>
                <div className="bg-purple-900/50 p-2 rounded w-40 text-center">Token or Wallet?</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Token Flow */}
                <div className="flex flex-col items-center">
                  <div className="text-sm text-zinc-400 mb-2">Token Flow</div>
                  <div className="bg-zinc-800 p-2 rounded w-40 text-center">Database Check</div>
                  <div className="h-6 border-l border-zinc-500"></div>
                  <div className="bg-purple-900/50 p-2 rounded w-40 text-center">Found in DB?</div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-zinc-400">Yes</div>
                      <div className="h-6 border-l border-zinc-500"></div>
                      <div className="bg-zinc-800 p-2 rounded w-32 text-center text-sm">Return Cached</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-zinc-400">No</div>
                      <div className="h-6 border-l border-zinc-500"></div>
                      <div className="bg-zinc-800 p-2 rounded w-32 text-center text-sm">External APIs</div>
                    </div>
                  </div>
                </div>

                {/* Wallet Flow */}
                <div className="flex flex-col items-center">
                  <div className="text-sm text-zinc-400 mb-2">Wallet Flow</div>
                  <div className="bg-zinc-800 p-2 rounded w-40 text-center">Wallet Analysis</div>
                  <div className="h-6 border-l border-zinc-500"></div>
                  <div className="bg-zinc-800 p-2 rounded w-40 text-center">Data Processing</div>
                  <div className="h-6 border-l border-zinc-500"></div>
                  <div className="bg-green-900/50 p-2 rounded w-40 text-center">Return Results</div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Technology Stack</h2>
          <ul className="list-disc pl-6 mb-6 text-zinc-300">
            <li>
              <strong className="text-white">Frontend</strong>: Next.js, React, TailwindCSS
            </li>
            <li>
              <strong className="text-white">Backend</strong>: Next.js API Routes, Serverless Functions
            </li>
            <li>
              <strong className="text-white">Database</strong>: Supabase (PostgreSQL)
            </li>
            <li>
              <strong className="text-white">AI Processing</strong>: OpenAI API
            </li>
            <li>
              <strong className="text-white">Data Sources</strong>: Solscan, Birdeye, DexScreener
            </li>
            <li>
              <strong className="text-white">Deployment</strong>: Vercel
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Security Considerations</h2>
          <ul className="list-disc pl-6 mb-6 text-zinc-300">
            <li>All API keys are stored as environment variables</li>
            <li>User data is encrypted at rest</li>
            <li>Rate limiting is implemented for all external API calls</li>
            <li>Input validation is performed on all user inputs</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Scalability</h2>
          <p className="text-zinc-300">
            The architecture is designed to scale horizontally, with stateless components that can be replicated as
            needed. The use of serverless functions allows for automatic scaling based on demand.
          </p>
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
