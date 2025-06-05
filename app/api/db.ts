// Simulated database for token data
export interface TokenData {
  id: string
  name: string
  symbol: string
  address: string
  marketCap?: number
  price?: number
  volume24h?: number
  priceChange24h?: number
  createdAt: string
  isVerified: boolean
  socials?: {
    website?: string
    twitter?: string
    telegram?: string
    discord?: string
  }
  description?: string
}

// Sample token data
const tokens: Record<string, TokenData> = {
  "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp": {
    id: "1",
    name: "Solana",
    symbol: "SOL",
    address: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
    marketCap: 28500000000,
    price: 64.25,
    volume24h: 1250000000,
    priceChange24h: 3.5,
    createdAt: "2020-03-16T00:00:00Z",
    isVerified: true,
    socials: {
      website: "https://solana.com",
      twitter: "solana",
      telegram: "solana",
      discord: "solana",
    },
    description:
      "Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today.",
  },
  "7xKXtg2CW87d97TXJSDpbD5jBkheTqA": {
    id: "2",
    name: "Bonk",
    symbol: "BONK",
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA",
    marketCap: 580000000,
    price: 0.00001234,
    volume24h: 25000000,
    priceChange24h: -2.1,
    createdAt: "2022-12-25T00:00:00Z",
    isVerified: true,
    socials: {
      website: "https://bonkcoin.com",
      twitter: "bonk_inu",
      telegram: "bonktoken",
    },
    description: "BONK is the first Solana dog coin for the people, by the people.",
  },
  "9ey7LZzWFsJNnXwPFLH7GbcbEjGP3vM": {
    id: "3",
    name: "Raydium",
    symbol: "RAY",
    address: "9ey7LZzWFsJNnXwPFLH7GbcbEjGP3vM",
    marketCap: 320000000,
    price: 1.85,
    volume24h: 45000000,
    priceChange24h: 1.2,
    createdAt: "2021-02-21T00:00:00Z",
    isVerified: true,
    socials: {
      website: "https://raydium.io",
      twitter: "raydiumprotocol",
      telegram: "raydiumprotocol",
      discord: "raydium",
    },
    description:
      "Raydium is an automated market maker (AMM) built on the Solana blockchain which leverages the central order book of the Serum DEX.",
  },
}

// Social data for tokens
export interface SocialData {
  trendScore: number
  recentPosts: number
  estimatedMentions: number
  hashtags: string[]
  isEstimated: boolean
}

const socialData: Record<string, SocialData> = {
  "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp": {
    trendScore: 92,
    recentPosts: 1250,
    estimatedMentions: 8500,
    hashtags: ["crypto", "solana", "sol", "blockchain", "defi"],
    isEstimated: false,
  },
  "7xKXtg2CW87d97TXJSDpbD5jBkheTqA": {
    trendScore: 78,
    recentPosts: 850,
    estimatedMentions: 4200,
    hashtags: ["memecoin", "bonk", "solana", "dogecoin", "crypto"],
    isEstimated: false,
  },
  "9ey7LZzWFsJNnXwPFLH7GbcbEjGP3vM": {
    trendScore: 65,
    recentPosts: 320,
    estimatedMentions: 1800,
    hashtags: ["defi", "raydium", "solana", "amm", "swap"],
    isEstimated: false,
  },
}

// Database operations
export const db = {
  // Token operations
  tokens: {
    getAll: () => Object.values(tokens),
    getByAddress: (address: string) => tokens[address] || null,
    search: (query: string) => {
      const lowerQuery = query.toLowerCase()
      return Object.values(tokens).filter(
        (token) =>
          token.name.toLowerCase().includes(lowerQuery) ||
          token.symbol.toLowerCase().includes(lowerQuery) ||
          token.address.toLowerCase().includes(lowerQuery),
      )
    },
  },

  // Social data operations
  social: {
    getByAddress: (address: string) => socialData[address] || null,
  },

  // Chat operations
  chat: {
    generateResponse: async (message: string) => {
      // In a real implementation, this would call an AI service
      // For this example, we'll return predefined responses based on keywords

      const lowerMessage = message.toLowerCase()

      if (lowerMessage.includes("wallet") || lowerMessage.includes("address")) {
        return "You can look up a Solana wallet address using blockchain explorers like Solscan, Solana Explorer, or Solana FM. Simply paste the wallet address into the search bar of any of these explorers to view transaction history, token holdings, and other details."
      }

      if (lowerMessage.includes("token") || lowerMessage.includes("coin")) {
        return "To analyze a token on Solana, you can use the LyxAI Token Analyzer. Enter the token address or symbol to get detailed information about market cap, social activity, and other metrics. You can also use blockchain explorers like Solscan to view basic token information."
      }

      if (lowerMessage.includes("transaction") || lowerMessage.includes("tx")) {
        return "To track a transaction on Solana, copy the transaction signature (a long string of characters) and paste it into a blockchain explorer like Solscan or Solana Explorer. This will show you the status, timestamp, block, fee, and all accounts involved in the transaction."
      }

      // Default response
      return "I'm LyxAI, an AI assistant specialized in the Solana blockchain ecosystem. I can help you find and analyze wallets, tokens, and transactions on Solana. What would you like to know about?"
    },
  },
}
