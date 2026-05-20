/* Clave publishable de Supabase (cliente). En local: python3 scripts/generate_config.py */
window.SUPABASE_URL = "https://yscbwngotgbkytmzogol.supabase.co";
window.SUPABASE_KEY = "sb_publishable_XLX91DHrgXhALJUu6Vw6Gg_R74RtaEN";
if (typeof supabase === "undefined") {
  console.error("[Burguar Dreams] No se cargó el SDK de Supabase (CDN bloqueado o sin conexión).");
} else {
  window.db = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
}
let currentPropertyId = null;
