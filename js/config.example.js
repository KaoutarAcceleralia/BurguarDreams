/* Copy to js/config.js or run: python scripts/generate_config.py */
window.SUPABASE_URL = "https://your-project.supabase.co";
window.SUPABASE_KEY = "your_publishable_key_here";
if (typeof supabase === "undefined") {
  console.error("[Burguar Dreams] No se cargó el SDK de Supabase (CDN bloqueado o sin conexión).");
} else {
  window.db = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
}
let currentPropertyId = null;
