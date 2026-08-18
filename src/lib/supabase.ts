import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

// Cliente nulo cuando faltan las variables: la landing sigue funcionando sin backend.
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null
