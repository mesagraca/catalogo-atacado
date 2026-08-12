import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const isSupabaseReady = Boolean(url && key);
export const supabase = isSupabaseReady ? createClient(url!, key!) : null;
