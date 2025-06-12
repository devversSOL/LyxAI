import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getDocBySlug, getAllDocs } from "@/lib/docs"
import MermaidRenderer from "@/components/mermaid-renderer"

interface DocPageProps {
  params: {
    slug: string[]
  }
}

export async function generateStaticParams() {
  const docs = getAllDocs()
  return docs.map((doc) => ({
    slug: doc.slug.split("/"),
  }))
}

export default async function DocPage({ params }: DocPageProps) {
  const slug = params.slug?.join("/") || "overview/platform-overview"
  const doc = await getDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/docs" className="hover:text-white">
            Documentation
          </Link>
          <ChevronRight size={14} />
          <span className="text-white">{doc.title}</span>
        </div>

        {/* Content */}
        <article className="prose prose-invert prose-purple max-w-none">
          <h1 className="text-4xl font-bold mb-6">{doc.title}</h1>

          {doc.hasMermaid ? (
            <MermaidRenderer content={doc.content} />
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: doc.content }}
              className="prose-headings:text-white prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-white prose-code:text-purple-300 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10"
            />
          )}
        </article>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <Link href="/docs" className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
            ← Back to Documentation
          </Link>
        </div>
      </div>
    </div>
  )
}
