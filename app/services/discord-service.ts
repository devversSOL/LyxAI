import { cache } from "react"
import { getSupabaseAdmin } from "@/lib/supabase"

export interface DiscordMessage {
  id: string
  content: string
  timestamp: string
  author?: {
    username: string
    avatar?: string
  }
  embeds?: DiscordEmbed[]
  attachments?: any[]
  // Add any other fields that might be in your messages
  message_id?: string
  channel_id?: string
  created_at?: string
  // Add fields from your actual message format
  token?: string
  amount?: string
  value?: string
  type?: string
  from?: string
  to?: string
  impact?: string
}

export interface DiscordEmbed {
  title?: string
  description?: string
  color?: number
  fields?: {
    name: string
    value: string
    inline?: boolean
  }[]
  thumbnail?: {
    url: string
  }
  footer?: {
    text: string
    icon_url?: string
  }
}

export interface WhaleActivity {
  id: string
  token: string
  buyAmount: string
  marketCap: string
  winRate: string // Now used for Token CA
  biggestWin: string
  // Keep other fields for compatibility
  amount?: string
  value?: string
  type?: string
  from?: string
  to?: string
  time?: string
  impact?: "High" | "Medium" | "Low"
  originalMessage: DiscordMessage
  transactionUrl?: string | null
  // Additional fields for whale insights
  totalTrades?: string
  pnl?: string
  averageTrade?: string
  totalVolume?: string
  tokenCA?: string // New field for Token Contract Address
}

// Helper function to validate if a message has all required whale data
function validateWhaleMessage(content: string): boolean {
  if (!content || !content.includes("whale just bought")) {
    return false
  }

  // Check for required patterns in the new format - UPDATED PATTERNS
  const hasWhaleName = /A\s+\$([A-Z0-9\s]+)\s+whale/i.test(content) // Allow spaces in whale names
  const hasBuyAmount = /bought\s+(\$[0-9.]+[KMB])\s+of/i.test(content)
  const hasToken = /of\s+\$([A-Z0-9]+)(?:\s+at|\s|$)/i.test(content)
  const hasMarketCap = /at\s+(\$[0-9.]+[KMB])\s+MC/i.test(content)
  // Make URL optional since messages might be truncated
  const hasAssetDashUrl =
    /https?:\/\/[^\s]+/i.test(content) || content.includes("screener.com") || content.includes("assetdash.com")

  console.log("Validation results:", {
    hasWhaleName,
    hasBuyAmount,
    hasToken,
    hasMarketCap,
    hasAssetDashUrl,
    content: content.substring(0, 100),
  })

  // All required fields must be present (URL is now more flexible)
  return hasWhaleName && hasBuyAmount && hasToken && hasMarketCap && hasAssetDashUrl
}

// Fetch messages from Supabase instead of directly from Discord
export const fetchDiscordMessages = cache(async (channelId?: string, limit = 100): Promise<DiscordMessage[]> => {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    console.warn("Supabase client not available. Using mock data.")
    return mockDiscordMessages
  }

  try {
    console.log(`Fetching Discord messages from Supabase database...`)

    // Try both tables to see which one has data
    let data
    let error

    try {
      // First try messages table
      const result = await supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(limit)

      data = result.data
      error = result.error

      if (error || !data || data.length === 0) {
        throw new Error("No data in messages table")
      }

      console.log("Successfully fetched data from messages table")
    } catch (err) {
      console.log("Trying discord_messages table instead...")
      // If that fails, try discord_messages table
      const result = await supabase
        .from("discord_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit)

      data = result.data
      error = result.error

      if (error) {
        console.error("Supabase query error:", error)
        throw new Error(`Failed to fetch messages from database: ${error.message}`)
      }

      console.log("Successfully fetched data from discord_messages table")
    }

    if (!data || data.length === 0) {
      console.log("No messages found in either table")
      return []
    }

    console.log(`Successfully fetched ${data.length} messages from Supabase`)
    console.log("Sample message:", JSON.stringify(data[0]).substring(0, 300))

    // Convert Supabase records to DiscordMessage format
    // Keep all fields from the original record
    return data.map((record: any) => ({
      ...record, // Include all original fields
      id: record.id || record.message_id || String(Date.now()),
      content: record.content || "",
      timestamp: record.timestamp || record.created_at,
      author: {
        username: record.username || record.author_username || "Unknown",
        avatar: record.avatar_url,
      },
      embeds: record.embeds || [],
      attachments: record.attachments || [],
    }))
  } catch (error) {
    console.error("Error fetching Discord messages from Supabase:", error)
    return mockDiscordMessages
  }
})

