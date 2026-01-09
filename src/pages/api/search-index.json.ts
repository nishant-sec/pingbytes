import type { APIRoute } from 'astro'
import { getAllPosts, getAllWikiPosts, getAllProjects } from '@/lib/data-utils'

export const prerender = true

export const GET: APIRoute = async () => {
  try {
    const [posts, wikiPosts, projects] = await Promise.all([
      getAllPosts(),
      getAllWikiPosts(),
      getAllProjects(),
    ])

    const searchIndex = [
      ...posts.map((post) => {
        // Extract text content from HTML body (remove tags)
        const htmlContent = (post as { body?: string }).body || ''
        const textContent = htmlContent
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()

        return {
          type: 'blog' as const,
          id: post.id || '',
          title: post.data.title || '',
          description: post.data.description || '',
          date: post.data.date?.toISOString() || new Date().toISOString(),
          tags: post.data.tags || [],
          authors: post.data.authors || [],
          url: `/blog/${post.id}`,
          content: textContent,
        }
      }),
      ...wikiPosts.map((post) => {
        const htmlContent = (post as { body?: string }).body || ''
        const textContent = htmlContent
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()

        return {
          type: 'wiki' as const,
          id: post.id || '',
          title: post.data.title || '',
          description: post.data.description || '',
          date: post.data.date?.toISOString() || new Date().toISOString(),
          tags: post.data.tags || [],
          authors: post.data.authors || [],
          url: `/resources/${post.id}`,
          content: textContent,
        }
      }),
      ...projects.map((project) => {
        const htmlContent = (project as { body?: string }).body || ''
        const textContent = htmlContent
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()

        return {
          type: 'project' as const,
          id: project.id || '',
          title: project.data.name || '',
          description: project.data.description || '',
          date:
            project.data.startDate?.toISOString() ||
            project.data.endDate?.toISOString() ||
            new Date().toISOString(),
          tags: project.data.tags || [],
          authors: [],
          url: project.data.link || '/projects',
          content: textContent,
        }
      }),
    ]

    return new Response(JSON.stringify(searchIndex), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error generating search index:', error)
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}
