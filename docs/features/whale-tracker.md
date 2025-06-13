# 🐋 Whale Activity Tracker

The Whale Activity Tracker is LyxAI's flagship feature for monitoring large Solana transactions and whale movements in real-time.

## Process Overview

\`\`\`mermaid
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
