import type React from "react"
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="docs-layout">{children}</div>
}
