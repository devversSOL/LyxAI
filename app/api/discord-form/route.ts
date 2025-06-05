import { NextResponse } from "next/server"
import { storeDiscordMessage } from "@/app/actions/discord-actions"

export async function POST(request: Request) {
  console.log("POST request received at /api/discord-form")

  try {
    // Parse the JSON body
    const data = await request.json()
    console.log("Received data:", JSON.stringify(data, null, 2))

    // Create a FormData object
    const formData = new FormData()
    formData.append("username", data.username || "Unknown User")
    formData.append("content", data.content || "")
    formData.append("attachments", JSON.stringify(data.attachments || []))
    formData.append("embeds", JSON.stringify(data.embeds || []))

    // Call the server action
    const result = await storeDiscordMessage(formData)
    console.log("Server action result:", result)

    // Return the result
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing form:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error processing form",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
