import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://nrvvexysitfnamxfxnsf.supabase.co'

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydnZleHlzaXRmbmFteGZ4bnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NDg2MDYsImV4cCI6MjEwNTMyNDYwNn0._vskJQpTDtG3oCbz_rn50YJp0d9bW7KdQz2iOw0qDeM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}
