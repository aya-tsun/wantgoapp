import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Safari ITP 対策: 本番では Cloudflare Pages Functions 経由でプロキシ
// createClient には本物の Supabase URL を渡し（URL バリデーション通過のため）、
// カスタム fetch でリクエストをプロキシ経由にルーティングする
const customFetch = import.meta.env.DEV
  ? undefined
  : (url, options) => {
      const proxyUrl = String(url).replace(supabaseUrl, `${location.origin}/api/supabase`)
      return fetch(proxyUrl, options)
    }

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: customFetch },
})
