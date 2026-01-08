import type { APIContext } from 'astro'
import { SITE } from '@/consts'
import { getAllPosts } from '@/lib/data-utils'

const escapeXml = (value: string = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export async function GET(context: APIContext) {
  try {
    const posts = await getAllPosts()
    const siteUrl = (context.site?.toString() ?? SITE.href).replace(/\/$/, '')
    const updated =
      posts[0]?.data.date?.toISOString() || new Date().toISOString()

    const entries = posts
      .map((post) => {
        const link = `${siteUrl}/blog/${post.id}/`
        const title = escapeXml(post.data.title || link)
        const description = post.data.description
          ? `<summary>${escapeXml(post.data.description)}</summary>`
          : ''
        const published = post.data.date?.toISOString()
        const updatedDate = published || new Date().toISOString()

        return `
  <entry>
    <title>${title}</title>
    <link href="${link}" rel="alternate" />
    <id>${link}</id>
    <updated>${updatedDate}</updated>
    ${description}
  </entry>`
      })
      .join('\n')

    const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE.title)}</title>
  <id>${siteUrl}/</id>
  <link href="${siteUrl}/atom.xml" rel="self" />
  <link href="${siteUrl}/" rel="alternate" />
  <updated>${updated}</updated>
  <author><name>${escapeXml(SITE.author || 'Author')}</name></author>
${entries}
</feed>`

    return new Response(atom, {
      status: 200,
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Error generating Atom feed:', error)
    return new Response('Error generating Atom feed', { status: 500 })
  }
}
