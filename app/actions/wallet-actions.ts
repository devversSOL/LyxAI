"use server"

import { walletService } from "@/lib/wallet-service"
import type { SavedWallet } from "@/types/wallet"

/**
 * Get all saved wallets
 */
export async function getSavedWallets() {
  try {
    const wallets = await walletService.getAllWallets()
    return {
      success: true,
      wallets,
    }
  } catch (error) {
    console.error("Error getting saved wallets:", error)
    return {
      success: false,
      error: "Failed to retrieve saved wallets",
    }
  }
}

/**
 * Save a wallet
 */
export async function saveWallet(wallet: Omit<SavedWallet, "id" | "created_at" | "updated_at">) {
  try {
    // Validate wallet address
    if (!wallet.address || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet.address)) {
      return {
        success: false,
        error: "Invalid Solana wallet address",
      }
    }

    // Validate description
    if (!wallet.description) {
      return {
        success: false,
        error: "Description is required",
      }
    }

    const savedWallet = await walletService.saveWallet(wallet)
    if (!savedWallet) {
      return {
        success: false,
        error: "Failed to save wallet",
      }
    }

    return {
      success: true,
      wallet: savedWallet,
    }
  } catch (error) {
    console.error("Error saving wallet:", error)
    return {
      success: false,
      error: "Failed to save wallet",
    }
  }
}

/**
 * Delete a wallet
 */
export async function deleteWallet(id: string) {
  try {
    const success = await walletService.deleteWallet(id)
    return {
      success,
    }
  } catch (error) {
    console.error("Error deleting wallet:", error)
    return {
      success: false,
      error: "Failed to delete wallet",
    }
  }
}

/**
 * Search wallets
 */
export async function searchWallets(query: string) {
  try {
    const wallets = await walletService.searchWallets(query)
    return {
      success: true,
      wallets,
    }
  } catch (error) {
    console.error("Error searching wallets:", error)
    return {
      success: false,
      error: "Failed to search wallets",
    }
  }
}
