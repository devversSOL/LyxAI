"use client"

import { MermaidDiagram } from "@/components/mermaid-diagram"

export function WhaleTrackerDataFlow() {
  const chart = `
    graph TB
        A[Discord Channels] --> B[Webhook Receiver]
        B --> C[Message Parser]
        C --> D[Whale Detection]
        D --> E{Valid Whale Alert?}
        
        E -->|Yes| F[Extract Token Info]
        E -->|No| G[Discard Message]
        
        F --> H[Fetch Token Data]
        H --> I[DexScreener API]
        H --> J[Birdeye API]
        
        I --> K[Data Aggregation]
        J --> K
        
        K --> L[Store in Database]
        L --> M[Real-time UI Update]
        M --> N[User Dashboard]
        
        O[User Filters] --> P[Token Selection]
        P --> Q[Filter Results]
        Q --> N
  `

  return <MermaidDiagram chart={chart} title="Whale Tracker Data Flow" />
}

export function TokenFilteringProcess() {
  const chart = `
    flowchart LR
        A[All Whale Activities] --> B{User Filter Applied?}
        B -->|No| C[Show All Activities]
        B -->|Yes| D[Filter by Token]
        
        D --> E{Token Match?}
        E -->|Yes| F[Include in Results]
        E -->|No| G[Exclude from Results]
        
        F --> H[Sort by Timestamp]
        G --> H
        H --> I[Display Filtered Results]
  `

  return <MermaidDiagram chart={chart} title="Token Filtering Process" />
}

export function RealTimeUpdateMechanism() {
  const chart = `
    sequenceDiagram
        participant D as Discord
        participant W as Webhook
        participant DB as Database
        participant RT as Real-time
        participant UI as User Interface
        
        D->>W: New whale alert
        W->>DB: Store whale data
        DB->>RT: Trigger update
        RT->>UI: Push notification
        UI->>UI: Update display
  `

  return <MermaidDiagram chart={chart} title="Real-time Update Mechanism" />
}
