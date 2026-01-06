import { getCollection, render, type CollectionEntry } from 'astro:content'
import { readingTime, calculateWordCountFromHtml } from '@/lib/utils'

export async function getAllAuthors(): Promise<CollectionEntry<'authors'>[]> {
  return await getCollection('authors')
}

export async function getAllPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog')
  return posts
    .filter((post) => !post.data.draft && !isSubpost(post.id))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export async function getAllPostsAndSubposts(): Promise<
  CollectionEntry<'blog'>[]
> {
  const posts = await getCollection('blog')
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export async function getAllProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects')
  return projects.sort((a, b) => {
    const dateA = a.data.startDate?.getTime() || 0
    const dateB = b.data.startDate?.getTime() || 0
    return dateB - dateA
  })
}

export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getAllPosts()
  return posts.reduce((acc, post) => {
    post.data.tags?.forEach((tag) => {
      acc.set(tag, (acc.get(tag) || 0) + 1)
    })
    return acc
  }, new Map<string, number>())
}

export async function getAdjacentPosts(currentId: string): Promise<{
  newer: CollectionEntry<'blog'> | null
  older: CollectionEntry<'blog'> | null
  parent: CollectionEntry<'blog'> | null
}> {
  const allPosts = await getAllPosts()

  if (isSubpost(currentId)) {
    const parentId = getParentId(currentId)
    const allPosts = await getAllPosts()
    const parent = allPosts.find((post) => post.id === parentId) || null

    const posts = await getCollection('blog')
    const subposts = posts
      .filter(
        (post) =>
          isSubpost(post.id) &&
          getParentId(post.id) === parentId &&
          !post.data.draft,
      )
      .sort((a, b) => {
        const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
        if (dateDiff !== 0) return dateDiff

        const orderA = a.data.order ?? 0
        const orderB = b.data.order ?? 0
        return orderA - orderB
      })

    const currentIndex = subposts.findIndex((post) => post.id === currentId)
    if (currentIndex === -1) {
      return { newer: null, older: null, parent }
    }

    return {
      newer:
        currentIndex < subposts.length - 1 ? subposts[currentIndex + 1] : null,
      older: currentIndex > 0 ? subposts[currentIndex - 1] : null,
      parent,
    }
  }

  const parentPosts = allPosts.filter((post) => !isSubpost(post.id))
  const currentIndex = parentPosts.findIndex((post) => post.id === currentId)

  if (currentIndex === -1) {
    return { newer: null, older: null, parent: null }
  }

  return {
    newer: currentIndex > 0 ? parentPosts[currentIndex - 1] : null,
    older:
      currentIndex < parentPosts.length - 1
        ? parentPosts[currentIndex + 1]
        : null,
    parent: null,
  }
}

export async function getPostsByAuthor(
  authorId: string,
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.data.authors?.includes(authorId))
}

export async function getPostsByTag(
  tag: string,
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.data.tags?.includes(tag))
}

export async function getRecentPosts(
  count: number,
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getAllPosts()
  return posts.slice(0, count)
}

export async function getRelatedPosts(
  currentPostId: string,
  limit: number = 3,
): Promise<CollectionEntry<'blog'>[]> {
  const allPosts = await getAllPosts()
  const currentPost = allPosts.find((post) => post.id === currentPostId)

  if (!currentPost || !currentPost.data.tags || currentPost.data.tags.length === 0) {
    // If no tags, return recent posts excluding current
    return allPosts.filter((post) => post.id !== currentPostId).slice(0, limit)
  }

  // Score posts based on tag overlap
  const scoredPosts = allPosts
    .filter((post) => post.id !== currentPostId)
    .map((post) => {
      const currentTags = new Set(currentPost.data.tags || [])
      const postTags = new Set(post.data.tags || [])
      
      // Count matching tags
      let score = 0
      postTags.forEach((tag) => {
        if (currentTags.has(tag)) {
          score += 1
        }
      })

      return { post, score }
    })
    .filter((item) => item.score > 0) // Only include posts with at least one matching tag
    .sort((a, b) => {
      // Sort by score (descending), then by date (descending)
      if (b.score !== a.score) {
        return b.score - a.score
      }
      return b.post.data.date.valueOf() - a.post.data.date.valueOf()
    })
    .slice(0, limit)
    .map((item) => item.post)

  // If we don't have enough related posts, fill with recent posts
  if (scoredPosts.length < limit) {
    const recentPosts = allPosts
      .filter(
        (post) =>
          post.id !== currentPostId &&
          !scoredPosts.some((related) => related.id === post.id),
      )
      .slice(0, limit - scoredPosts.length)
    return [...scoredPosts, ...recentPosts]
  }

  return scoredPosts
}

