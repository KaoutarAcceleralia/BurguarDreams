/* Copy to js/config.js or run: python scripts/generate_config.py */
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_KEY = "your_publishable_key_here";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let currentPropertyId = null;
