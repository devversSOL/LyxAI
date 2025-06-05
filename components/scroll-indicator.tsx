"use client"

import { useEffect, useState } from "react"

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-20">
      <div className="h-32 w-1 bg-white/10 rounded-full relative">
        <div className="absolute top-0 w-1 bg-purple-500 rounded-full" style={{ height: `${scrollProgress}%` }} />
      </div>
    </div>
  )
}
