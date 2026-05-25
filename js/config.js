window.SUPABASE_URL = "https://yscbwngotgbkytmzogol.supabase.co";
window.SUPABASE_KEY = "sb_publishable_XLX91DHrgXhALJUu6Vw6Gg_R74RtaEN";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzY2J3bmdvdGdia3l0bXpvZ29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NDU4NDcsImV4cCI6MjA5MjQyMTg0N30.LlcMGyk67971m0h6neH7crxAp5k0a0-IbOA7rCbW2H4";
if (typeof supabase === "undefined") {
  console.error("[Burguar Dreams] No se cargó el SDK de Supabase (CDN bloqueado o sin conexión).");
} else {
  window.db = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
}
let currentPropertyId = null;
