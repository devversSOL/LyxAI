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

  // This is causing an infinite redirect loop
  // redirect(`/docs/${slug}`)

  // Instead, we should render the actual content or redirect to a specific page
  // Let's modify this to use the correct approach
  if (slug.includes("features") || slug.includes("getting-started") || slug.includes("technical")) {
    // These are handled by their dedicated pages, so we can redirect
    return redirect(`/docs/${slug}`)
  }

  // For other slugs, we should render content or show a not found page
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Documentation Not Found</h1>
      <p>The requested documentation page could not be found.</p>
      <div className="mt-4">
        <a href="/docs" className="text-purple-400 hover:text-purple-300">
          Return to Documentation Home
        </a>
      </div>
    </div>
  )
}
