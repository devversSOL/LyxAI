"use server"

import { walletService } from "@/lib/wallet-service"

// Update the TokenData interface to remove sentiment fields
interface TokenData {
  name?: string
  symbol?: string
  image?: string
  address: string
  decimals?: number
  marketCap?: number
  pairId?: string
  socials?: {
    twitter?: string
    telegram?: string
    discord?: string
    website?: string
  }
  isVerified?: boolean
  dexScreenerData?: any
  createdAt?: string
}

// Update the AddressTypeResult interface to include last traded coins
interface AddressTypeResult {
  type: "wallet" | "contract" | "unknown"
  winRate?: string
  roi?: string
  totalTrades?: number
  profitableTrades?: number
  lastTradedCoins?: Array<{
    symbol: string
    name?: string
    time?: string
    profit?: string
    isWin?: boolean
  }>
}

// Update the TwitterApiResponse interface to remove sentiment fields
interface TwitterApiResponse {
  data?: any[]
  meta?: {
    result_count?: number
    newest_id?: string
    oldest_id?: string
    next_token?: string
  }
  errors?: any[]
}

// Update the TwitterData interface to remove sentiment field
interface TwitterData {
  tweetCount: number
  recentTweets: any[]
  hashtags: string[]
  trendScore: number
  firstMentionDate?: string
}

// Helper function to extract Solana addresses from text
function extractSolanaAddresses(text: string): string[] {
  // Solana addresses are base58 encoded and typically 32-44 characters
  const regex = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/g
  return [...new Set(text.match(regex) || [])]
}

// Helper function to check if a string is likely a valid Solana address
function isValidSolanaAddress(address: string): boolean {
  // Basic validation - Solana addresses are base58 encoded
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
}

// Function to get wallet info from the new endpoint
async function getWalletInfoFromEndpoint(address: string): Promise<any> {
  try {
    console.log("🔍 Fetching wallet info from new endpoint:", address)

    const response = await fetch(`https://web-production-6abd3.up.railway.app/wallet-info/${address}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    console.log(`Wallet info endpoint response status: ${response.status}`)

    if (!response.ok) {
      console.error(`Wallet info endpoint error: ${response.status}`)
      return null
    }

    const data = await response.json()
    console.log("Wallet info response:", JSON.stringify(data).substring(0, 500) + "...")

    return data
  } catch (error) {
    console.error("❌ Error fetching wallet info from endpoint:", error)
    return null
  }
}

// Function to check if an address is a wallet or token using Helius API
async function checkAddressTypeWithHelius(address: string): Promise<{ isWallet: boolean; isToken: boolean }> {
  try {
    console.log("🔍 Checking address type with Helius API:", address)

    // Use Helius API with API key
    const heliusApiKey = "285490fd-6829-4bf2-a2d2-81013eab2818"
    const heliusUrl = `https://api.helius.xyz/v0/addresses/${address}/tokens?api-key=${heliusApiKey}`

    // First, try the Helius tokens endpoint
    const response = await fetch(heliusUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    console.log(`Helius API response status: ${response.status}`)

    if (response.ok) {
      const data = await response.json()

      // If this is a token mint address, the response will be empty or have an error
      if (data.error || (Array.isArray(data) && data.length === 0)) {
        // Try the mint info endpoint to check if it's a token
        const mintInfoUrl = `https://api.helius.xyz/v0/tokens/metadata?api-key=${heliusApiKey}`
        const mintResponse = await fetch(mintInfoUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mintAccounts: [address] }),
          cache: "no-store",
        })

        if (mintResponse.ok) {
          const mintData = await mintResponse.json()

          // If we get valid token metadata, it's a token/contract
          if (Array.isArray(mintData) && mintData.length > 0 && mintData[0].onChainMetadata) {
            console.log("✅ Address is a token/coin (mint)")
            return { isWallet: false, isToken: true }
          }
        }
      }

      // If we have token holdings, it's a wallet
      if (Array.isArray(data) && data.length >= 0) {
        console.log("✅ Address has token holdings or is a valid wallet, confirmed as wallet")
        return { isWallet: true, isToken: false }
      }
    }

    // If Helius tokens endpoint didn't give us a clear answer, try the RPC method
    console.log("Trying Helius RPC method...")
    const rpcUrl = "https://mainnet.helius-rpc.com/?api-key=285490fd-6829-4bf2-a2d2-81013eab2818"

    const rpcResponse = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAccountInfo",
        params: [address, { encoding: "jsonParsed" }],
      }),
      cache: "no-store",
    })

    const rpcData = await rpcResponse.json()

    // Check if we have a valid response
    if (rpcData.result && rpcData.result.value) {
      // Check the account type
      const accountType =
        rpcData.result.value.data?.program === "spl-token" ? rpcData.result.value.data?.parsed?.type : null

      console.log("Account type from Helius RPC:", accountType)

      if (accountType === "mint") {
        // It's a token/coin
        console.log("✅ Address is a token/coin (mint) from RPC check")
        return { isWallet: false, isToken: true }
      } else if (accountType === "account" || !accountType) {
        // It's a wallet or another type of account
        console.log("✅ Address is a wallet (account) from RPC check")
        return { isWallet: true, isToken: false }
      }
    }

    // Default to assuming it's a wallet if we can't determine
    console.log("⚠️ Could not determine address type, defaulting to wallet")
    return { isWallet: true, isToken: false }
  } catch (error) {
    console.error("❌ Error checking address type with Helius:", error)
    // Default to assuming it's a wallet if there's an error
    return { isWallet: true, isToken: false }
  }
}

