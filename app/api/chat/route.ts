import { NextResponse } from "next/server"
import { walletService } from "@/lib/wallet-service"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Helper function to extract Solana addresses from text
function extractSolanaAddresses(text: string): string[] {
  console.log("🔍 Extracting addresses from text:", text)

  // Improved regex pattern for Solana addresses
  // Solana addresses are base58 encoded, 32-44 characters, no 0, O, I, l
  const regex = /[1-9A-HJ-NP-Za-km-z]{32,44}/g

  const matches = text.match(regex) || []
  console.log("📍 Raw regex matches:", matches)

  // Filter to only valid Solana addresses (additional validation)
  const validAddresses = matches.filter((match) => {
    // Must be exactly 32-44 characters
    if (match.length < 32 || match.length > 44) return false

    // Must not contain invalid base58 characters
    if (/[0OIl]/.test(match)) return false

    // Additional check: most Solana addresses start with certain characters
    // This is a loose check, not strict validation
    return true
  })

  console.log("✅ Valid addresses found:", validAddresses)
  return [...new Set(validAddresses)]
}

// Helper function to check if a string is likely a valid Solana address
function isValidSolanaAddress(address: string): boolean {
  console.log("🔍 Validating address:", address, "Length:", address.length)

  // Basic validation - Solana addresses are base58 encoded
  const isValid =
    /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address) &&
    address.length >= 32 &&
    address.length <= 44 &&
    !/[0OIl]/.test(address)

  console.log("✅ Address validation result:", isValid)
  return isValid
}

// Function to search token narratives by address or name
async function searchTokenNarratives(query: string) {
  try {
    console.log("🔍 Searching token narratives for:", query)

    // Check if query looks like an address
    const isAddressSearch = query.length > 30 && isValidSolanaAddress(query)

    let supabaseQuery = supabase.from("token_narratives").select("*")

    if (isAddressSearch) {
      // Search by exact address
      supabaseQuery = supabaseQuery.eq("address", query)
    } else {
      // Search by name (case insensitive)
      supabaseQuery = supabaseQuery.ilike("name", `%${query}%`)
    }

    const { data: tokens, error } = await supabaseQuery.limit(5)

    if (error) {
      console.error("Error searching token narratives:", error)
      return []
    }

    console.log(`Found ${tokens?.length || 0} token narratives`)
    return tokens || []
  } catch (error) {
    console.error("Error in searchTokenNarratives:", error)
    return []
  }
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

    // Search for token narratives based on the user message
    const foundTokens = await searchTokenNarratives(userMessage)
    console.log("🎯 Found token narratives:", foundTokens.length)

    // Check if any of these addresses are wallets and get their info
    const foundWallets = []
    let systemPromptAddition = ""

    // Add token narrative information if found
    if (foundTokens.length > 0) {
      systemPromptAddition += `\n\n🎯 TOKEN NARRATIVE ANALYSIS FOUND:\n`

      for (const token of foundTokens) {
        systemPromptAddition += `\nToken: ${token.name} (${token.address})\n`
        systemPromptAddition += `Short Summary: ${token.short_summary}\n`

        if (token.risk_score) {
          systemPromptAddition += `Risk Score: ${token.risk_score}/100\n`
        }

        if (token.total_percentage) {
          systemPromptAddition += `Total Percentage: ${token.total_percentage}%\n`
        }

        if (token.full_analysis) {
          systemPromptAddition += `Full Analysis: ${token.full_analysis.substring(0, 500)}...\n`
        }

        systemPromptAddition += `\nThis token has detailed narrative analysis available. Provide insights based on this data.\n`
      }
    }

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

              // Check if we have narrative data for this token
              const tokenNarratives = await searchTokenNarratives(address)
              if (tokenNarratives.length > 0) {
                const token = tokenNarratives[0]
                systemPromptAddition += `\n\n🎯 TOKEN NARRATIVE FOUND:\n`
                systemPromptAddition += `Token: ${token.name} (${address})\n`
                systemPromptAddition += `Short Summary: ${token.short_summary}\n`

                if (token.risk_score) {
                  systemPromptAddition += `Risk Score: ${token.risk_score}/100\n`
                }

                if (token.full_analysis) {
                  systemPromptAddition += `Full Analysis: ${token.full_analysis}\n`
                }

                systemPromptAddition += `\nProvide detailed insights based on this narrative analysis.\n`
              } else {
                systemPromptAddition += `\n\nNote: The address ${address} appears to be a token/coin address, but no narrative analysis is available in our database.\n`
              }
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
    const systemPrompt = `You are LyxAI, an AI assistant specialized in the Solana blockchain ecosystem. Your primary focus is helping users find and analyze wallets and tokens on the Solana blockchain.

${systemPromptAddition ? `${systemPromptAddition}\n` : ""}

Provide detailed guidance on:
1. How to look up Solana wallet addresses using explorers like Solscan, Solana Explorer, and Solana FM
2. How to interpret wallet data, transaction history, and token holdings
3. Token narrative analysis and risk assessment
4. Best practices for wallet security and management on Solana
5. How to track specific wallets or transactions of interest
6. Tools and methods to analyze on-chain activity for Solana wallets

${
  foundWallets.length > 0 || foundTokens.length > 0
    ? `CRITICAL: The user is asking about wallet(s) or token(s) that we have analysis data for. Start your response by providing the detailed analysis and insights based on the data provided above.`
    : `When users ask about finding wallets or tokens, provide specific steps using Solana explorers and tools.`
}

Include relevant Solana-specific terminology and explain concepts clearly. Be friendly and conversational while maintaining technical accuracy.`

    console.log("📝 System prompt created with data:", foundWallets.length > 0 || foundTokens.length > 0 ? "YES" : "NO")

    if (foundWallets.length > 0) {
      console.log(
        "🎯 Found wallets to include:",
        foundWallets.map((w) => w.address),
      )
    }

    if (foundTokens.length > 0) {
      console.log(
        "🎯 Found tokens to include:",
        foundTokens.map((t) => t.name),
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
