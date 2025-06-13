import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import remarkGfm from "remark-gfm"

const docsDirectory = path.join(process.cwd(), "docs")

export interface DocFile {
  slug: string
  title: string
  content: string
  excerpt?: string
  category?: string
  hasMermaid?: boolean
}

export async function getDocBySlug(slug: string): Promise<DocFile | null> {
  try {
    const fullPath = path.join(docsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }
    
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    // Check if content has Mermaid diagrams
    const hasMermaid = content.includes('```mermaid')

    // Process Mermaid diagrams - convert to component syntax for client-side rendering
    let processedContent = content.replace(
      /```mermaid\n([\s\S]*?)\n```/g,
      (match, chart) => {
        const chartId = Math.random().toString(36).substr(2, 9)
        return `<div class="mermaid-wrapper" data-chart-id="${chartId}">
          <div class="mermaid-chart">${chart.trim()}</div>
        </div>`
      }
    )

    const processedMarkdown = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(processedContent)

    const contentHtml = processedMarkdown.toString()

    return {
      slug,
      title: data.title || slug.split('/').pop() || 'Untitled',
      content: contentHtml,
      excerpt: data.excerpt,
      category: data.category || slug.split('/')[0] || 'general',
      hasMermaid,
    }
  } catch (error) {
    console.error(`Error processing doc ${slug}:`, error)
    return null
  }
}

export function getAllDocs(): DocFile[] {
  if (!fs.existsSync(docsDirectory)) {
    return []
  }

  const getAllMarkdownFiles = (dir: string, basePath = ""): DocFile[] => {
    const files: DocFile[] = []
    
    try {
      const items = fs.readdirSync(dir)

      for (const item of items) {
        const fullPath = path.join(dir, item)
        const relativePath = path.join(basePath, item)

        if (fs.statSync(fullPath).isDirectory()) {
          files.push(...getAllMarkdownFiles(fullPath, relativePath))
        } else if (item.endsWith(".md")) {
          const slug = relativePath.replace(/\.md$/, "").replace(/\\/g, "/")
          
          try {
            const fileContents = fs.readFileSync(fullPath, "utf8")
            const { data, content } = matter(fileContents)
            const hasMermaid = content.includes('```mermaid')

            files.push({
              slug,
              title: data.title || slug.split('/').pop() || 'Untitled',
              content: "",
              excerpt: data.excerpt,
              category: data.category || slug.split('/')[0] || 'general',
              hasMermaid,
            })
          } catch (fileError) {
            console.error(`Error reading file ${fullPath}:`, fileError)
          }
        }
      }
    } catch (dirError) {
      console.error(`Error reading directory ${dir}:`, dirError)
    }

    return files
  }

  return getAllMarkdownFiles(docsDirectory)
}

export function getDocsByCategory() {
  const docs = getAllDocs()
  const categories: { [key: string]: DocFile[] } = {}

  docs.forEach((doc) => {
    const category = doc.category || "general"
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push(doc)
  })

  return categories
}