// Export the original checkAddressType function to maintain compatibility
export async function checkAddressType(address: string): Promise<AddressTypeResult> {
  try {
    console.log("Checking if address is a wallet or contract using Helius API...")

    // Use Helius API with updated endpoint and API key
    const heliusApiKey = "285490fd-6829-4bf2-a2d2-81013eab2818" // Consider moving this to environment variables
    const heliusUrl = `https://api.helius.xyz/v0/addresses/${address}/tokens?api-key=${heliusApiKey}`

    // First, try the new Helius tokens endpoint
    const response = await fetch(heliusUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    // Log the response status for debugging
    console.log(`Helius API response status: ${response.status}`)

    if (response.ok) {
      const data = await response.json()
      console.log("Helius API response:", JSON.stringify(data).substring(0, 500) + "...")

      // If this is a token mint address, the response will be empty or have an error
      if (data.error || (Array.isArray(data) && data.length === 0)) {
        // Try the mint info endpoint to check if it's a token
        const mintInfoUrl = `https://api.helius.xyz/v0/tokens/metadata?api-key=${heliusApiKey}`
        const mintResponse = await fetch(mintInfoUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mintAccounts: [address],
          }),
          cache: "no-store",
        })

        if (mintResponse.ok) {
          const mintData = await mintResponse.json()
          console.log("Helius mint info response:", JSON.stringify(mintData).substring(0, 500) + "...")

          // If we get valid token metadata, it's a token/contract
          if (Array.isArray(mintData) && mintData.length > 0 && mintData[0].onChainMetadata) {
            console.log("Address is a token/coin (mint)")
            return { type: "contract" }
          }
        }
      }

      // If we have token holdings, it's a wallet
      if (Array.isArray(data) && data.length > 0) {
        console.log("Address has token holdings, likely a wallet")

        // Try to get wallet data from gmgn.ai
        try {
          const walletData = await getWalletDataFromGmgn(address)
          return walletData
        } catch (error) {
          console.error("Error getting wallet data from gmgn.ai:", error)
          // Return basic wallet info if gmgn.ai fails
          return {
            type: "wallet",
            winRate: "Unknown",
            roi: "Unknown",
          }
        }
      }
    }

    // If Helius tokens endpoint didn't give us a clear answer, try the RPC method
    console.log("Trying Helius RPC method...")
    const rpcUrl = "https://mainnet.helius-rpc.com/?api-key=285490fd-6829-4bf2-a2d2-81013eab2818"

    const rpcResponse = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAccountInfo",
        params: [address, { encoding: "jsonParsed" }],
      }),
      cache: "no-store",
    })

    const rpcData = await rpcResponse.json()
    console.log("Helius RPC response:", JSON.stringify(rpcData).substring(0, 500) + "...")

    // Check if we have a valid response
    if (rpcData.result && rpcData.result.value) {
      // Check the account type
      const accountType =
        rpcData.result.value.data?.program === "spl-token" ? rpcData.result.value.data?.parsed?.type : null

      console.log("Account type from Helius RPC:", accountType)

      if (accountType === "mint") {
        // It's a token/coin
        console.log("Address is a token/coin (mint)")
        return { type: "contract" }
      } else if (accountType === "account" || !accountType) {
        // It's a wallet or another type of account
        console.log("Address is a wallet (account)")

        // Try to get wallet data from gmgn.ai
        try {
          const walletData = await getWalletDataFromGmgn(address)
          return walletData
        } catch (error) {
          console.error("Error getting wallet data from gmgn.ai:", error)
          // Return basic wallet info if gmgn.ai fails
          return {
            type: "wallet",
            winRate: "Unknown",
            roi: "Unknown",
          }
        }
      }
    }

    // If we couldn't determine from Helius, fall back to our existing method
    console.log("Couldn't determine account type from Helius, falling back to gmgn.ai check...")
    return fallbackCheckAddressType(address)
  } catch (error) {
    console.error("Error checking address type with Helius:", error)
    // Fall back to our existing method
    return fallbackCheckAddressType(address)
  }
}

