/* Clave publishable de Supabase (cliente). En local: python3 scripts/generate_config.py */
const SUPABASE_URL = "https://yscbwngotgbkytmzogol.supabase.co";
const SUPABASE_KEY = "sb_publishable_XLX91DHrgXhALJUu6Vw6Gg_R74RtaEN";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let currentPropertyId = null;
