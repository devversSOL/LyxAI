"use server"

import { supabaseAdmin } from "@/lib/supabase"

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

  console.log("Message validation:", {
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

export async function storeDiscordMessage(formData: FormData) {
  console.log("storeDiscordMessage server action called")

  try {
    // Extract data from formData
    const username = (formData.get("username") as string) || "Unknown User"
    const content = (formData.get("content") as string) || ""
    const attachmentsJson = (formData.get("attachments") as string) || "[]"
    const embedsJson = (formData.get("embeds") as string) || "[]"

    // Parse JSON strings
    const attachments = JSON.parse(attachmentsJson)
    const embeds = JSON.parse(embedsJson)

    console.log("Received message from:", username)
    console.log("Content:", content)

    // VALIDATE MESSAGE BEFORE STORING
    if (!validateWhaleMessage(content)) {
      console.log("Message failed validation - not storing in database")
      return {
        success: false,
        error: "Message does not contain all required whale data",
        details: "Missing required fields: whale name, buy amount, token, market cap, or AssetDash URL",
        skipped: true,
      }
    }

    // Create a message object
    const message = {
      id: Date.now().toString(),
      username,
      content,
      timestamp: new Date().toISOString(),
      attachments,
      embeds,
    }

    // Store the message in Supabase
    const { error } = await supabaseAdmin.from("discord_messages").insert([message])

    if (error) {
      console.error("Error storing message in Supabase:", error)
      return {
        success: false,
        error: "Failed to store message in database",
        details: error.message,
      }
    }

    console.log("Valid whale message stored successfully in Supabase")

    return {
      success: true,
      message: "Valid whale message received and stored",
      messageId: message.id,
    }
  } catch (error) {
    console.error("Error processing message:", error)
    return {
      success: false,
      error: "Error processing message",
      details: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getDiscordMessages() {
  try {
    const { data: messages, error } = await supabaseAdmin
      .from("discord_messages")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100)

    if (error) {
      console.error("Error fetching messages from Supabase:", error)
      return { messages: [], error: error.message }
    }

    return { messages: messages || [] }
  } catch (error) {
    console.error("Error retrieving messages:", error)
    return {
      messages: [],
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
