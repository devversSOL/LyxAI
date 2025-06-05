import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 })
    }

    // Get list of tables
    const { data: tableData, error: tableError } = await supabase
      .from("pg_tables")
      .select("tablename")
      .eq("schemaname", "public")

    if (tableError) {
      console.error("Error fetching tables:", tableError)
    }

    const tables = tableData?.map((t) => t.tablename) || []

    // Check messages table
    let messagesTableData = { success: false, error: null, count: 0, sample: null }
    try {
      const { data: messagesCount } = await supabase.from("messages").select("*", { count: "exact" })
      const { data: messagesSample } = await supabase.from("messages").select("*").limit(1)

      messagesTableData = {
        success: true,
        error: null,
        count: messagesCount?.length || 0,
        sample: messagesSample?.[0] || null,
      }
    } catch (error) {
      messagesTableData.error = error instanceof Error ? error.message : String(error)
    }

    // Check discord_messages table
    let discordMessagesTableData = { success: false, error: null, count: 0, sample: null }
    try {
      const { data: discordMessagesCount } = await supabase.from("discord_messages").select("*", { count: "exact" })
      const { data: discordMessagesSample } = await supabase.from("discord_messages").select("*").limit(1)

      discordMessagesTableData = {
        success: true,
        error: null,
        count: discordMessagesCount?.length || 0,
        sample: discordMessagesSample?.[0] || null,
      }
    } catch (error) {
      discordMessagesTableData.error = error instanceof Error ? error.message : String(error)
    }

    return NextResponse.json({
      tables,
      messagesTableData,
      discordMessagesTableData,
    })
  } catch (error) {
    console.error("Error in debug endpoint:", error)
    return NextResponse.json(
      { error: "Failed to fetch debug information", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