// Function to get wallet data from gmgn.ai
async function getWalletDataFromGmgn(address: string): Promise<AddressTypeResult> {
  try {
    console.log("Getting wallet data from gmgn.ai...")
    const gmgnUrl = `https://gmgn.ai/sol/address/${address}`

    const response = await fetch(gmgnUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    })

    // Log the response status for debugging
    console.log(`gmgn.ai response status: ${response.status}`)

    if (!response.ok) {
      console.log("GMGN.ai returned non-OK status:", response.status)
      return {
        type: "wallet",
        winRate: "Unknown",
        roi: "Unknown",
      }
    }

    // Get the HTML content
    const html = await response.text()

    // Log a small sample of the HTML for debugging
    console.log("GMGN.ai HTML sample:", html.substring(0, 500))

    // Check if the page is a login page or contains login elements
    const isLoginPage =
      html.includes("Connect Telegram") ||
      html.includes("Connect Phantom") ||
      html.includes("APP Scan Code Login") ||
      html.includes("Fast Trade, Fast Copy Trade") ||
      html.includes("login") ||
      html.includes("Login") ||
      html.includes("sign in") ||
      html.includes("Sign In")

    // If it's a login page, this is a valid wallet address
    if (isLoginPage) {
      console.log("Found login page for wallet address")
      return {
        type: "wallet",
        winRate: "Login required",
        roi: "Login required",
        lastTradedCoins: [{ symbol: "Login required to view trades", isWin: false }],
      }
    }

    // Check if the page contains any wallet-specific content
    const hasWalletContent =
      html.includes("WR") ||
      html.includes("Win Rate") ||
      html.includes("ROI") ||
      html.includes("Trades") ||
      html.includes("Profitable") ||
      html.includes("trading") ||
      html.includes("Trading") ||
      html.includes("wallet") ||
      html.includes("Wallet")

    if (!hasWalletContent) {
      console.log("No wallet content found, might be a contract or token")
      return { type: "contract" }
    }

    // Extract win rate and ROI if possible
    let winRate = "Unknown"
    let roi = "Unknown"
    let totalTrades = 0
    let profitableTrades = 0
    const lastTradedCoins: Array<{
      symbol: string
      name?: string
      time?: string
      profit?: string
      isWin?: boolean
    }> = []

    // Try multiple patterns for Win Rate
    const wrPatterns = [
      /WR[:\s]+([0-9.]+%)/i,
      /Win Rate[:\s]+([0-9.]+%)/i,
      /Win Rate<\/div><div[^>]*>([0-9.]+%)/i,
      /"Win Rate"[^>]*>([0-9.]+%)/i,
      /data-win-rate="([0-9.]+)"/i,
    ]

    for (const pattern of wrPatterns) {
      const wrMatch = html.match(pattern)
      if (wrMatch && wrMatch[1]) {
        winRate = wrMatch[1]
        console.log(`Extracted Win Rate: ${winRate}`)
        break
      }
    }

    // Try multiple patterns for ROI
    const roiPatterns = [
      /ROI[:\s]+([-+]?[0-9.]+%)/i,
      /ROI<\/div><div[^>]*>([-+]?[0-9.]+%)/i,
      /"ROI"[^>]*>([-+]?[0-9.]+%)/i,
      /data-roi="([-+]?[0-9.]+)"/i,
    ]

    for (const pattern of roiPatterns) {
      const roiMatch = html.match(pattern)
      if (roiMatch && roiMatch[1]) {
        roi = roiMatch[1]
        console.log(`Extracted ROI: ${roi}`)
        break
      }
    }

    // Try multiple patterns for total trades
    const tradesPatterns = [
      /Trades[:\s]+([0-9]+)/i,
      /Trades<\/div><div[^>]*>([0-9]+)/i,
      /"Trades"[^>]*>([0-9]+)/i,
      /data-trades="([0-9]+)"/i,
    ]

    for (const pattern of tradesPatterns) {
      const tradesMatch = html.match(pattern)
      if (tradesMatch && tradesMatch[1]) {
        totalTrades = Number.parseInt(tradesMatch[1], 10)
        console.log(`Extracted Total Trades: ${totalTrades}`)
        break
      }
    }

    // Try multiple patterns for profitable trades
    const profitablePatterns = [
      /Profitable[:\s]+([0-9]+)/i,
      /Profitable<\/div><div[^>]*>([0-9]+)/i,
      /"Profitable"[^>]*>([0-9]+)/i,
      /data-profitable="([0-9]+)"/i,
    ]

    for (const pattern of profitablePatterns) {
      const profitableMatch = html.match(pattern)
      if (profitableMatch && profitableMatch[1]) {
        profitableTrades = Number.parseInt(profitableMatch[1], 10)
        console.log(`Extracted Profitable Trades: ${profitableTrades}`)
        break
      }
    }

    // Try to extract traded coins using different patterns
    // First try table rows
    let coinRows = html.match(/<tr[^>]*>[\s\S]*?<td[^>]*>[\s\S]*?<\/td>[\s\S]*?<\/tr>/g) || []

    // If no table rows found, try div-based layouts
    if (coinRows.length === 0) {
      coinRows =
        html.match(/<div[^>]*class="[^"]*coin-row[^"]*"[^>]*>[\s\S]*?<\/div>/g) ||
        html.match(/<div[^>]*class="[^"]*trade-item[^"]*"[^>]*>[\s\S]*?<\/div>/g) ||
        html.match(/<div[^>]*class="[^"]*trading-history-item[^"]*"[^>]*>[\s\S]*?<\/div>/g) ||
        []
    }

    console.log(`Found ${coinRows.length} potential coin rows`)

    // Process up to 4 coin rows
    for (let i = 0; i < Math.min(coinRows.length, 8); i++) {
      const row = coinRows[i]

      // Try multiple patterns for coin symbol
      const symbolPatterns = [
        />([A-Z0-9]{2,10})</,
        />\$([A-Z0-9]{2,10})</,
        /data-symbol="([A-Z0-9]{2,10})"/,
        /class="[^"]*symbol[^"]*"[^>]*>([A-Z0-9]{2,10})</,
      ]

      let symbol = null
      for (const pattern of symbolPatterns) {
        const symbolMatch = row.match(pattern)
        if (symbolMatch && symbolMatch[1]) {
          symbol = symbolMatch[1]
          break
        }
      }

      if (symbol) {
        console.log(`Found coin: ${symbol}`)

        // Extract other data if available using multiple patterns
        let name = undefined
        const namePatterns = [/data-name="([^"]+)"/, /class="[^"]*name[^"]*"[^>]*>([^<]+)</]
        for (const pattern of namePatterns) {
          const nameMatch = row.match(pattern)
          if (nameMatch && nameMatch[1]) {
            name = nameMatch[1].trim()
            break
          }
        }

        let time = undefined
        const timePatterns = [
          /(\d{1,2}:\d{2}(am|pm)|today|yesterday|\d{1,2}\/\d{1,2}\/\d{2,4})/i,
          /class="[^"]*time[^"]*"[^>]*>([^<]+)</,
        ]
        for (const pattern of timePatterns) {
          const timeMatch = row.match(pattern)
          if (timeMatch && timeMatch[1]) {
            time = timeMatch[1].trim()
            break
          }
        }

        let profit = undefined
        const profitPatterns = [/([-+][0-9.]+%)/, /class="[^"]*profit[^"]*"[^>]*>([-+][0-9.]+%)</]
        for (const pattern of profitPatterns) {
          const profitMatch = row.match(pattern)
          if (profitMatch && profitMatch[1]) {
            profit = profitMatch[1].trim()
            break
          }
        }

        const isWin =
          row.includes("text-green") ||
          row.includes("positive") ||
          row.includes("profit-positive") ||
          (profit && profit.startsWith("+"))

        lastTradedCoins.push({
          symbol,
          name,
          time,
          profit,
          isWin,
        })

        // If we have 4 coins, break
        if (lastTradedCoins.length >= 4) break
      }
    }

    // If we found any wallet data, return it
    if (winRate !== "Unknown" || roi !== "Unknown" || totalTrades > 0 || lastTradedCoins.length > 0) {
      return {
        type: "wallet",
        winRate,
        roi,
        totalTrades: totalTrades || undefined,
        profitableTrades: profitableTrades || undefined,
        lastTradedCoins: lastTradedCoins.length > 0 ? lastTradedCoins : undefined,
      }
    }

    // Default to returning basic wallet info
    return {
      type: "wallet",
      winRate: "Unknown",
      roi: "Unknown",
    }
  } catch (error) {
    console.error("Error getting wallet data from gmgn.ai:", error)
    return {
      type: "wallet",
      winRate: "Unknown",
      roi: "Unknown",
    }
  }
}

