"use client"

import ContractAnalyzerBot from "@/components/contract-analyzer-bot"

export default function ContractAnalyzerPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8">Token Contract Analyzer</h1>
        <ContractAnalyzerBot isOpen={true} onClose={() => {}} />
      </div>
    </div>
  )
}
