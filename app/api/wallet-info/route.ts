import { type NextRequest, NextResponse } from "next/server"
import { walletService } from "@/lib/wallet-service"

// Add this line to force dynamic rendering
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    console.log("🔍 Fetching wallet info for address:", address)

    // Fetch from the Railway endpoint
    const response = await fetch(`https://web-production-6abd3.up.railway.app/wallet-info/${address}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "LyxAI/1.0",
      },
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    console.log(`Railway API response status: ${response.status}`)

    if (!response.ok) {
      console.error(`Railway API error: ${response.status} ${response.statusText}`)

      // Try to get error details
      let errorText = ""
      try {
        errorText = await response.text()
        console.error("Railway API error details:", errorText)
      } catch (e) {
        console.error("Could not read error response")
      }

      return NextResponse.json(
        {
          error: `Railway API error: ${response.status}`,
          details: errorText || response.statusText,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("✅ Successfully fetched wallet data from Railway")

    // Check if wallet exists in database and get description
    let databaseDescription = null
    try {
      console.log("🔍 Checking database for saved wallet description...")
      const savedWallet = await walletService.getWalletByAddress(address)
      if (savedWallet && savedWallet.description) {
        databaseDescription = savedWallet.description
        console.log("✅ Found database description:", databaseDescription)
      } else {
        console.log("ℹ️ No saved description found for this wallet")
      }
    } catch (error) {
      console.error("⚠️ Error fetching database description:", error)
      // Continue without the database description
    }

    // Add database description to the response if available
    const responseData = {
      ...data,
      ...(databaseDescription ? { databaseDescription } : {}),
    }

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("❌ Error in wallet-info API route:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch wallet information",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
