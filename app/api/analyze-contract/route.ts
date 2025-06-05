import { NextResponse } from "next/server"

// Helper function to check if a string is likely a valid Solana address
function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
}

// Simple function to check if an address is likely a wallet vs token using Helius API
async function checkIfWallet(address: string): Promise<boolean> {
  try {
    const heliusApiKey = "285490fd-6829-4bf2-a2d2-81013eab2818"
    const heliusUrl = `https://api.helius.xyz/v0/addresses/${address}/tokens?api-key=${heliusApiKey}`

    const response = await fetch(heliusUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (response.ok) {
      const data = await response.json()

      // If we get token holdings data, it's likely a wallet
      if (Array.isArray(data) && data.length >= 0) {
        return true
      }
    }

    // Try RPC method as fallback
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
    if (rpcData.result && rpcData.result.value) {
      const accountType =
        rpcData.result.value.data?.program === "spl-token" ? rpcData.result.value.data?.parsed?.type : null

      // If it's a mint, it's a token contract
      if (accountType === "mint") {
        return false
      }
      // Otherwise assume it's a wallet
      return true
    }

    return false
  } catch (error) {
    console.error("Error checking address type:", error)
    return false
  }
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error("OpenAI API key is not defined in environment variables")
      return NextResponse.json(
        { error: "OpenAI API key is missing. Please check your environment variables." },
        { status: 500 },
      )
    }

    const { messages } = await req.json()

    // Get the last user message to check if it contains a wallet address
    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage && lastUserMessage.role === "user") {
      const userInput = lastUserMessage.content.trim()

      // Check if input looks like a Solana address
      if (isValidSolanaAddress(userInput)) {
        console.log("Checking if address is a wallet:", userInput)

        const isWallet = await checkIfWallet(userInput)

        if (isWallet) {
          console.log("Address detected as wallet, returning redirect message")
          return NextResponse.json({
            response: `## Wallet Address Detected

The address \`${userInput}\` appears to be a wallet address, not a token contract.

**This tool is specifically designed for analyzing token contracts and SPL tokens.** For wallet analysis including trading performance, holdings, and activity history, please use our specialized Wallet Analyzer tool.

**What you can do:**
- Use the "Analyze Wallet" button to get detailed trading metrics
- View wallet holdings and transaction history
- See performance analytics and trading patterns

If you believe this is actually a token contract, please double-check the address.`,
          })
        }
      }
    }

    console.log("Proceeding with contract analysis...")

    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a Solana contract analyzer with deep knowledge of crypto trends, meme coins, and social media. Your job is to provide SPECIFIC information about tokens, including their viral status, associated influencers, and reasons for price movement. Be direct and specific, not generic. Provide actual names of X/Twitter accounts when possible. Focus on giving concrete information rather than general cautions. You ONLY analyze token contracts and SPL tokens, NOT wallet addresses.",
        },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 800,
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenAI API Error Response:", errorData)
      return NextResponse.json(
        {
          error: "Failed to generate response",
          details: errorData.error?.message || "Unknown API error",
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || "I couldn't analyze this contract. Please try again."

    console.log("Successfully received OpenAI response for contract analysis")

    return NextResponse.json({ response: text })
  } catch (error: any) {
    console.error("Error in contract analyzer API:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    })

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
