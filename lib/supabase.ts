import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Types for our database
export interface DiscordMessageRecord {
  id: string
  username: string
  content: string
  timestamp: string
  attachments?: any[]
  embeds?: any[]
  created_at?: string
  channel_id?: string
}

// Function to safely create Supabase client
const createSafeClient = (url: string | undefined, key: string | undefined, name: string) => {
  if (!url) {
    console.error(
      `Cannot create ${name} client: Missing URL. Environment variable NEXT_PUBLIC_SUPABASE_URL is not set.`,
    )
    return null
  }

  if (!key) {
    console.error(
      `Cannot create ${name} client: Missing API key. Environment variable ${name === "admin" ? "SUPABASE_SERVICE_ROLE_KEY" : "NEXT_PUBLIC_SUPABASE_ANON_KEY"} is not set.`,
    )
    return null
  }

  try {
    console.log(`Creating ${name} Supabase client with URL: ${url.substring(0, 20)}...`)
    return createSupabaseClient(url, key)
  } catch (error) {
    console.error(`Error creating ${name} client:`, error)
    return null
  }
}

// For server-side only
export const getSupabaseAdmin = () => {
  // Log environment variables (without exposing full values)
  console.log("Environment check for Supabase admin client:")
  console.log(
    "- NEXT_PUBLIC_SUPABASE_URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL
      ? "Set (starts with: " + process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 10) + "...)"
      : "Not set",
  )
  console.log(
    "- SUPABASE_SERVICE_ROLE_KEY:",
    process.env.SUPABASE_SERVICE_ROLE_KEY
      ? "Set (length: " + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ")"
      : "Not set",
  )

  // Use environment variables directly each time to ensure we get the latest values
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  return createSafeClient(url, serviceKey, "admin")
}

// For client-side (browser) usage
export const getSupabaseClient = () => {
  if (typeof window === "undefined") {
    console.warn("getSupabaseClient called on the server side - this should only be used in browser context")
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return createSafeClient(url, anonKey, "client")
}

// For backward compatibility
export const supabase = typeof window !== "undefined" ? getSupabaseClient() : null
export const supabaseAdmin = typeof window === "undefined" ? getSupabaseAdmin() : null

// Create a Supabase client
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and anon key must be defined in environment variables")
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
