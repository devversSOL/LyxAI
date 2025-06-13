"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import SimpleMermaid from "@/components/simple-mermaid"

export default function WalletAnalyzerPage() {
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
        <h1 className="text-4xl font-bold mb-6">💼 Wallet Analyzer</h1>

        <p className="text-xl text-zinc-300 mb-8">
          The Wallet Analyzer provides comprehensive insights into Solana wallet addresses, helping you understand
          portfolio composition, transaction history, and risk profiles.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">How It Works</h2>
        <SimpleMermaid
          chart={`
graph TD
    A["Wallet Address Input"] --> B["Address Validation"]
    B --> C["Fetch Wallet Data"]
    C --> D["Solana RPC"]
    C --> E["Token Holdings"]
    C --> F["Transaction History"]
    
    D --> G["Data Processing"]
    E --> G
    F --> G
    
    G --> H["Portfolio Analysis"]
    G --> I["Transaction Patterns"]
    G --> J["Risk Assessment"]
    
    H --> K["Interactive Dashboard"]
    I --> K
    J --> K
`}
        />

        <h2 className="text-2xl font-bold mt-8 mb-4">Key Features</h2>
        <ul className="list-disc pl-6 mb-6 text-zinc-300">
          <li>Comprehensive portfolio breakdown with token values and percentages</li>
          <li>Historical transaction analysis and pattern recognition</li>
          <li>Risk scoring based on transaction patterns and token holdings</li>
          <li>Wallet labeling and categorization (e.g., trader, holder, project treasury)</li>
          <li>Save and track wallets of interest over time</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Using the Wallet Analyzer</h2>
        <div className="bg-zinc-800/50 p-6 rounded-lg mb-8">
          <ol className="list-decimal pl-6 mb-0 text-zinc-300">
            <li className="mb-2">Enter a Solana wallet address in the search field</li>
            <li className="mb-2">View the comprehensive wallet dashboard with portfolio breakdown</li>
            <li className="mb-2">Explore transaction history and pattern analysis</li>
            <li className="mb-2">Review risk assessment and wallet categorization</li>
            <li className="mb-2">Save the wallet to your tracked list for ongoing monitoring</li>
          </ol>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Data Interpretation</h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-zinc-800/50 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Metric</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Interpretation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-t border-zinc-700">Portfolio Diversity</td>
                <td className="px-4 py-2 border-t border-zinc-700">Number and distribution of tokens</td>
                <td className="px-4 py-2 border-t border-zinc-700">
                  Higher diversity may indicate a trader or investor
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-t border-zinc-700">Transaction Frequency</td>
                <td className="px-4 py-2 border-t border-zinc-700">How often the wallet transacts</td>
                <td className="px-4 py-2 border-t border-zinc-700">
                  High frequency suggests active trading or bot activity
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-t border-zinc-700">Holding Period</td>
                <td className="px-4 py-2 border-t border-zinc-700">Average time tokens are held</td>
                <td className="px-4 py-2 border-t border-zinc-700">
                  Longer periods indicate investment rather than trading
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-t border-zinc-700">Risk Score</td>
                <td className="px-4 py-2 border-t border-zinc-700">Composite risk assessment</td>
                <td className="px-4 py-2 border-t border-zinc-700">
                  Based on token quality, transaction patterns, and connections
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Technical Implementation</h2>
        <SimpleMermaid
          chart={`
classDiagram
    class WalletAnalyzer {
        +analyzeWallet(address)
        +fetchTokenHoldings()
        +fetchTransactionHistory()
        +calculateRiskScore()
        +categorizeWallet()
    }
    
    class TokenService {
        +getTokenMetadata()
        +getTokenPrice()
        +calculateTokenValue()
    }
    
    class TransactionService {
        +parseTransactions()
        +identifyPatterns()
        +calculateMetrics()
    }
    
    class RiskEngine {
        +evaluateTokenRisk()
        +evaluateTransactionRisk()
        +evaluateConnectionRisk()
        +calculateCompositeScore()
    }
    
    WalletAnalyzer --> TokenService
    WalletAnalyzer --> TransactionService
    WalletAnalyzer --> RiskEngine
`}
        />

        <h2 className="text-2xl font-bold mt-8 mb-4">Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Due Diligence</h3>
            <p className="text-zinc-300 text-sm">Research project treasuries and team wallets before investing.</p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Whale Tracking</h3>
            <p className="text-zinc-300 text-sm">Monitor the portfolios and activities of known whale wallets.</p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Competitor Analysis</h3>
            <p className="text-zinc-300 text-sm">
              Analyze wallets of competing projects to understand their strategies.
            </p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Security Monitoring</h3>
            <p className="text-zinc-300 text-sm">
              Track your own wallets for unauthorized transactions or suspicious activity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
