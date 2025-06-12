import Link from "next/link"
import { Home } from "lucide-react"
import SimpleMermaid from "@/components/simple-mermaid"

export default function SimpleTest() {
  const whaleTrackerFlow = `
    graph TB
      A[Discord Alert] --> B[Webhook]
      B --> C[Parse Message]
      C --> D{Valid Whale?}
      D -->|Yes| E[Store Data]
      D -->|No| F[Discard]
      E --> G[Update UI]
  `

  const tokenAnalysisFlow = `
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

  const riskAssessment = `
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
  `

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4">
            <Home size={16} />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-4">Simple Mermaid Test</h1>
          <p className="text-zinc-300">Testing the Google example approach</p>
        </div>

        <SimpleMermaid chart={whaleTrackerFlow} title="Whale Tracker Flow" />

        <SimpleMermaid chart={tokenAnalysisFlow} title="Token Analysis Process" />

        <SimpleMermaid chart={riskAssessment} title="Risk Assessment Algorithm" />

        <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-white/10">
          <h3 className="font-semibold mb-2">Notes:</h3>
          <ul className="text-sm text-zinc-300 space-y-1">
            <li>• Using the Google example approach with some improvements</li>
            <li>• Added dark theme with LyxAI colors</li>
            <li>• Made diagram content configurable</li>
            <li>• Added proper TypeScript typing</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
