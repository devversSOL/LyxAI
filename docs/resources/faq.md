# Frequently Asked Questions (FAQ)

## General Questions

### What is LyxAI?
LyxAI is a comprehensive Solana-focused crypto intelligence platform that provides advanced AI-powered analysis, real-time whale tracking, and market insights specifically designed for the Solana ecosystem.

![LyxAI Platform Overview](/placeholder.svg?height=300&width=800&text=LyxAI+Comprehensive+Solana+Intelligence+Platform)

### How can I contribute to the project?
We welcome contributions! Please see our [Contribution Guidelines](CONTRIBUTING.md) for more information on how to get involved with the LyxAI platform.

### Where can I find the project's documentation?
You can find our comprehensive documentation in the `/docs` section, including API references, user guides, and technical documentation.

### What makes LyxAI different from other crypto platforms?
LyxAI is exclusively focused on the Solana ecosystem, providing specialized tools and AI-powered analysis specifically designed for Solana tokens, contracts, and whale activity.

## Blockchain Support

### Which blockchains are supported?
LyxAI exclusively supports the Solana blockchain. This focused approach allows us to provide deep, specialized analysis and real-time monitoring tailored specifically for the Solana ecosystem.

### Why only Solana?
We focus exclusively on Solana because:
- **Speed & Efficiency**: Solana's high throughput enables real-time analysis
- **Growing Ecosystem**: Rapidly expanding DeFi and token ecosystem
- **Data Availability**: Excellent APIs and blockchain transparency
- **Innovation Hub**: Home to cutting-edge crypto projects

![Solana Blockchain Focus](/placeholder.svg?height=250&width=600&text=Solana+Blockchain+Exclusive+Support+and+Benefits)