// Fallback method to check address type (our original method)
async function fallbackCheckAddressType(address: string): Promise<AddressTypeResult> {
  try {
    console.log("Using fallback method to check address type...")

    // Try to fetch data from gmgn.ai
    const gmgnUrl = `https://gmgn.ai/sol/address/${address}`

    try {
      console.log(`Fetching from gmgn.ai: ${gmgnUrl}`)

      // Make a direct GET request with additional headers
      const response = await fetch(gmgnUrl, {
        method: "GET",
        cache: "no-store",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
      })

      // Log the response status for debugging
      console.log(`gmgn.ai response status: ${response.status}`)

      if (!response.ok) {
        console.log("GMGN.ai returned non-OK status, likely not a wallet:", response.status)
        return { type: "contract" }
      }

      // Get the HTML content
      const html = await response.text()

      // Log a small sample of the HTML for debugging
      console.log("GMGN.ai HTML sample:", html.substring(0, 500))

      // Check if the page is a login page or contains login elements
      const isLoginPage =
        html.includes("Connect Telegram") ||
        html.includes("Connect Phantom") ||
        html.includes("APP Scan Code Login") ||
        html.includes("Fast Trade, Fast Copy Trade") ||
        html.includes("login") ||
        html.includes("Login") ||
        html.includes("sign in") ||
        html.includes("Sign In")

      // If it's a login page, this is a valid wallet address
      if (isLoginPage) {
        console.log("Found login page for wallet address")
        return {
          type: "wallet",
          winRate: "Login required",
          roi: "Login required",
          lastTradedCoins: [{ symbol: "Login required to view trades", isWin: false }],
        }
      }

      // Check if the page contains any wallet-specific content
      const hasWalletContent =
        html.includes("WR") ||
        html.includes("Win Rate") ||
        html.includes("ROI") ||
        html.includes("Trades") ||
        html.includes("Profitable") ||
        html.includes("trading") ||
        html.includes("Trading") ||
        html.includes("wallet") ||
        html.includes("Wallet")

      // If we found wallet content, it's likely a wallet
      if (hasWalletContent) {
        console.log("Found trading metrics, address is a wallet")
        return await getWalletDataFromGmgn(address)
      }

      // If we got here, the page exists but doesn't have trading data
      console.log("Page exists but no trading metrics found")
      return { type: "contract" }
    } catch (error) {
      console.error("Error fetching from gmgn.ai:", error)
      // If there's an error with gmgn.ai, we'll proceed with token analysis
      return { type: "unknown" }
    }
  } catch (error) {
    console.error("Error in fallback check:", error)
    // Default to unknown if we can't determine
    return { type: "unknown" }
  }
}

