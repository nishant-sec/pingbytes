// Legacy RSS endpoint: redirect to Atom feed
export async function GET() {
  return new Response(null, {
    status: 308,
    headers: {
      Location: '/atom.xml',
    },
  })
}
