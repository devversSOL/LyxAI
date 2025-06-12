"use client"

import { MermaidDiagram } from "@/components/mermaid-diagram"

export function SmartDatabasePriority() {
  const chart = `
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

  return <MermaidDiagram chart={chart} title="Smart Database Priority System" />
}

export function MultiSourceDataIntegration() {
  const chart = `
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

  return <MermaidDiagram chart={chart} title="Multi-Source Data Integration" />
}

export function RiskAssessmentAlgorithm() {
  const chart = `
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

  return <MermaidDiagram chart={chart} title="Risk Assessment Algorithm" />
}

export function ChatInterfaceFlow() {
  const chart = `
    stateDiagram-v2
        [*] --> Idle
        Idle --> Processing: User sends message
        Processing --> Analyzing: Valid token/address
        Processing --> Chatting: General question
        
        Analyzing --> FetchingData: Get token data
        FetchingData --> AIProcessing: Data retrieved
        AIProcessing --> DisplayResults: Analysis complete
        DisplayResults --> Idle: User sees results
        
        Chatting --> AIResponse: Process with OpenAI
        AIResponse --> DisplayResponse: Response ready
        DisplayResponse --> Idle: User sees response
        
        DisplayResults --> FollowUp: User asks follow-up
        FollowUp --> AIResponse: Continue conversation
  `

  return <MermaidDiagram chart={chart} title="Chat Interface Flow" />
}