// Function to safely convert IPFS URLs to placeholder images
function convertIpfsUrl(url: string | null): string | null {
  if (!url) return null

  // Check if it's an IPFS URL
  if (url.startsWith("ipfs://")) {
    // Extract the CID (Content Identifier)
    const cid = url.replace("ipfs://", "")

    // Generate a placeholder image with the CID as part of the query
    return `/placeholder.svg?height=100&width=100&query=Token_${cid.substring(0, 8)}`
  }

  // If the URL already contains ipfs.io or other problematic gateways, replace with placeholder
  if (url.includes("/ipfs/")) {
    const parts = url.split("/ipfs/")
    if (parts.length > 1) {
      const cid = parts[1].split("/")[0]
      return `/placeholder.svg?height=100&width=100&query=Token_${cid.substring(0, 8)}`
    }
  }

  return url
}

// Update the fetchTokenData function to correctly extract data from the DexScreener API response
export async function fetchTokenData(address: string) {
  try {
    console.log("Fetching token data from DexScreener...")

    // Fetch token data from DexScreener API using the correct endpoint
    const dexScreenerUrl = `https://api.dexscreener.com/latest/dex/tokens/${address}`

    const response = await fetch(dexScreenerUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`DexScreener API returned status: ${response.status}`)
      return {
        success: false,
        error: `DexScreener API error: ${response.status}`,
        details: await response.text(),
      }
    }

    const data = await response.json()
    console.log("DexScreener response:", JSON.stringify(data).substring(0, 200) + "...")

    // Check if we have valid data
    if (data && data.pairs && data.pairs.length > 0) {
      const tokenData = data.pairs[0]

      // Log the full token data to see the structure
      console.log("Token data structure:", JSON.stringify(tokenData, null, 2))

      // Extract the specific fields we want
      const formattedTokenData: TokenData = {
        name: tokenData.baseToken?.name || "Unknown Token",
        symbol: tokenData.baseToken?.symbol || "???",
        address: address,
        // Only use image URLs directly provided in the API response
        image: tokenData.baseToken?.logoURI || null,
        isVerified: true, // If it's in DexScreener, it's somewhat verified
        socials: {
          website: null,
          twitter: null,
        },
        // Try to get creation date from the pair data
        createdAt: tokenData.pairCreatedAt || null,
        // Add the pairId from the response
        pairId: tokenData.pairAddress || null,
      }

      // Extract social links from the info object if available
      if (tokenData.info) {
        // Log the info object to see its structure
        console.log("Token info object:", JSON.stringify(tokenData.info, null, 2))

        // Extract image URL if available
        if (tokenData.info.imageUrl) {
          formattedTokenData.image = tokenData.info.imageUrl
          console.log("Found image URL in info object:", tokenData.info.imageUrl)
        }

        // Extract website if available
        if (tokenData.info.websites && tokenData.info.websites.length > 0) {
          formattedTokenData.socials.website = tokenData.info.websites[0]
          console.log("Found website in info object:", tokenData.info.websites[0])
        }

        // Extract Twitter if available
        if (tokenData.info.socials && tokenData.info.socials.length > 0) {
          const twitterSocial = tokenData.info.socials.find((social) => social.type === "twitter")
          if (twitterSocial && twitterSocial.url) {
            // Extract the Twitter handle from the URL
            const twitterUrl = twitterSocial.url
            const twitterHandle = twitterUrl.split("/").pop()
            formattedTokenData.socials.twitter = twitterHandle
            console.log("Found Twitter in info object:", twitterHandle)
          }
        }
      }

      // Fallback to links object if info object doesn't have social data
      if (!formattedTokenData.socials.website && tokenData.baseToken?.links?.website) {
        formattedTokenData.socials.website = tokenData.baseToken.links.website
        console.log("Using website from links object:", tokenData.baseToken.links.website)
      }

      if (!formattedTokenData.socials.twitter && tokenData.baseToken?.links?.twitter) {
        formattedTokenData.socials.twitter = tokenData.baseToken.links.twitter
        console.log("Using Twitter from links object:", tokenData.baseToken.links.twitter)
      }

      // Extract market cap if available
      if (tokenData.marketCap) {
        formattedTokenData.marketCap = Number.parseFloat(tokenData.marketCap)
      }

      console.log("Successfully fetched token data from DexScreener")
      console.log("Final formatted token data:", JSON.stringify(formattedTokenData, null, 2))
      return { success: true, data: formattedTokenData }
    } else {
      return {
        success: false,
        error: "No token data found in DexScreener response",
        details: "The token may exist but has no trading pairs or market data.",
      }
    }
  } catch (error: any) {
    console.error("Error fetching token data:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch token data",
      details: error.toString(),
    }
  }
}

