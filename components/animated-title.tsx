"use client"

import { useState, useEffect } from "react"

const words = [
  { text: "Blockchain", color: "#8b5cf6" }, // Purple
  { text: "Wallets", color: "#06b6d4" }, // Cyan
  { text: "Memecoins", color: "#3b82f6" }, // Blue
]

export default function AnimatedTitle() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)

      // After fade out animation (300ms), change word
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
        setIsAnimating(false)
      }, 300)
    }, 2600) // 2s display + 300ms out + 300ms in

    return () => clearInterval(interval)
  }, [])

  return (
    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight mb-4 text-white leading-tight">
      <span className="inline-block relative overflow-hidden">
        <span
          className={`inline-block transition-all duration-300 ease-in-out ${
            isAnimating ? "opacity-0 transform -translate-y-8" : "opacity-100 transform translate-y-0"
          }`}
          style={{
            color: words[currentWordIndex].color,
          }}
        >
          {words[currentWordIndex].text}
        </span>
      </span>{" "}
      insight
      <br />
      with precision
    </h1>
  )
}
