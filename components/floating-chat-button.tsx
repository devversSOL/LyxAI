"use client"

import { useState } from "react"
import { Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatBot from "@/components/chat-bot"

export default function FloatingChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-8 right-8 z-30 rounded-full h-14 w-14 bg-purple-900 hover:bg-purple-800 shadow-lg flex items-center justify-center"
      >
        <Bot className="h-6 w-6" />
      </Button>
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}
