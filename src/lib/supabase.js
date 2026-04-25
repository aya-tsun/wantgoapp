import { createClient } from '@supabase/supabase-js'

// Supabase URL はパブリックな値なので直接記述（URL バリデーション通過のため）
const SUPABASE_URL = 'https://sudnoajwhrtotuyfsule.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Safari ITP 対策: 本番では Cloudflare Pages Functions 経由でプロキシ
// createClient には本物の URL を渡しつつ、カスタム fetch でリクエストをプロキシにルーティング
const customFetch = import.meta.env.DEV
  ? undefined
  : (url, options) => {
      const proxyUrl = String(url).replace(SUPABASE_URL, `${location.origin}/api/supabase`)
      return fetch(proxyUrl, options)
    }

export const supabase = createClient(SUPABASE_URL, supabaseAnonKey, {
  global: { fetch: customFetch },
})
