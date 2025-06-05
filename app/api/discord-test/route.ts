import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Received data:", data)

    return NextResponse.json({
      success: true,
      message: "Test endpoint working",
      receivedData: data,
    })
  } catch (error) {
    console.error("Error in test endpoint:", error)
    return NextResponse.json({ error: "Error processing request" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "Test endpoint is working (GET)" })
}
