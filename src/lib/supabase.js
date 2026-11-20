const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// true jika .env sudah diisi — jika belum, komponen menampilkan pesan, bukan crash
export const supabaseConfigured = Boolean(url && key)

// Library Supabase (±150 KB) baru diunduh saat pertama kali dibutuhkan,
// sehingga tidak memperlambat tampilan awal situs.
let clientPromise
export function getSupabase() {
  if (!supabaseConfigured) return Promise.resolve(null)
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(url, key))
  return clientPromise
}

export const AVATAR_BUCKET = 'comment-avatars'
