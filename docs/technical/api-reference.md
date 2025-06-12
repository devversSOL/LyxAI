# LyxAI API Reference

This document provides a comprehensive reference for LyxAI's API endpoints, covering all platform functionalities for Solana ecosystem analysis.

## Authentication

All API requests require proper authentication. Include your API key in the request headers:

\`\`\`
X-API-Key: YOUR_API_KEY
Content-Type: application/json
\`\`\`

## Core Analysis APIs

![API Architecture Overview](/placeholder.svg?height=400&width=1000&text=LyxAI+API+Architecture+with+Authentication+and+Rate+Limiting)

### Address Analysis

#### Check Address Type
Determines if a Solana address is a token contract or wallet address.

**Endpoint:** `GET /api/check-address-type?address={address}`

**Parameters:**
- `address` (required): Solana address to analyze

**Response Example:**
\`\`\`json
{
  "address": "SOLANA_ADDRESS",
  "type": "token", // or "wallet"
  "isValid": true,
  "network": "solana"
}
\`\`\`

![Address Type Check Flow](/placeholder.svg?height=250&width=700&text=Address+Type+Detection+Flow+Token+vs+Wallet)

#### Contract Analysis
Performs comprehensive AI-powered analysis of a Solana contract.

**Endpoint:** `POST /api/analyze-contract`

**Request Body:**
\`\`\`json
{
  "address": "SOLANA_CONTRACT_ADDRESS",
  "context": "Optional context for analysis"
}
\`\`\`

**Response Example:**
\`\`\`json
{
  "success": true,
  "analysis": "Comprehensive AI analysis of the Solana contract...",
  "riskScore": 7.5,
  "contractType": "token",
  "securityAssessment": {
    "vulnerabilities": [],
    "recommendations": []
  }
}
\`\`\`

![Contract Analysis Process](/placeholder.svg?height=400&width=800&text=Contract+Analysis+Process+with+AI+and+Security+Assessment)

### Chat & AI APIs

#### AI Chat
Interactive chat with AI for Solana crypto analysis and insights.

**Endpoint:** `POST /api/chat`

**Request Body:**
\`\`\`json
{
  "message": "User message about Solana",
  "context": "Optional conversation context",
  "mode": "general" // or "analysis", "contract"
}
\`\`\`

**Response Example:**
\`\`\`json
{
  "response": "AI response about Solana ecosystem",
  "context": "Updated conversation context",
  "suggestions": ["Follow-up question 1", "Follow-up question 2"],
  "solanaSpecific": true
}
\`\`\`

## Whale Activity APIs

### Discord Whale Activity
Retrieves real-time whale activity from Discord channels for Solana tokens.

**Endpoint:** `GET /api/discord-whale-activity`

**Query Parameters:**
- `limit` (optional): Number of transactions to return (default: 50)
- `token` (optional): Filter by specific Solana token symbol
- `hours` (optional): Time range in hours (default: 24)

**Response Example:**
\`\`\`json
{
  "transactions": [
    {
      "id": "unique-transaction-id",
      "whaleName": "Moby AI",
      "token": "BONK",
      "buyAmount": 2740,
      "marketCap": 872170,
      "winRate": 85.5,
      "biggestWin": 15000,
      "timestamp": "2024-01-15T10:30:00Z",
      "tokenCA": "SOLANA_CONTRACT_ADDRESS",
      "blockchain": "solana"
    }
  ],
  "mostTradedToken": {
    "symbol": "BONK",
    "count": 15,
    "totalVolume": 45000
  },
  "total": 150
}
\`\`\`

![Whale Activity Data Structure](/placeholder.svg?height=350&width=900&text=Whale+Activity+Data+Structure+with+Metrics+and+Filtering)

### Discord Webhook Data Flow

\`\`\`mermaid title="Discord Webhook Processing" type="diagram"
graph LR
    A["Discord Channel"] --> B["Webhook Trigger"]
    B --> C["Message Validation"]
    C --> D["Data Extraction"]
    D --> E["Database Storage"]
    E --> F["Real-time Updates"]
    
    G["Filtering Logic"] --> H["Token Specific"]
    G --> I["Time Range"]
    G --> J["Whale Metrics"]
    
    H --> F
    I --> F
    J --> F
\`\`\`

### Discord Webhook
Receives whale activity alerts from Discord for Solana transactions.

**Endpoint:** `POST /api/discord-webhook`

**Headers:**
\`\`\`
X-Webhook-Secret: WEBHOOK_SECRET
\`\`\`

**Request Body:**
\`\`\`json
{
  "content": "Solana whale alert message from Discord",
  "timestamp": "2024-01-15T10:30:00Z",
  "channel": "solana-whale-alerts"
}
\`\`\`

## Market Data APIs

### Trending Coins
Retrieves trending Solana cryptocurrency data.

**Endpoint:** `GET /api/trending-coins`

**Query Parameters:**
- `limit` (optional): Number of coins to return (default: 20)
- `timeframe` (optional): Time period for trending calculation
- `blockchain` (optional): Always "solana" for this platform

**Response Example:**
\`\`\`json
{
  "coins": [
    {
      "symbol": "SOL",
      "name": "Solana",
      "price": 45.50,
      "change24h": 2.5,
      "volume24h": 250000000,
      "marketCap": 18500000000,
      "blockchain": "solana"
    }
  ],
  "lastUpdated": "2024-01-15T10:30:00Z",
  "blockchain": "solana"
}
\`\`\`

### Token Search
Search for Solana tokens by name, symbol, or contract address.

**Endpoint:** `GET /api/search-tokens`

**Query Parameters:**
- `q`: Search query (required)
- `limit` (optional): Number of results to return (default: 10)

**Response Example:**
\`\`\`json
{
  "results": [
    {
      "symbol": "SOL",
      "name": "Solana",
      "contractAddress": "So11111111111111111111111111111111111111112",
      "price": 45.50,
      "marketCap": 18500000000,
      "blockchain": "solana"
    }
  ],
  "total": 1,
  "blockchain": "solana"
}
\`\`\`

## Wallet Management APIs

### Wallet Information
Retrieves comprehensive Solana wallet information and analysis.

**Endpoint:** `GET /api/wallet-info?address={wallet_address}`

**Response Example:**
\`\`\`json
{
  "address": "SOLANA_WALLET_ADDRESS",
  "balance": 1.5,
  "tokens": [
    {
      "symbol": "SOL",
      "balance": 1.5,
      "value": 68.25,
      "contractAddress": "So11111111111111111111111111111111111111112"
    }
  ],
  "transactions": [
    {
      "signature": "SOLANA_TRANSACTION_SIGNATURE",
      "type": "transfer",
      "amount": 0.1,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "totalValue": 68.25,
  "blockchain": "solana"
}
\`\`\`

## Narrative & Storage APIs

### Store Analysis Narrative
Stores AI-generated analysis narratives for Solana tokens.

**Endpoint:** `POST /api/store-narrative`

**Request Body:**
\`\`\`json
{
  "tokenAddress": "SOLANA_CONTRACT_ADDRESS",
  "narrative": "AI-generated analysis narrative for Solana token",
  "riskScore": 7.5,
  "blockchain": "solana",
  "metadata": {
    "analysisDate": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}
\`\`\`

### Get Stored Narratives
Retrieves previously stored analysis narratives for Solana tokens.

**Endpoint:** `GET /api/get-narratives`

**Query Parameters:**
- `tokenAddress` (optional): Filter by specific Solana token address
- `limit` (optional): Number of narratives to return
- `offset` (optional): Pagination offset

**Response Example:**
\`\`\`json
{
  "narratives": [
    {
      "id": "narrative-id",
      "tokenAddress": "SOLANA_CONTRACT_ADDRESS",
      "narrative": "Stored analysis narrative for Solana token",
      "riskScore": 7.5,
      "blockchain": "solana",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 25
}
\`\`\`

## Sentiment Analysis APIs

### X/Twitter Sentiment
Analyzes sentiment from X/Twitter for specific Solana tokens.

**Endpoint:** `POST /api/x-sentiment`

**Request Body:**
\`\`\`json
{
  "token": "SOL",
  "timeframe": "24h",
  "includeMetrics": true,
  "blockchain": "solana"
}
\`\`\`

**Response Example:**
\`\`\`json
{
  "token": "SOL",
  "blockchain": "solana",
  "sentiment": {
    "score": 0.75,
    "label": "positive",
    "confidence": 0.85
  },
  "metrics": {
    "totalMentions": 1500,
    "positiveRatio": 0.65,
    "negativeRatio": 0.20,
    "neutralRatio": 0.15
  },
  "trends": [
    {
      "timestamp": "2024-01-15T10:00:00Z",
      "score": 0.70
    }
  ]
}
\`\`\`

## Testing & Debug APIs

### Test OpenAI Connection
Tests the OpenAI API connection and functionality.

**Endpoint:** `GET /api/test-openai`

**Response Example:**
\`\`\`json
{
  "status": "success",
  "message": "OpenAI connection successful",
  "model": "gpt-4",
  "responseTime": 1250,
  "solanaCapable": true
}
\`\`\`

### Environment Check
Checks the status of environment variables and configurations.

**Endpoint:** `GET /api/check-env`

**Response Example:**
\`\`\`json
{
  "status": "healthy",
  "services": {
    "openai": "connected",
    "supabase": "connected",
    "discord": "connected",
    "solscan": "connected",
    "birdeye": "connected",
    "dexscreener": "connected"
  },
  "environment": "production",
  "blockchain": "solana"
}
\`\`\`

## Data Integration Flow

\`\`\`mermaid title="External API Integration" type="diagram"
graph TB
    A["LyxAI API Request"] --> B["Data Source Router"]
    B --> C["DexScreener API"]
    B --> D["Birdeye API"]
    B --> E["Solscan API"]
    
    C --> F["DEX Data"]
    D --> G["Market Data"]
    E --> H["Blockchain Data"]
    
    F --> I["Data Aggregation"]
    G --> I
    H --> I
    
    I --> J["Response Formatting"]
    J --> K["Client Response"]
\`\`\`

## Error Handling

![Error Response Structure](/placeholder.svg?height=300&width=600&text=API+Error+Response+Structure+with+Error+Codes)

### Error Code Classification

\`\`\`mermaid title="Error Code Classification" type="diagram"
graph TD
    A["API Errors"] --> B["Client Errors (4xx)"]
    A --> C["Server Errors (5xx)"]
    
    B --> D["INVALID_SOLANA_ADDRESS"]
    B --> E["RATE_LIMIT_EXCEEDED"]
    B --> F["AUTHENTICATION_FAILED"]
    
    C --> G["SERVICE_UNAVAILABLE"]
    C --> H["INSUFFICIENT_DATA"]
    C --> I["INTERNAL_ERROR"]
\`\`\`

All API endpoints return consistent error responses:

\`\`\`json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z",
  "blockchain": "solana"
}
\`\`\`

### Common Error Codes
- `INVALID_SOLANA_ADDRESS`: Invalid Solana contract or wallet address
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INSUFFICIENT_DATA`: Not enough data for analysis
- `SERVICE_UNAVAILABLE`: External service temporarily unavailable
- `AUTHENTICATION_FAILED`: Invalid or missing API key
- `UNSUPPORTED_BLOCKCHAIN`: Only Solana blockchain is supported

