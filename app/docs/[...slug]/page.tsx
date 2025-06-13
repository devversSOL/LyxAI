import { notFound } from "next/navigation"
import { getAllDocs, getDocBySlug } from "@/lib/docs"
import { DocPageTemplate } from "@/components/doc-page-template"

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
  const slug = params.slug?.join("/") || ""

  // Instead of redirecting, let's try to fetch and render the doc
  const doc = await getDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  return <DocPageTemplate doc={doc} />
}
