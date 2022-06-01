const { createClient } = require('@supabase/supabase-js');

const options = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, options);

module.exports = {supabase}
