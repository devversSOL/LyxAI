import { NextResponse } from "next/server"

interface SwapToken {
  logo_url: string
  name: string
  rugcheck_status: string
  symbol: string
  token_address: string
}

interface TrendingItem {
  price_change_24h: number
  price_usd: number
  swap_token: SwapToken
  trending_rank: number
}

interface ApiResponse {
  items: TrendingItem[]
}

export async function GET() {
  try {
    const response = await fetch("https://web-production-5984.up.railway.app/json", {
      headers: {
        "User-Agent": "LyxAI/1.0",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = (await response.json()) as ApiResponse

    if (!data || !data.items || !Array.isArray(data.items)) {
      return NextResponse.json({ error: "Invalid API response format" }, { status: 500 })
    }

    // Extract top 20 coins instead of 10
    const processedCoins = data.items.slice(0, 20).map((item) => {
      return {
        name: item.swap_token.name || "Unknown",
        symbol: item.swap_token.symbol || "N/A",
        image: item.swap_token.logo_url || null,
        rugcheck_status: item.swap_token.rugcheck_status || "unknown",
        token_address: item.swap_token.token_address || "",
        trending_rank: item.trending_rank || 0,
        price: item.price_usd || 0,
        change_24h: item.price_change_24h || 0,
      }
    })

    return NextResponse.json(processedCoins)
  } catch (error) {
    console.error("Error fetching trending coins:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch trending coins",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
