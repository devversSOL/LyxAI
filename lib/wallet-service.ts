import { getSupabaseAdmin } from "./supabase"
import type { SavedWallet } from "@/types/wallet"

// Table name in Supabase
const WALLET_TABLE = "saved_wallets"

/**
 * Service for managing saved wallet addresses
 */
export const walletService = {
  /**
   * Get all saved wallets
   */
  async getAllWallets(): Promise<SavedWallet[]> {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      console.error("Supabase admin client not available")
      return []
    }

    try {
      console.log("Fetching all wallets from database...")
      const { data, error } = await supabase.from(WALLET_TABLE).select("*")

      if (error) {
        console.error("Error fetching wallets:", error)
        return []
      }

      console.log(`Found ${data?.length || 0} wallets in database`)
      return data || []
    } catch (error) {
      console.error("Exception fetching wallets:", error)
      return []
    }
  },

  /**
   * Get a wallet by address
   */
  async getWalletByAddress(address: string): Promise<SavedWallet | null> {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      console.error("Supabase admin client not available")
      return null
    }

    try {
      // Normalize the address
      const normalizedAddress = address.trim()
      console.log(`Querying database for wallet with address: ${normalizedAddress}`)

      const { data, error } = await supabase.from(WALLET_TABLE).select("*").eq("address", normalizedAddress).single()

      if (error) {
        if (error.code === "PGRST116") {
          // No rows found - this is not an error
          console.log(`No wallet found with address: ${normalizedAddress}`)
          return null
        }
        console.error("Error fetching wallet:", error)
        return null
      }

      console.log("Found wallet in database:", data)
      return data
    } catch (error) {
      console.error("Exception fetching wallet:", error)
      return null
    }
  },

  /**
   * Save a new wallet
   */
  async saveWallet(wallet: Omit<SavedWallet, "id" | "created_at" | "updated_at">): Promise<SavedWallet | null> {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      console.error("Supabase admin client not available")
      return null
    }

    try {
      // Check if wallet already exists
      const existingWallet = await this.getWalletByAddress(wallet.address)
      if (existingWallet) {
        // Update existing wallet
        const { data, error } = await supabase
          .from(WALLET_TABLE)
          .update({
            name: wallet.name,
            description: wallet.description,
            tags: wallet.tags,
            x_account: wallet.x_account,
            updated_at: "NOW()", // Explicitly set updated_at to NOW()
          })
          .eq("address", wallet.address)
          .select()
          .single()

        if (error) {
          console.error("Error updating wallet:", error)
          return null
        }

        return data
      } else {
        // Insert new wallet
        const { data, error } = await supabase
          .from(WALLET_TABLE)
          .insert({
            ...wallet,
          })
          .select()
          .single()

        if (error) {
          console.error("Error saving wallet:", error)
          return null
        }

        return data
      }
    } catch (error) {
      console.error("Exception saving wallet:", error)
      return null
    }
  },

  /**
   * Delete a wallet
   */
  async deleteWallet(id: string): Promise<boolean> {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      console.error("Supabase admin client not available")
      return false
    }

    try {
      const { error } = await supabase.from(WALLET_TABLE).delete().eq("id", id)

      if (error) {
        console.error("Error deleting wallet:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Exception deleting wallet:", error)
      return false
    }
  },

  /**
   * Search wallets by address or description
   */
  async searchWallets(query: string): Promise<SavedWallet[]> {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      console.error("Supabase admin client not available")
      return []
    }

    try {
      const { data, error } = await supabase
        .from(WALLET_TABLE)
        .select("*")
        .or(`address.ilike.%${query}%,description.ilike.%${query}%,name.ilike.%${query}%,x_account.ilike.%${query}%`)

      if (error) {
        console.error("Error searching wallets:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Exception searching wallets:", error)
      return []
    }
  },
}
