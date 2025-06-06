import { NextResponse } from "next/server"
import { walletService } from "@/lib/wallet-service"

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
    const heliusApiKey = "285490fd-6829-4bf2-a2d2-81013eab2818" // Consider moving this to environment variables
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
      if (Array.isArray(data) && data.length > 0) {
        console.log("✅ Address has token holdings, confirmed as wallet")
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

export async function POST(req: Request) {
  try {
    // Use OPENAI_API_KEY (without NEXT_PUBLIC_ prefix) for server-side API calls
    const apiKey = process.env.OPENAI_API_KEY

    // Check if API key exists
    if (!apiKey) {
      console.error("OpenAI API key is not defined in environment variables")
      return NextResponse.json(
        { error: "OpenAI API key is missing. Please check your environment variables." },
        { status: 500 },
      )
    }

    const { messages } = await req.json()

    // Get the latest user message
    const userMessage = messages[messages.length - 1]?.content || ""
    console.log("🔍 User message:", userMessage)

    // Extract potential Solana addresses from the user's message
    const addresses = extractSolanaAddresses(userMessage)
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

    // Create the system prompt
    const systemPrompt = `You are LyxAI, an AI assistant specialized in the Solana blockchain ecosystem. Your primary focus is helping users find and analyze wallets on the Solana blockchain.

${systemPromptAddition ? `${systemPromptAddition}\n` : ""}

Provide detailed guidance on:
1. How to look up Solana wallet addresses using explorers like Solscan, Solana Explorer, and Solana FM
2. How to interpret wallet data, transaction history, and token holdings
3. Best practices for wallet security and management on Solana
4. How to track specific wallets or transactions of interest
5. Tools and methods to analyze on-chain activity for Solana wallets

${
  foundWallets.length > 0
    ? `CRITICAL: The user is asking about wallet(s) that we have analysis data for. Start your response by providing the detailed wallet analysis and insights based on the data provided above.`
    : `When users ask about finding wallets, provide specific steps using Solana explorers and tools.`
}

Include relevant Solana-specific terminology and explain concepts clearly. Be friendly and conversational while maintaining technical accuracy.`

    console.log("📝 System prompt created with wallet info:", foundWallets.length > 0 ? "YES" : "NO")

    if (foundWallets.length > 0) {
      console.log(
        "🎯 Found wallets to include:",
        foundWallets.map((w) => w.address),
      )
    }

    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 600,
    }

    console.log("🚀 Making OpenAI API call...")

    // Make the API call using fetch
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    // Check for errors
    if (!response.ok) {
      const errorData = await response.json()
      console.error("❌ OpenAI API Error Response:", errorData)
      return NextResponse.json(
        {
          error: "Failed to generate response",
          details: errorData.error?.message || "Unknown API error",
        },
        { status: response.status },
      )
    }

    // Parse the response
    const data = await response.json()

    // Extract the response text
    const text = data.choices[0]?.message?.content || "I couldn't generate a response. Please try again."

    console.log("✅ Successfully received OpenAI response")
    console.log("📄 Response preview:", text.substring(0, 100) + "...")

    return NextResponse.json({ response: text })
  } catch (error: any) {
    // Detailed error logging
    console.error("❌ Error in chat API:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    })

    // Return a more detailed error message
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error.message,
        suggestion: "Please check your API key configuration and network connection.",
      },
      { status: 500 },
    )
  }
}
