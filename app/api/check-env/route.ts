import { NextResponse } from "next/server"

export async function GET() {
  // Create a safe version of environment variables for display
  // that doesn't expose full keys
  const safeEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? `Set (length: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length}, starts with: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...)`
      : "Not set",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? `Set (length: ${process.env.SUPABASE_SERVICE_ROLE_KEY.length}, starts with: ${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 5)}...)`
      : "Not set",
    NODE_ENV: process.env.NODE_ENV || "Not set",
    VERCEL_ENV: process.env.VERCEL_ENV || "Not set",
    VERCEL_URL: process.env.VERCEL_URL || "Not set",
  }

  return NextResponse.json({
    environment: safeEnv,
    timestamp: new Date().toISOString(),
    message: "This endpoint shows the status of your environment variables (without exposing sensitive values)",
  })
}
