import { walletService } from "./wallet-service"

/**
 * Utility functions for wallet operations
 */
export const walletUtils = {
  /**
   * Check if a wallet address is in our saved wallets database
   * and return information about it if found
   */
  async checkSavedWallet(address: string) {
    try {
      // Normalize the address (remove spaces, etc.)
      const normalizedAddress = address.trim()

      // Check if this is a valid Solana address format
      if (!this.isValidSolanaAddress(normalizedAddress)) {
        return { found: false, reason: "invalid_format" }
      }

      // Query the database
      const wallet = await walletService.getWalletByAddress(normalizedAddress)

      if (wallet) {
        return {
          found: true,
          wallet,
          explorerUrls: {
            solscan: `https://solscan.io/account/${normalizedAddress}`,
            solanaExplorer: `https://explorer.solana.com/address/${normalizedAddress}`,
            gmgn: `https://gmgn.ai/sol/address/${normalizedAddress}`,
          },
        }
      }

      return { found: false, reason: "not_in_database" }
    } catch (error) {
      console.error("Error checking saved wallet:", error)
      return { found: false, reason: "error", error }
    }
  },

  /**
   * Basic validation for Solana address format
   */
  isValidSolanaAddress(address: string): boolean {
    // Basic check: Solana addresses are 32-44 characters long and use base58 encoding
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
    return base58Regex.test(address)
  },

  /**
   * Extract potential wallet addresses from a message
   */
  extractAddresses(message: string): string[] {
    // Look for Solana addresses in the message
    const addressRegex = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/g
    const matches = message.match(addressRegex) || []
    return [...new Set(matches)] // Remove duplicates
  },
}
