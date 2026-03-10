export async function onRequest(context) {
  const { request, env, params } = context

  const supabaseUrl = env.VITE_SUPABASE_URL
  if (!supabaseUrl) {
    return new Response('Supabase URL not configured', { status: 500 })
  }

  const path = params.path ? params.path.join('/') : ''
  const url = new URL(request.url)
  const targetUrl = `${supabaseUrl}/${path}${url.search}`

  const headers = new Headers()
  for (const [key, value] of request.headers.entries()) {
    if (key.toLowerCase() !== 'host') {
      headers.set(key, value)
    }
  }

  const proxyResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? null : request.body,
  })

  return new Response(proxyResponse.body, {
    status: proxyResponse.status,
    statusText: proxyResponse.statusText,
    headers: proxyResponse.headers,
  })
}