// Update the analyzeSolanaToken function to remove sentiment analysis
export async function analyzeSolanaToken(address: string, tokenData: TokenData | null, note?: string) {
  try {
    // If we have token data, we can provide a factual analysis
    if (tokenData) {
      // Format the token data into a readable analysis focusing on the requested information
      let analysis = `## ${tokenData.name || "Unknown Token"} (${tokenData.symbol || "???"})

**Basic Information:**
- **Name:** ${tokenData.name || "Unknown"}
- **Symbol:** ${tokenData.symbol || "Unknown"}
- **Market Cap:** ${tokenData.marketCap ? "$" + formatNumber(tokenData.marketCap) : "Unknown"}
${tokenData.createdAt ? `- **Created:** ${new Date(tokenData.createdAt).toLocaleDateString()}` : ""}

**Links:**`

      // Add website and Twitter information if available
      if (tokenData.socials) {
        if (tokenData.socials.website) {
          analysis += `\n- **Website:** ${tokenData.socials.website}`
        } else {
          analysis += "\n- No website found"
        }

        if (tokenData.socials.twitter) {
          analysis += `\n- **Twitter:** @${tokenData.socials.twitter} - [Check Twitter activity](https://twitter.com/${tokenData.socials.twitter})`
        } else {
          analysis += "\n- No Twitter account found"
        }
      } else {
        analysis += "\n- No links found"
      }

      // If we have a note about limited data, add it
      if (note) {
        analysis += `\n\n**Note:** ${note}`
      }

      return { success: true, analysis }
    }

    // If we don't have token data, return a direct error message instead of using AI
    return {
      success: false,
      error: "Token not found",
      analysis: `## Token Not Found

The token address \`${address}\` was not found in DexScreener.

This could be because:
- The token is very new and not yet indexed
- The token has no trading pairs or liquidity
- The address may be incorrect
- It might be a personal token or NFT, not a tradable token

You can try checking this address directly on:
- [Solscan](https://solscan.io/account/${address})
- [DexScreener](https://dexscreener.com/solana/${address})
- [Solana Explorer](https://explorer.solana.io/address/${address})`,
    }
  } catch (error: any) {
    console.error("Error analyzing token:", error)
    return {
      success: false,
      error: error.message || "Error analyzing token",
      analysis: `## Error Analyzing Token

There was an error while analyzing this token: ${error.message || "Unknown error"}

You can try checking this address directly on:
- [Solscan](https://solscan.io/account/${address})
- [DexScreener](https://dexscreener.com/solana/${address})
- [Solana Explorer](https://explorer.solana.io/address/${address})`,
    }
  }
}

