"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import SimpleMermaid from "@/components/simple-mermaid"

export default function UserInterfaceGuidePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
          <Link href="/docs" className="hover:text-white">
            Documentation
          </Link>
          <ChevronRight size={14} />
          <span className="text-white">User Interface Guide</span>
        </div>

        {/* Content */}
        <article className="prose prose-invert prose-purple max-w-none">
          <h1 className="text-4xl font-bold mb-6">User Interface Guide</h1>

          <p className="text-xl text-zinc-300 mb-8">
            This guide provides a comprehensive overview of the LyxAI platform interface, helping you navigate and
            utilize all available features effectively.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Platform Overview</h2>

          <p>
            The LyxAI platform features a modern, intuitive interface designed for crypto analysts and traders. The
            interface is divided into several key sections, each providing specific functionality and insights.
          </p>

          <div className="my-8 p-6 bg-zinc-900/50 rounded-lg border border-purple-900/30">
            <h3 className="text-xl font-medium mb-4">Main Navigation Areas</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>
                  <strong>Dashboard:</strong> Monitor large transactions and whale activity
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>
                  <strong>Wallet Analyzer:</strong> Analyze wallet holdings, transactions, and patterns
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>
                  <strong>Coin Analyzer:</strong> Deep dive into token metrics, risks, and opportunities, narrative
                  analysis all ai made
                </span>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Interface Layout</h2>

          <p>The LyxAI interface follows a consistent layout pattern across all sections:</p>

          <SimpleMermaid
            chart={`
          graph TD
            A["Header Navigation"] --> B["Main Content Area"]
            A --> C["Side Navigation"]
            B --> D["Feature-specific Controls"]
            B --> E["Data Visualization"]
            B --> F["Analysis Results"]
            C --> G["Quick Access Links"]
            C --> H["User Settings"]
          `}
          />

          <h2 className="text-2xl font-semibold mt-10 mb-4">Feature-Specific Interfaces</h2>

          <h3 className="text-xl font-medium mt-8 mb-3">Whale Tracker Interface</h3>

          <p className="mb-4">
            The Whale Tracker provides real-time monitoring of large transactions across the Solana blockchain.
          </p>

          <div className="my-6 p-5 bg-purple-900/20 rounded-lg border border-purple-500/30">
            <h4 className="text-lg font-medium mb-2">Key Interface Elements:</h4>
            <ul className="space-y-2">
              <li>• Transaction feed with filtering options</li>
              <li>• Wallet profile cards for quick analysis</li>
              <li>• Token movement visualizations</li>
              <li>• Alert configuration panel</li>
            </ul>
          </div>

          <h3 className="text-xl font-medium mt-8 mb-3">Wallet Analyzer Interface</h3>

          <p className="mb-4">
            The Wallet Analyzer allows you to deep dive into any Solana wallet, examining holdings, transaction
            patterns, and risk profiles.
          </p>

          <div className="my-6 p-5 bg-purple-900/20 rounded-lg border border-purple-500/30">
            <h4 className="text-lg font-medium mb-2">Key Interface Elements:</h4>
            <ul className="space-y-2">
              <li>• Wallet search and input field</li>
              <li>• Holdings breakdown with token details</li>
              <li>• Transaction history timeline</li>
              <li>• Risk assessment indicators</li>
              <li>• Related wallets network</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Interactive Elements</h2>

          <p>The LyxAI platform features various interactive elements designed to enhance your analysis experience:</p>

          <div className="overflow-x-auto my-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-800">
                  <th className="border border-zinc-700 p-3 text-left">Element</th>
                  <th className="border border-zinc-700 p-3 text-left">Function</th>
                  <th className="border border-zinc-700 p-3 text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-zinc-700 p-3">Search Bar</td>
                  <td className="border border-zinc-700 p-3">Find tokens, wallets, or transactions</td>
                  <td className="border border-zinc-700 p-3">Header, Feature pages</td>
                </tr>
                <tr className="bg-zinc-800/50">
                  <td className="border border-zinc-700 p-3">Filter Controls</td>
                  <td className="border border-zinc-700 p-3">Refine data display based on criteria</td>
                  <td className="border border-zinc-700 p-3">Data tables, Transaction feeds</td>
                </tr>
                <tr>
                  <td className="border border-zinc-700 p-3">Interactive Charts</td>
                  <td className="border border-zinc-700 p-3">Visualize data with hover details</td>
                  <td className="border border-zinc-700 p-3">Analysis pages, Dashboard</td>
                </tr>
                <tr className="bg-zinc-800/50">
                  <td className="border border-zinc-700 p-3">Save/Bookmark</td>
                  <td className="border border-zinc-700 p-3">Save wallets or tokens for later</td>
                  <td className="border border-zinc-700 p-3">Analysis results, Search results</td>
                </tr>
              </tbody>
            </table>
          </div>
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
