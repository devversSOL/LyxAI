import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import FloatingChatButton from "@/components/floating-chat-button"
import FloatingAnalyzerButton from "@/components/floating-analyzer-button"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
})

export const metadata = {
  title: "LyxAI - Blockchain Insight With Precision",
  description: "AI-powered engine that delivers instant, data-driven answers to your wallet questions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <FloatingChatButton />
          <FloatingAnalyzerButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
