// Cloudflare Pages Function - Post Reactions with IP rate limiting
// Stores reaction counts in Cloudflare KV and limits claps per IP per post

interface Env {
  REACTIONS_KV: {
    get(
      key: string,
    ): Promise<string | null>
    put(
      key: string,
      value: string,
      options?: { expirationTtl?: number },
    ): Promise<void>
  }
}

const VALID_REACTIONS = ['clap'] as const
type ReactionKey = (typeof VALID_REACTIONS)[number]
type ReactionData = Partial<Record<ReactionKey, number>>
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60 * 12 // 12 hours
const RATE_LIMIT_MAX_ACTIONS = 1 // per IP per post per window

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const isValidReactionKey = (value: unknown): value is ReactionKey =>
  typeof value === 'string' && VALID_REACTIONS.includes(value as ReactionKey)

const jsonResponse = (
  body: Record<string, unknown>,
  status = 200,
  extraHeaders: Record<string, string> = {},
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...extraHeaders,
    },
  })

const getClientIp = (request: Request): string | null => {
  const cfIp = request.headers.get('CF-Connecting-IP')
  if (cfIp) return cfIp

  const forwardedFor = request.headers.get('X-Forwarded-For')
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || null

  return null
}

/**
 * GET /api/reactions/[postId]
 * Fetch reaction counts for a post
 */
export const onRequestGet = async ({
  params,
  env,
}: {
  params: { postId: string }
  env: Env
}) => {
  try {
    const { postId } = params

    if (!postId) {
      return jsonResponse({ error: 'Post ID is required' }, 400)
    }

    const stored = await env.REACTIONS_KV.get(`reactions:${postId}`)
    const reactions: ReactionData = stored ? JSON.parse(stored) : {}

    return jsonResponse(
      { reactions },
      200,
      { 'Cache-Control': 'public, max-age=60' }, // Cache for 1 minute
    )
  } catch (error) {
    console.error('Error fetching reactions:', error)
    return jsonResponse(
      {
        error: 'Failed to fetch reactions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    )
  }
}

/**
 * POST /api/reactions/[postId]
 * Increment a reaction count with IP-based rate limiting
 */
export const onRequestPost = async ({
  params,
  request,
  env,
}: {
  params: { postId: string }
  request: Request
  env: Env
}) => {
  try {
    const { postId } = params
    const body = await request.json()
    const reactionKey = body?.reactionKey

    if (!postId) {
      return jsonResponse({ error: 'Post ID is required' }, 400)
    }

    if (!isValidReactionKey(reactionKey)) {
      return jsonResponse({ error: 'Invalid reaction key' }, 400)
    }

    const clientIp = getClientIp(request)
    if (!clientIp) {
      return jsonResponse(
        { error: 'Unable to determine client IP for rate limiting' },
        400,
      )
    }

    const rateLimitKey = `ratelimit:${postId}:${clientIp}`
    const rateLimitEntry = await env.REACTIONS_KV.get(rateLimitKey)

    // Deny if already reacted within the window
    if (rateLimitEntry) {
      const stored = await env.REACTIONS_KV.get(`reactions:${postId}`)
      const reactions: ReactionData = stored ? JSON.parse(stored) : {}

      return jsonResponse(
        {
          error: 'Rate limit exceeded. Please try again later.',
          reactions,
          count: reactions[reactionKey] || 0,
        },
        429,
        { 'Retry-After': RATE_LIMIT_WINDOW_SECONDS.toString() },
      )
    }

    // Get current reactions
    const stored = await env.REACTIONS_KV.get(`reactions:${postId}`)
    const reactions: ReactionData = stored ? JSON.parse(stored) : {}

    // Increment reaction count
    if (!reactions[reactionKey]) {
      reactions[reactionKey] = 0
    }
    reactions[reactionKey] += 1

    // Save updated reactions
    await env.REACTIONS_KV.put(
      `reactions:${postId}`,
      JSON.stringify(reactions),
    )

    // Record rate limit entry for this IP and post
    await env.REACTIONS_KV.put(
      rateLimitKey,
      JSON.stringify({
        count: RATE_LIMIT_MAX_ACTIONS,
        timestamp: Date.now(),
      }),
      { expirationTtl: RATE_LIMIT_WINDOW_SECONDS },
    )

    return jsonResponse({
      success: true,
      reactions,
      count: reactions[reactionKey],
    })
  } catch (error) {
    console.error('Error updating reactions:', error)
    return jsonResponse(
      {
        error: 'Failed to update reactions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    )
  }
}

/**
 * OPTIONS /api/reactions/[postId]
 * Handle CORS preflight
 */
export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      'Access-Control-Max-Age': '86400',
    },
  })
}
