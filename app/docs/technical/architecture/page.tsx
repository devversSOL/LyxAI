"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import SimpleMermaid from "@/components/simple-mermaid"

export default function ArchitecturePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
            <Link href="/docs" className="hover:text-white">
              Documentation
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">System Architecture</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">System Architecture</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-zinc-800 rounded w-5/6 mb-4"></div>
          </div>
        </div>
      </div>
    )
  }

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
            <SimpleMermaid
              chart={`
graph LR
    subgraph "User Interface"
        A["Chat Interface"]
        B["Whale Tracker"]
        C["Contract Analyzer"]
        D["Saved Wallets"]
    end
    
    subgraph "State Management"
        E["React State"]
        F["Real-time Updates"]
        G["Performance Monitor"]
    end
    
    subgraph "API Services"
        H["Analysis Service"]
        I["Whale Service"]
        J["Chat Service"]
        K["Wallet Service"]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    E --> H
    E --> I
    E --> J
    E --> K
    F --> E
    G --> E
`}
            />
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Data Flow Architecture</h2>
          <div className="bg-zinc-900/50 p-6 rounded-lg mb-8 border border-zinc-800">
            <SimpleMermaid
              chart={`
graph TD
    A["User Input"] --> B["Input Validation"]
    B --> C["Address Type Detection"]
    C --> D{"Token or Wallet?"}
    
    D -->|Token| E["Database Check"]
    D -->|Wallet| F["Wallet Analysis"]
    
    E --> G{"Found in DB?"}
    G -->|Yes| H["Return Cached Analysis"]
    G -->|No| I["External API Calls"]
    
    I --> J["DexScreener API"]
    I --> K["Birdeye API"]
    I --> L["Solscan API"]
    
    J --> M["Data Aggregation"]
    K --> M
    L --> M
    
    M --> N["AI Processing"]
    N --> O["Risk Assessment"]
    O --> P["Store in Database"]
    P --> Q["Return Results"]
    
    F --> R["Wallet Data Processing"]
    R --> Q
    H --> Q
`}
            />
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