// Helper function to format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + "B"
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K"
  }
  return num.toString()
}

// New function to generate AI opinion about wallet performance
export async function generateWalletOpinion(walletData: any, databaseDescription?: string) {
  try {
    console.log("🤖 Generating AI opinion for wallet data...")

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OpenAI API key not found")
    }

    // Extract key metrics from wallet data
    const data = walletData.data || walletData
    const winRate = data.winrate || data.win_rate
    const totalProfit = data.total_profit
    const profit7d = data.realized_profit_7d
    const profit30d = data.realized_profit_30d
    const totalValue = data.total_value
    const solBalance = data.sol_balance
    const twitterUrl = data.twitter_url
    const twitterFollowers = data.twitter_followers || data.followers

    // Create a comprehensive prompt for the AI
    const prompt = `You are LyxAI, an expert Solana blockchain analyst. Analyze this wallet's performance and provide a professional opinion.

WALLET PERFORMANCE DATA:
${databaseDescription ? `Background: ${databaseDescription}` : ""}
- Win Rate: ${winRate || "Unknown"}%
- Total Profit: $${totalProfit || "Unknown"}
- 7-Day Profit: $${profit7d || "Unknown"}
- 30-Day Profit: $${profit30d || "Unknown"}
- Portfolio Value: $${totalValue || "Unknown"}
- SOL Balance: ${solBalance || "Unknown"} SOL
${twitterUrl ? `- Twitter: ${twitterUrl} (${twitterFollowers || "Unknown"} followers)` : ""}

INSTRUCTIONS:
1. Provide a 2-3 sentence professional assessment of this wallet's trading performance
2. Comment on their risk management and trading strategy based on the metrics
3. Give a brief outlook on their trading approach (conservative, aggressive, etc.)
4. Keep it concise, insightful, and professional
5. Don't mention that this is from a database - present it as your analysis
6. Focus on what the numbers tell us about their trading skill and approach

Write in a confident, analytical tone as if you're a professional trader reviewing another trader's performance.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are LyxAI, a professional Solana blockchain analyst with expertise in wallet performance analysis and trading strategies.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("❌ OpenAI API Error:", errorData)
      throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`)
    }

    const responseData = await response.json()
    const opinion = responseData.choices[0]?.message?.content

    if (!opinion) {
      throw new Error("No opinion generated from OpenAI")
    }

    console.log("✅ Successfully generated AI opinion")
    return { success: true, opinion }
  } catch (error: any) {
    console.error("❌ Error generating wallet opinion:", error)
    return {
      success: false,
      error: "Failed to generate opinion",
      details: error.message,
    }
  }
}

