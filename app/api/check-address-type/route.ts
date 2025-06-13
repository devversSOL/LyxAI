import { type NextRequest, NextResponse } from "next/server"

// Add this line to force dynamic rendering
export const dynamic = "force-dynamic"

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json({ error: "Address parameter is required" }, { status: 400 })
    }

    // Basic validation - Solana addresses are base58 encoded
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
      return NextResponse.json({ error: "Invalid Solana address format" }, { status: 400 })
    }

    console.log("🔍 Checking address type for:", address)

    const result = await checkAddressTypeWithHelius(address)

    return NextResponse.json({
      address,
      isWallet: result.isWallet,
      isToken: result.isToken,
      success: true,
    })
  } catch (error: any) {
    console.error("❌ Error in check-address-type API:", error)
    return NextResponse.json(
      {
        error: "Failed to check address type",
        details: error.message,
        success: false,
      },
      { status: 500 },
    )
  }
}
