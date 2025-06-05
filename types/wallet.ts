/**
 * Represents a saved wallet in the database
 */
export interface SavedWallet {
  id: string
  address: string
  name?: string | null
  description?: string | null
  tags?: string[] | null
  user_id?: string | null
  x_account?: string | null
  created_at?: string | null
  updated_at?: string | null
}