// Parse Discord messages into whale activity format
export function parseWhaleActivity(messages: DiscordMessage[]): WhaleActivity[] {
  console.log("Parsing messages:", messages.length)

  // If no messages, return empty array
  if (!messages || messages.length === 0) {
    console.log("No messages to parse")
    return []
  }

  // Log a sample message for debugging
  if (messages.length > 0) {
    console.log("Sample message for parsing:", JSON.stringify(messages[0]).substring(0, 300))
  }

  return messages
    .map((message) => {
      try {
        // IMPORTANT: Check if the message already has the fields we need
        // This handles the case where the data is already in the right format from /api/new-message
        if (message.token && message.amount && message.value) {
          console.log("Message already has the fields we need:", message.token)

          // Use the fields directly from the message
          return {
            id: message.id,
            token: message.token || "Unknown",
            buyAmount: message.amount || "Unknown",
            marketCap: message.marketCap || "Unknown",
            winRate: message.winRate || "Unknown",
            biggestWin: message.biggestWin || "Unknown",
            // Keep other fields for compatibility
            amount: message.amount,
            value: message.value,
            type: message.type || "Buy",
            from: message.from || "Unknown",
            to: message.to || "Unknown",
            time: new Date(message.timestamp || message.created_at).toLocaleString(),
            impact: (message.impact as "High" | "Medium" | "Low") || "Medium",
            originalMessage: message,
            transactionUrl: null,
          }
        }

        // Handle the specific whale alert format
        // NEW FORMAT: "A $LABUBU whale just bought $6.87K of $Nailong at $3.57M MC 🐳"
        if (message.content && message.content.includes("whale just bought")) {
          console.log("Processing whale alert message:", message.content.substring(0, 50))

          // VALIDATE MESSAGE FIRST - Skip if missing required data
          if (!validateWhaleMessage(message.content)) {
            console.log("Message failed validation, skipping:", message.content.substring(0, 100))
            return null
          }

          // Extract buy amount - pattern: "bought $X.XXK of"
          const buyAmountMatch = message.content.match(/bought\s+(\$[0-9.]+[KMB])\s+of/i)
          const buyAmount = buyAmountMatch ? buyAmountMatch[1] : "Unknown"

          // Extract token - pattern: "of $TOKEN at"
          const tokenMatch = message.content.match(/of\s+\$([A-Z0-9]+)(?:\s+at|\s|$)/i)
          const token = tokenMatch ? tokenMatch[1] : "Unknown"

          // Extract market cap - pattern: "at $X.XXM MC"
          const mcMatch = message.content.match(/at\s+(\$[0-9.]+[KMB])\s+MC/i)
          const marketCap = mcMatch ? mcMatch[1] : "Unknown"

          // NEW: Extract biggest win (whale name) - pattern: "A $NAME whale" - UPDATED PATTERN
          const biggestWinMatch = message.content.match(/A\s+\$([A-Z0-9\s]+)\s+whale/i)
          const biggestWin = biggestWinMatch ? `$${biggestWinMatch[1].trim()}` : "Unknown"

          // NEW: Extract Token CA from the URL - handle different URL formats
          let tokenCA = "Unknown"
          const urlMatch = message.content.match(/https?:\/\/[^\s]*\/([A-Za-z0-9]+)(?:\s|$)/i)
          if (urlMatch) {
            tokenCA = urlMatch[1]
          } else {
            // If no URL found, generate a placeholder
            tokenCA = `${token}_CA`
          }

          // Double-check that we have all required data
          if (
            buyAmount === "Unknown" ||
            token === "Unknown" ||
            marketCap === "Unknown" ||
            biggestWin === "Unknown" ||
            tokenCA === "Unknown"
          ) {
            console.log("Missing required data after parsing, skipping message")
            return null
          }

          // Determine impact based on value
          let impact: "High" | "Medium" | "Low" = "Medium"
          if (buyAmount !== "Unknown") {
            const numValue = parseValueToNumber(buyAmount)
            if (numValue > 50000) impact = "High"
            else if (numValue < 5000) impact = "Low"
          }

          return {
            id: message.id,
            token,
            buyAmount,
            marketCap,
            winRate: tokenCA, // Using winRate field for Token CA
            biggestWin,
            // Keep other fields for compatibility
            amount: buyAmount,
            value: buyAmount,
            type: "Buy",
            from: "Whale",
            to: "Market",
            time: new Date(message.timestamp || message.created_at).toLocaleString(),
            impact,
            originalMessage: message,
            transactionUrl: urlMatch ? urlMatch[0] : null,
            // Store the token CA for easy access
            tokenCA: tokenCA,
          }
        }

        // For test messages or simple messages without embeds - SKIP THESE
        console.log("Message doesn't match whale format, skipping:", message.content?.substring(0, 50))
        return null
      } catch (error) {
        console.error("Error parsing message:", error, message)
        return null
      }
    })
    .filter((activity): activity is WhaleActivity => activity !== null)
}

// Helper function to parse values like $5.24K to numbers
function parseValueToNumber(value: string): number {
  try {
    // Remove $ and any commas
    const cleanValue = value.replace(/[$,]/g, "")

    // Extract the number and suffix
    const match = cleanValue.match(/^([0-9.]+)([KMB])?$/i)
    if (!match) return 0

    const num = Number.parseFloat(match[1])
    const suffix = match[2]?.toUpperCase()

    // Apply multiplier based on suffix
    if (suffix === "K") return num * 1000
    if (suffix === "M") return num * 1000000
    if (suffix === "B") return num * 1000000000

    return num
  } catch (e) {
    console.error("Error parsing value:", e, value)
    return 0
  }
}

// Mock Discord messages for development and fallback
const mockDiscordMessages: DiscordMessage[] = [
  {
    id: "1234567890123456789",
    content:
      "A $LABUBU whale just bought $6.87K of $Nailong at $3.57M MC 🐳\n\nhttps://app.assetdash.com/solana/mkvXiNBpa8uiSApe5BrhWVJaT87pJFTZxRy7zFapump",
    timestamp: new Date().toISOString(),
    author: {
      username: "WhaleAlert",
      avatar: "https://cdn.discordapp.com/avatars/123456789/abcdef.png",
    },
    embeds: [],
  },
]
