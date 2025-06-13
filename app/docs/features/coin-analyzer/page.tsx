"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import SimpleMermaid from "@/components/simple-mermaid"

export default function CoinAnalyzerPage() {
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
        <h1 className="text-4xl font-bold mb-6">🔍 Coin Analyzer</h1>

        <p className="text-xl text-zinc-300 mb-8">
          The Coin Analyzer provides comprehensive token analysis and risk assessment for Solana tokens, helping you
          make informed investment decisions.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Analysis Process</h2>
        <SimpleMermaid
          chart={`
graph TD
    A["Token Address Input"] --> B["Token Validation"]
    B --> C["Fetch Token Data"]
    C --> D["Market Data"]
    C --> E["Contract Analysis"]
    C --> F["Social Metrics"]
    
    D --> G["Data Processing"]
    E --> G
    F --> G
    
    G --> H["Liquidity Analysis"]
    G --> I["Contract Risk Assessment"]
    G --> J["Social Sentiment Analysis"]
    
    H --> K["Comprehensive Risk Score"]
    I --> K
    J --> K
    
    K --> L["Analysis Dashboard"]
`}
        />

        <h2 className="text-2xl font-bold mt-8 mb-4">Key Features</h2>
        <ul className="list-disc pl-6 mb-6 text-zinc-300">
          <li>Comprehensive token analysis with multiple data sources</li>
          <li>Contract risk assessment and security analysis</li>
          <li>Liquidity and market metrics evaluation</li>
          <li>Social sentiment analysis and trend detection</li>
          <li>Composite risk scoring with detailed breakdown</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Risk Assessment Methodology</h2>
        <p className="text-zinc-300 mb-4">
          Our risk assessment methodology evaluates tokens across multiple dimensions, each contributing to the overall
          risk score:
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-zinc-800/50 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Risk Category</th>
                <th className="px-4 py-2 text-left">Weight</th>
                <th className="px-4 py-2 text-left">Factors Considered</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-t border-zinc-700">Contract Security</td>
                <td className="px-4 py-2 border-t border-zinc-700">30%</td>
                <td className="px-4 py-2 border-t border-zinc-700">
                  Ownership, permissions, code vulnerabilities, audit status
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-t border-zinc-700">Liquidity</td>
                <td className="px-4 py-2 border-t border-zinc-700">25%</td>
                <td className="px-4 py-2 border-t border-zinc-700">
                  Pool size, distribution, concentration, stability
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-t border-zinc-700">Market Metrics</td>
                <td className="px-4 py-2 border-t border-zinc-700">20%</td>
                <td className="px-4 py-2 border-t border-zinc-700">
                  Volume, market cap, price volatility, holder distribution
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-t border-zinc-700">Social Sentiment</td>
                <td className="px-4 py-2 border-t border-zinc-700">15%</td>
                <td className="px-4 py-2 border-t border-zinc-700">
                  Social media activity, sentiment analysis, community growth
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-t border-zinc-700">Team & Project</td>
                <td className="px-4 py-2 border-t border-zinc-700">10%</td>
                <td className="px-4 py-2 border-t border-zinc-700">
                  Team transparency, project roadmap, development activity
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Using the Coin Analyzer</h2>
        <div className="bg-zinc-800/50 p-6 rounded-lg mb-8">
          <ol className="list-decimal pl-6 mb-0 text-zinc-300">
            <li className="mb-2">Enter a Solana token address or symbol in the search field</li>
            <li className="mb-2">View the comprehensive analysis dashboard</li>
            <li className="mb-2">Explore detailed metrics across all risk categories</li>
            <li className="mb-2">Review the overall risk assessment and recommendations</li>
            <li className="mb-2">Save the analysis or export the report for future reference</li>
          </ol>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Data Sources</h2>
        <p className="text-zinc-300 mb-4">
          The Coin Analyzer aggregates data from multiple sources to provide comprehensive insights:
        </p>
        <ul className="list-disc pl-6 mb-6 text-zinc-300">
          <li>Solana blockchain data for contract analysis</li>
          <li>DexScreener and Birdeye for market metrics</li>
          <li>Social media platforms for sentiment analysis</li>
          <li>Project documentation and team information</li>
          <li>Historical price and volume data</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Technical Implementation</h2>
        <SimpleMermaid
          chart={`
sequenceDiagram
    participant User
    participant API as API Gateway
    participant Contract as Contract Analyzer
    participant Market as Market Data Service
    participant Social as Social Analyzer
    participant DB as Database
    
    User->>API: Request Token Analysis
    API->>Contract: Analyze Contract
    API->>Market: Fetch Market Data
    API->>Social: Analyze Social Sentiment
    
    Contract-->>API: Contract Analysis Results
    Market-->>API: Market Metrics
    Social-->>API: Sentiment Analysis
    
    API->>API: Calculate Risk Score
    API->>DB: Store Analysis Results
    API-->>User: Return Comprehensive Analysis
`}
        />

        <h2 className="text-2xl font-bold mt-8 mb-4">Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Investment Research</h3>
            <p className="text-zinc-300 text-sm">Evaluate tokens before investing to understand risks and potential.</p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Portfolio Management</h3>
            <p className="text-zinc-300 text-sm">Regularly assess tokens in your portfolio to manage risk exposure.</p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Market Research</h3>
            <p className="text-zinc-300 text-sm">Compare multiple tokens to identify trends and opportunities.</p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Project Evaluation</h3>
            <p className="text-zinc-300 text-sm">
              For project teams to assess their own token's health and areas for improvement.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
