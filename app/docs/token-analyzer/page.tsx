import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import SimpleMermaid from "@/components/simple-mermaid"

export default function TokenAnalyzerDocs() {
  const smartDatabasePriority = `
    sequenceDiagram
      participant U as User
      participant API as Analysis API
      participant DB as Database
      participant EXT as External APIs
      participant AI as OpenAI
      
      U->>API: Request Token Analysis
      API->>DB: Check for Existing Analysis
      
      alt Analysis Found
          DB-->>API: Return Cached Data
          API-->>U: Display Cached Analysis
      else No Analysis Found
          API->>EXT: Fetch Token Data
          EXT-->>API: Raw Token Data
          API->>AI: Process with AI
          AI-->>API: Analysis & Risk Score
          API->>DB: Store New Analysis
          API-->>U: Display Fresh Analysis
      end
  `

  const multiSourceIntegration = `
    graph LR
      A[Token Address] --> B[Data Source Router]
      
      B --> C[DexScreener]
      B --> D[Birdeye]
      B --> E[Solscan]
      
      C --> F[DEX Trading Data]
      D --> G[Market Metrics]
      E --> H[Blockchain Data]
      
      F --> I[Data Aggregator]
      G --> I
      H --> I
      
      I --> J[Unified Token Profile]
      J --> K[AI Analysis Engine]
      K --> L[Risk Assessment]
      L --> M[Final Analysis]
  `

  const riskAssessmentAlgorithm = `
    flowchart TD
      A[Token Data] --> B[Liquidity Analysis]
      A --> C[Holder Distribution]
      A --> D[Trading Volume]
      A --> E[Contract Security]
      
      B --> F{Liquidity > Threshold?}
      C --> G{Holders Distributed?}
      D --> H{Volume Healthy?}
      E --> I{Contract Verified?}
      
      F -->|Yes| J[+2 Points]
      F -->|No| K[-3 Points]
      G -->|Yes| L[+2 Points]
      G -->|No| M[-2 Points]
      H -->|Yes| N[+1 Point]
      H -->|No| O[-1 Point]
      I -->|Yes| P[+3 Points]
      I -->|No| Q[-5 Points]
      
      J --> R[Calculate Final Score]
      K --> R
      L --> R
      M --> R
      N --> R
      O --> R
      P --> R
      Q --> R
      
      R --> S{Score >= 5?}
      S -->|Yes| T[Low Risk]
      S -->|No| U{Score >= 0?}
      U -->|Yes| V[Medium Risk]
      U -->|No| W[High Risk]
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
            <span className="text-white">Token Analyzer</span>
          </div>
        </div>

        {/* Content */}
        <article className="prose prose-invert prose-purple max-w-none">
          <h1 className="text-4xl font-bold mb-6">🤖 "Why Did It Send?" Token Analyzer</h1>

          <p className="text-xl text-zinc-300 mb-8">
            Advanced AI-powered Solana token analysis system with smart database priority and multi-source data
            integration.
          </p>

          <h2 className="text-2xl font-bold mb-4">Smart Database Priority System</h2>
          <p className="text-zinc-300 mb-4">
            The token analyzer first checks our internal database for existing analysis before making external API
            calls, ensuring faster response times and reduced API costs while maintaining data freshness:
          </p>

          <SimpleMermaid chart={smartDatabasePriority} />

          <h3 className="text-xl font-semibold mb-4">Key Features</h3>
          <ul className="text-zinc-300 space-y-2 mb-6">
            <li>
              <strong>Smart Database Priority:</strong> Checks internal database before external APIs for faster
              responses
            </li>
            <li>
              <strong>Multi-Source Analysis:</strong> Integrates DexScreener, Birdeye, and Solscan data
            </li>
            <li>
              <strong>Risk Assessment:</strong> Comprehensive risk scoring system for Solana tokens
            </li>
            <li>
              <strong>Narrative Display:</strong> Shows stored analysis narratives when available
            </li>
            <li>
              <strong>Real-time Chat Interface:</strong> Interactive AI conversation for deeper insights
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">Multi-Source Data Integration</h2>
          <p className="text-zinc-300 mb-4">
            The system aggregates data from multiple Solana-focused sources to provide comprehensive token analysis:
          </p>

          <SimpleMermaid chart={multiSourceIntegration} />

          <h2 className="text-2xl font-bold mb-4">Risk Assessment Algorithm</h2>
          <p className="text-zinc-300 mb-4">
            Our proprietary risk assessment algorithm analyzes multiple factors to provide accurate risk scores:
          </p>

          <SimpleMermaid chart={riskAssessmentAlgorithm} />

          <h3 className="text-xl font-semibold mb-4">Risk Factors Analyzed</h3>
          <ul className="text-zinc-300 space-y-2 mb-6">
            <li>
              <strong>Liquidity Analysis:</strong> Pool depth, slippage potential, and liquidity distribution
            </li>
            <li>
              <strong>Holder Distribution:</strong> Token concentration, whale holdings, and distribution patterns
            </li>
            <li>
              <strong>Trading Volume:</strong> Volume consistency, trading patterns, and market activity
            </li>
            <li>
              <strong>Contract Security:</strong> Code verification, audit status, and known vulnerabilities
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-4">Data Sources</h3>
          <ul className="text-zinc-300 space-y-2 mb-6">
            <li>
              <strong>DexScreener:</strong> Real-time Solana DEX data and analytics
            </li>
            <li>
              <strong>Birdeye:</strong> Comprehensive Solana token and market data
            </li>
            <li>
              <strong>Solscan:</strong> Solana blockchain data and transaction details
            </li>
            <li>
              <strong>OpenAI:</strong> Advanced AI analysis and natural language processing
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
