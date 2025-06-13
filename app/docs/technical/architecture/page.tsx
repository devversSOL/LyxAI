import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import Image from "next/image"

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
            <div className="flex justify-center">
              <Image
                src="/images/component-architecture.png"
                alt="LyxAI System Architecture Diagram showing User Interface components (Chat Interface, Whale Tracker, Contract Analyzer, Saved Wallets) connecting to State Management (React State, Real-time Updates, Performance Monitor) which connects to API Services (Analysis Service, Whale Service, Chat Service, Wallet Service)"
                width={800}
                height={600}
                className="rounded-lg"
                priority
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Data Flow Architecture</h2>
          <div className="bg-zinc-900/50 p-6 rounded-lg mb-8 border border-zinc-800">
            <div className="flex justify-center">
              <Image
                src="/images/data-flow-architecture.png"
                alt="LyxAI Data Flow Architecture Diagram showing the complete process flow from User Input through Input Validation, Address Type Detection, branching to Token or Wallet paths, with Token path going through Database Check, External API Calls (DexScreener, Birdeye, Solscan), Data Aggregation, AI Processing, Risk Assessment, Store in Database, and Return Results. Wallet path goes through Wallet Analysis and Wallet Data Processing to Return Results."
                width={800}
                height={1200}
                className="rounded-lg"
                priority
              />
            </div>
          </div>

          <p className="text-zinc-300 mb-6">The data flow follows these key processes:</p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-purple-400">Token Analysis Flow</h3>
          <ol className="list-decimal pl-6 mb-4 text-zinc-300">
            <li>User input is validated and address type is detected</li>
            <li>System checks if token data exists in database</li>
            <li>If cached data exists, return immediately</li>
            <li>If not cached, make external API calls to DexScreener, Birdeye, and Solscan</li>
            <li>Aggregate data from all sources</li>
            <li>Process through AI for analysis and risk assessment</li>
            <li>Store results in database for future use</li>
            <li>Return comprehensive analysis to user</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-blue-400">Wallet Analysis Flow</h3>
          <ol className="list-decimal pl-6 mb-6 text-zinc-300">
            <li>User input is validated and identified as wallet address</li>
            <li>Direct wallet analysis is performed</li>
            <li>Wallet data is processed and analyzed</li>
            <li>Results are returned to user</li>
          </ol>

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
          <p className="text-zinc-300 mb-6">
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