export async function getSortedTags(): Promise<
  { tag: string; count: number }[]
> {
  const tagCounts = await getAllTags()
  return [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      const countDiff = b.count - a.count
      return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag)
    })
}

export function getParentId(subpostId: string): string {
  return subpostId.split('/')[0]
}

export async function getSubpostsForParent(
  parentId: string,
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog')
  return posts
    .filter(
      (post) =>
        !post.data.draft &&
        isSubpost(post.id) &&
        getParentId(post.id) === parentId,
    )
    .sort((a, b) => {
      const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
      if (dateDiff !== 0) return dateDiff

      const orderA = a.data.order ?? 0
      const orderB = b.data.order ?? 0
      return orderA - orderB
    })
}

export function groupPostsByYear(
  posts: CollectionEntry<'blog'>[],
): Record<string, CollectionEntry<'blog'>[]> {
  return posts.reduce(
    (acc: Record<string, CollectionEntry<'blog'>[]>, post) => {
      const year = post.data.date.getFullYear().toString()
      ;(acc[year] ??= []).push(post)
      return acc
    },
    {},
  )
}

export async function hasSubposts(postId: string): Promise<boolean> {
  const subposts = await getSubpostsForParent(postId)
  return subposts.length > 0
}

export function isSubpost(postId: string): boolean {
  return postId.includes('/')
}

export async function getParentPost(
  subpostId: string,
): Promise<CollectionEntry<'blog'> | null> {
  if (!isSubpost(subpostId)) {
    return null
  }

  const parentId = getParentId(subpostId)
  const allPosts = await getAllPosts()
  return allPosts.find((post) => post.id === parentId) || null
}

export async function parseAuthors(authorIds: string[] = []) {
  if (!authorIds.length) return []

  const allAuthors = await getAllAuthors()
  const authorMap = new Map(allAuthors.map((author) => [author.id, author]))

  return authorIds.map((id) => {
    const author = authorMap.get(id)
    return {
      id,
      name: author?.data?.name || id,
      avatar: author?.data?.avatar || '/static/logo.png',
      isRegistered: !!author,
    }
  })
}

export async function getPostById(
  postId: string,
): Promise<CollectionEntry<'blog'> | null> {
  const allPosts = await getAllPostsAndSubposts()
  return allPosts.find((post) => post.id === postId) || null
}

export async function getSubpostCount(parentId: string): Promise<number> {
  const subposts = await getSubpostsForParent(parentId)
  return subposts.length
}

export async function getCombinedReadingTime(postId: string): Promise<string> {
  const post = await getPostById(postId)
  if (!post) return readingTime(0)

  let totalWords = calculateWordCountFromHtml(post.body)

  if (!isSubpost(postId)) {
    const subposts = await getSubpostsForParent(postId)
    for (const subpost of subposts) {
      totalWords += calculateWordCountFromHtml(subpost.body)
    }
  }

  return readingTime(totalWords)
}

export async function getPostReadingTime(postId: string): Promise<string> {
  const post = await getPostById(postId)
  if (!post) return readingTime(0)

  const wordCount = calculateWordCountFromHtml(post.body)
  return readingTime(wordCount)
}

export type TOCHeading = {
  slug: string
  text: string
  depth: number
  isSubpostTitle?: boolean
}

export type TOCSection = {
  type: 'parent' | 'subpost'
  title: string
  headings: TOCHeading[]
  subpostId?: string
}

