import { NextResponse } from "next/server"
import { walletService } from "@/lib/wallet-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Address parameter is required" }, { status: 400 })
  }

  try {
    console.log(`Testing wallet lookup for address: ${address}`)

    // Test the wallet service
    const wallet = await walletService.getWalletByAddress(address)

    if (wallet) {
      console.log("Found wallet in database:", wallet)
      return NextResponse.json({
        success: true,
        found: true,
        wallet,
        message: "Wallet found in database",
      })
    } else {
      console.log("Wallet not found in database")
      return NextResponse.json({
        success: true,
        found: false,
        message: "Wallet not found in database",
      })
    }
  } catch (error: any) {
    console.error("Error testing wallet lookup:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error,
      },
      { status: 500 },
    )
  }
}
