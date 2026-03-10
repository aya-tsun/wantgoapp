import { createClient } from '@supabase/supabase-js'

// 開発環境は Supabase に直接接続、本番は Cloudflare Pages Functions 経由でプロキシ
// （Safari の ITP によるクロスサイトブロックを回避するため）
const supabaseUrl = import.meta.env.DEV
  ? import.meta.env.VITE_SUPABASE_URL
  : `${location.origin}/api/supabase`
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