## Rate Limits

- **General APIs**: 100 requests per minute
- **Analysis APIs**: 20 requests per minute
- **Chat APIs**: 50 requests per minute
- **Whale Activity**: 200 requests per minute

Rate limit headers are included in all responses:
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
\`\`\`

## Webhooks

### Discord Webhook Configuration
To receive Solana whale activity alerts, configure your Discord webhook:

1. Set up webhook URL: `https://your-domain.com/api/discord-webhook`
2. Include secret header: `X-Webhook-Secret: YOUR_SECRET`
3. Configure Discord channel to send Solana whale alerts to your webhook

### Webhook Payload Format
\`\`\`json
{
  "type": "solana_whale_alert",
  "data": {
    "whaleName": "Whale Name",
    "token": "TOKEN_SYMBOL",
    "buyAmount": 5000,
    "marketCap": 1000000,
    "timestamp": "2024-01-15T10:30:00Z",
    "blockchain": "solana",
    "contractAddress": "SOLANA_CONTRACT_ADDRESS"
  }
}
\`\`\`

## Solana-Specific Features

### Supported Data Sources
- **Solscan API**: Comprehensive Solana blockchain data
- **Birdeye API**: Solana token market data and analytics
- **DexScreener**: Solana DEX trading data
- **Jupiter**: Solana token aggregation data

### Solana Address Validation
All endpoints automatically validate Solana addresses and return appropriate error messages for invalid formats.

### Network Support
LyxAI currently supports:
- **Mainnet**: Primary Solana network
- **Devnet**: Development network (for testing)

This comprehensive API reference covers all the major functionalities of the LyxAI platform, providing developers with everything needed to integrate with our Solana-focused services.
