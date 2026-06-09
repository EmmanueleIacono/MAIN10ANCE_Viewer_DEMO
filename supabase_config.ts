import {createClient} from '@supabase/supabase-js';

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false
  }
};

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '', options);

module.exports = {supabase};