export async function getTOCSections(postId: string): Promise<TOCSection[]> {
  const post = await getPostById(postId)
  if (!post) return []

  const parentId = isSubpost(postId) ? getParentId(postId) : postId
  const parentPost = isSubpost(postId) ? await getPostById(parentId) : post

  if (!parentPost) return []

  const sections: TOCSection[] = []

  const { headings: parentHeadings } = await render(parentPost)
  if (parentHeadings.length > 0) {
    sections.push({
      type: 'parent',
      title: 'Overview',
      headings: parentHeadings.map((heading) => ({
        slug: heading.slug,
        text: heading.text,
        depth: heading.depth,
      })),
    })
  }

  const subposts = await getSubpostsForParent(parentId)
  for (const subpost of subposts) {
    const { headings: subpostHeadings } = await render(subpost)
    if (subpostHeadings.length > 0) {
      sections.push({
        type: 'subpost',
        title: subpost.data.title,
        headings: subpostHeadings.map((heading, index) => ({
          slug: heading.slug,
          text: heading.text,
          depth: heading.depth,
          isSubpostTitle: index === 0,
        })),
        subpostId: subpost.id,
      })
    }
  }

  return sections
}

/* === WIKI DATA HELPERS === */

export async function getAllWikiPosts() {
  const posts = await getCollection('wiki')
  return posts
    .filter((post) => {
      return import.meta.env.PROD ? post.data.draft !== true : true
    })
    .sort((a, b) => {
      const orderA = a.data.order ?? 999
      const orderB = b.data.order ?? 999
      return orderA - orderB
    })
}

export type WikiNode = {
  id: string
  slug: string
  title: string
  children: WikiNode[]
  order: number
  isFolder: boolean
  hasActiveChild?: boolean
}

function findNode(nodes: WikiNode[], id: string): WikiNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    const child = findNode(node.children, id)
    if (child) return child
  }
  return null
}

export async function getWikiTree(rootPath: string = ''): Promise<WikiNode[]> {
  const allPosts = await getAllWikiPosts()

  // Filter posts that belong to the requested root folder
  const relevantPosts = rootPath
    ? allPosts.filter((post) => post.id.startsWith(rootPath + '/'))
    : allPosts

  const tree: WikiNode[] = []
  const map = new Map<string, WikiNode>()

  relevantPosts.forEach((post) => {
    // Remove the rootPath prefix for relative tree construction
    const relativeId = rootPath ? post.id.slice(rootPath.length + 1) : post.id
    const parts = relativeId.split('/')

    let currentPath = ''

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1

      // Reconstruct full ID for linking
      const fullId = rootPath
        ? `${rootPath}/${currentPath ? currentPath + '/' : ''}${part}`
        : `${currentPath ? currentPath + '/' : ''}${part}`

      currentPath = currentPath ? `${currentPath}/${part}` : part
      const mapKey = currentPath

      if (!map.has(mapKey)) {
        const node: WikiNode = {
          id: fullId,
          slug: fullId,
          title: isLast
            ? post.data.title
            : part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
          children: [],
          order: isLast ? post.data.order ?? 999 : 999,
          isFolder: !isLast,
        }

        map.set(mapKey, node)

        const parentPath = parts.slice(0, index).join('/')
        if (parentPath) {
          const parent = map.get(parentPath)
          if (parent) {
            parent.children.push(node)
            parent.isFolder = true
          }
        } else {
          tree.push(node)
        }
      } else if (isLast) {
        const node = map.get(mapKey)!
        node.title = post.data.title
        node.order = post.data.order ?? 999
      }
    })
  })

  const sortNodes = (nodes: WikiNode[]) => {
    nodes.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order
      return a.title.localeCompare(b.title)
    })
    nodes.forEach((node) => sortNodes(node.children))
  }

  sortNodes(tree)
  return tree
}

export function setActiveFlags(
  nodes: WikiNode[],
  currentId: string,
): boolean {
  let hasActive = false
  for (const node of nodes) {
    const isActive = node.id === currentId
    const childActive = setActiveFlags(node.children, currentId)
    if (isActive || childActive) {
      node.hasActiveChild = true
      hasActive = true
    }
  }
  return hasActive
}

export function getWikiNodeById(nodes: WikiNode[], id: string): WikiNode | null {
  return findNode(nodes, id)
}

export function getWikiChildren(nodes: WikiNode[], id: string): WikiNode[] {
  const node = getWikiNodeById(nodes, id)
  return node?.children ?? []
}