// Function to generate chat responses using direct fetch
export async function generateChatResponse(userInput: string) {
  try {
    console.log("🔍 User input:", userInput)

    // Extract potential Solana addresses from the user's message
    const addresses = extractSolanaAddresses(userInput)
    console.log("📍 Extracted addresses:", addresses)

    // Check if any of these addresses are wallets and get their info
    const foundWallets = []
    let systemPromptAddition = ""

    if (addresses.length > 0) {
      console.log(`🔎 Checking ${addresses.length} addresses...`)

      // Check each address
      for (const address of addresses) {
        if (isValidSolanaAddress(address)) {
          try {
            // STEP 1: Check if it's a wallet or token using Helius API
            console.log(`🔍 Checking if ${address} is a wallet or token...`)
            const addressType = await checkAddressTypeWithHelius(address)

            if (addressType.isWallet) {
              console.log(`✅ ${address} is confirmed as a wallet address`)

              // STEP 2: Get wallet info from the new endpoint
              console.log(`🔍 Fetching wallet info from new endpoint for: ${address}`)
              const walletInfo = await getWalletInfoFromEndpoint(address)

              if (walletInfo) {
                console.log(`✅ FOUND wallet info for address ${address}:`, walletInfo)
                foundWallets.push({ address, walletInfo })

                // Add this wallet info to system prompt
                systemPromptAddition += `\n\n🎯 WALLET ANALYSIS RESULTS:\n`
                systemPromptAddition += `Address: ${address}\n`

                // Add wallet info details based on the response structure
                if (walletInfo.summary) {
                  systemPromptAddition += `Summary: ${walletInfo.summary}\n`
                }

                if (walletInfo.performance) {
                  systemPromptAddition += `Performance: ${JSON.stringify(walletInfo.performance)}\n`
                }

                if (walletInfo.holdings) {
                  systemPromptAddition += `Holdings: ${JSON.stringify(walletInfo.holdings)}\n`
                }

                if (walletInfo.activity) {
                  systemPromptAddition += `Recent Activity: ${JSON.stringify(walletInfo.activity)}\n`
                }

                systemPromptAddition += `\nThis wallet has been analyzed using our advanced endpoint. Provide detailed insights based on this data.\n`
              } else {
                console.log(`❌ No wallet info found for address ${address}`)

                // STEP 3: Fallback to checking saved wallets database
                console.log(`🔍 Checking database for wallet: ${address}`)
                const savedWallet = await walletService.getWalletByAddress(address)

                if (savedWallet) {
                  console.log(`✅ FOUND saved wallet for address ${address}:`, savedWallet)
                  foundWallets.push({ address, wallet: savedWallet })

                  systemPromptAddition += `\n\n🎯 SAVED WALLET DATABASE MATCH:\n`
                  systemPromptAddition += `Address: ${address}\n`
                  systemPromptAddition += `Name: ${savedWallet.name || "Unnamed"}\n`
                  systemPromptAddition += `Description: ${savedWallet.description || "No description"}\n`

                  if (savedWallet.tags && savedWallet.tags.length > 0) {
                    systemPromptAddition += `Tags: ${savedWallet.tags.join(", ")}\n`
                  }

                  if (savedWallet.x_account) {
                    systemPromptAddition += `X/Twitter: ${savedWallet.x_account}\n`
                  }

                  systemPromptAddition += `\nThis wallet is tracked in our database. Mention this information and explain why it's worth tracking.\n`
                } else {
                  systemPromptAddition += `\n\nNote: The address ${address} is a valid Solana wallet but no detailed analysis or saved data is available.\n`
                }
              }
            } else if (addressType.isToken) {
              console.log(`ℹ️ ${address} is a token/coin address, not a wallet`)
              systemPromptAddition += `\n\nNote: The address ${address} appears to be a token/coin address, not a wallet address.\n`
            } else {
              console.log(`❓ Could not determine if ${address} is a wallet or token`)
            }
          } catch (error) {
            console.error(`❌ Error checking wallet ${address}:`, error)
          }
        }
      }
    }

    const systemPrompt = `You are LyxAI, an AI assistant specialized in the Solana blockchain ecosystem. Your primary focus is helping users find and analyze wallets on the Solana blockchain.

${systemPromptAddition ? `${systemPromptAddition}\n` : ""}

${
  foundWallets.length > 0
    ? `CRITICAL: The user is asking about wallet(s) that we have analysis data for. Start your response by providing the detailed wallet analysis and insights based on the data provided above.`
    : `Provide detailed guidance on how to look up Solana wallet addresses using explorers like Solscan, Solana Explorer, and Solana FM.`
}

Include relevant Solana-specific terminology and explain concepts clearly. Be friendly and conversational while maintaining technical accuracy.`

    console.log("📝 System prompt created with wallet info:", foundWallets.length > 0 ? "YES" : "NO")

    if (foundWallets.length > 0) {
      console.log(
        "🎯 Found wallets to include:",
        foundWallets.map((w) => w.address),
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OpenAI API key not found")
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userInput,
          },
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("❌ OpenAI API Error:", errorData)
      throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error("No response from OpenAI")
    }

    console.log("✅ Successfully received OpenAI response")
    console.log("📄 Response preview:", aiResponse.substring(0, 100) + "...")

    return { success: true, response: aiResponse }
  } catch (error: any) {
    console.error("❌ Error in generateChatResponse:", error)
    return {
      success: false,
      error: "Failed to generate response",
      details: error.message,
    }
  }
}
