import { redirect } from "next/navigation"
import { getAllDocs } from "@/lib/docs"

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

  // Redirect to the new TSX-based documentation pages
  redirect(`/docs/${slug}`)

  // The rest of the code is not needed after the redirect
}
