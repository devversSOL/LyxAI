import type { SavedWallet } from "@/types/wallet"
import { walletUtils } from "./wallet-utils"

/**
 * Enhances AI prompts with additional context from our database
 */
export const aiPromptEnhancer = {
  /**
   * Enhance a user message with wallet information if addresses are found
   */
  async enhanceWithWalletInfo(userMessage: string): Promise<{
    enhancedMessage: string
    foundWallets: Array<{ address: string; data: any }>
  }> {
    // Extract potential wallet addresses from the message
    const addresses = walletUtils.extractAddresses(userMessage)
    const foundWallets: Array<{ address: string; data: any }> = []

    // If no addresses found, return the original message
    if (addresses.length === 0) {
      return { enhancedMessage: userMessage, foundWallets }
    }

    let enhancedMessage = userMessage

    // Check each address against our database
    for (const address of addresses) {
      const result = await walletUtils.checkSavedWallet(address)

      if (result.found && result.wallet) {
        // Add this wallet to our found wallets
        foundWallets.push({ address, data: result.wallet })

        // Enhance the message with wallet information
        const walletInfo = formatWalletInfo(result.wallet)
        enhancedMessage += `\n\nI found information about wallet ${address} in our database:\n${walletInfo}`
      }
    }

    return { enhancedMessage, foundWallets }
  },
}

/**
 * Format wallet information for inclusion in AI prompts
 */
function formatWalletInfo(wallet: SavedWallet): string {
  let info = `Name: ${wallet.name || "Unnamed"}\n`
  info += `Description: ${wallet.description || "No description"}\n`

  if (wallet.tags && wallet.tags.length > 0) {
    info += `Tags: ${wallet.tags.join(", ")}\n`
  }

  if (wallet.x_account) {
    info += `X/Twitter: ${wallet.x_account}\n`
  }

  return info
}