\`\`\`mermaid title="Why Solana Focus" type="diagram"
graph LR
    A["Solana Benefits"] --> B["High Speed"]
    A --> C["Low Fees"]
    A --> D["Growing Ecosystem"]
    A --> E["Rich APIs"]
    
    B --> F["Real-time Analysis"]
    C --> F
    D --> G["Innovation Hub"]
    E --> H["Data Availability"]
    
    F --> I["Better User Experience"]
    G --> I
    H --> I
\`\`\`

### How do I connect to the Solana blockchain?
LyxAI automatically connects to Solana through integrated APIs including Solscan, Birdeye, and DexScreener. No manual connection required.

## Account & Wallet Management

### How do I analyze a Solana wallet?
Simply paste any Solana wallet address into our "Why did it send?" analyzer or use the wallet information API endpoint. The platform will automatically detect if it's a wallet or token contract.

![Wallet Analysis Process](/placeholder.svg?height=300&width=800&text=Wallet+Analysis+Process+Paste+Address+AI+Analysis+Results)

### Can I save wallet addresses for later analysis?
Yes! Use our Saved Wallets Manager to store and organize important Solana wallet addresses with custom labels and notes.

### How do I create a new Solana account?
You can create a new Solana account using popular Solana wallets such as Phantom, Solflare, or other Solana-compatible wallets.

## Features & Analysis

### What is the "Why did it send?" analyzer?
This is our flagship AI-powered token analysis tool that provides comprehensive analysis of Solana tokens, including risk assessment, market data, and AI-generated insights.

![Token Analyzer Interface](/placeholder.svg?height=400&width=800&text=Why+Did+It+Send+Analyzer+AI+Chat+Interface+with+Analysis)

### How does the whale tracker work?
Our whale tracker monitors Discord channels in real-time to capture large Solana transactions, providing instant alerts about whale activity with detailed metrics.

\`\`\`mermaid title="Whale Tracker Workflow" type="diagram"
graph LR
    A["Discord Channels"] --> B["Real-time Monitoring"]
    B --> C["Message Processing"]
    C --> D["Data Extraction"]
    D --> E["Validation"]
    E --> F["Database Storage"]
    F --> G["Live UI Updates"]
    
    H["Token Filtering"] --> G
    I["Most Traded Analysis"] --> G
\`\`\`

### What kind of contract analysis do you provide?
We offer AI-powered analysis of Solana smart contracts, including security assessments, functionality analysis, and risk scoring specifically tailored for Solana programs.

### How accurate is the AI analysis?
Our AI analysis combines data from multiple sources (DexScreener, Birdeye, Solscan) with advanced OpenAI models to provide comprehensive and accurate insights. However, always do your own research before making investment decisions.

## Technical Questions

### What APIs does LyxAI integrate with?
We integrate with several Solana-focused APIs:
- **Solscan**: Blockchain data and transaction details
- **Birdeye**: Token market data and analytics
- **DexScreener**: DEX trading data
- **OpenAI**: AI analysis capabilities
- **Discord**: Real-time whale activity monitoring

![API Integration Overview](/placeholder.svg?height=300&width=900&text=API+Integrations+Solscan+Birdeye+DexScreener+OpenAI+Discord)

### How do I access the LyxAI API?
Refer to our [API Reference](../technical/api-reference.md) for comprehensive documentation on all available endpoints and authentication methods.

### What programming languages can I use with the API?
Our REST API can be used with any programming language that supports HTTP requests. We provide examples in JavaScript, Python, and curl.

### Are there rate limits on the API?
Yes, we have rate limits to ensure fair usage:
- General APIs: 100 requests per minute
- Analysis APIs: 20 requests per minute
- Chat APIs: 50 requests per minute
- Whale Activity: 200 requests per minute

## Transactions & Analysis

### How do I analyze a Solana transaction?
Paste the transaction signature or wallet address into our analysis tools. The platform will automatically fetch and analyze the transaction data.

### How long does it take for analysis to complete?
Most analyses complete within seconds. Our smart database priority system checks internal storage first for faster responses on previously analyzed tokens.

### Can I export analysis results?
Yes, you can export analysis results and narratives for external use through our API or user interface.

### How often is the data updated?
Our platform provides real-time data updates for whale activity, trending coins, and market data. Analysis narratives are stored and updated as new information becomes available.

## Troubleshooting

### I'm getting an error message. What should I do?
Check the error message carefully and refer to our [API Reference](../technical/api-reference.md) for common error codes. You can also search our documentation or contact support.

### My analysis is not working. What should I check?
Ensure you're using a valid Solana address format. Our platform only supports Solana blockchain addresses. Check that the token or contract exists on Solana mainnet.

### The whale tracker isn't showing recent activity. Why?
The whale tracker depends on Discord channel activity. If there's no recent whale activity or Discord integration issues, you may see fewer updates. Check our status page for any service disruptions.

### How do I report a bug or request a feature?
Please contact our support team through our official channels or submit an issue through our community forum.

## Performance & Compatibility

### Why is the 3D interface slow on my device?
LyxAI automatically adjusts visual quality based on your device capabilities. Lower-end devices will use simplified graphics or CSS fallbacks for better performance.

### Does LyxAI work on mobile devices?
Yes! LyxAI is fully optimized for mobile devices with touch-first design, adaptive performance, and responsive layouts.

### Which browsers are supported?
LyxAI works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest browser versions for the best experience.

### Can I use LyxAI offline?
Some features work offline with cached data, but most functionality requires an internet connection for real-time analysis and data updates.

## Privacy & Security

### What data does LyxAI collect?
LyxAI only collects data necessary for platform functionality, such as analysis requests and saved wallet addresses. We follow a privacy-first approach.

### Is my data secure?
Yes, all data is encrypted and securely stored in our Supabase database. We implement comprehensive security measures including input validation and secure communications.

### Do you store private keys?
No, LyxAI never stores or requests private keys. We only analyze public blockchain data and wallet addresses.

## Getting Help

### How can I contact the LyxAI team?
You can reach us through our official support channels, community forum, or documentation feedback system.

### Is there a community forum or chat?
Yes, join our community to discuss Solana analysis, share insights, and get help from other users and the LyxAI team.

### Where can I find tutorials and guides?
Check our [User Interface Guide](../getting-started/user-interface.md) and [Quick Start Guide](../getting-started/quick-start.md) for comprehensive tutorials.

### How do I stay updated on new features?
Follow our [Release Notes](release-notes.md) for the latest updates, new features, and improvements to the LyxAI platform.
