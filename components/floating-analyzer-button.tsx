"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import ContractAnalyzerBot from "@/components/contract-analyzer-bot"

export default function FloatingAnalyzerButton() {
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false)

  const toggleAnalyzer = () => {
    setIsAnalyzerOpen(!isAnalyzerOpen)
  }

  return (
    <>
      <Button
        onClick={toggleAnalyzer}
        className="fixed bottom-8 left-8 z-30 rounded-full h-14 w-14 bg-purple-900 hover:bg-purple-800 shadow-lg flex items-center justify-center"
      >
        <Search className="h-6 w-6" />
      </Button>
      <ContractAnalyzerBot isOpen={isAnalyzerOpen} onClose={() => setIsAnalyzerOpen(false)} />
    </>
  )
}
