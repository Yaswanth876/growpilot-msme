import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env file');
}

// Use service key for server-side operations (has admin privileges)
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('✅ Supabase connected:', supabaseUrl);

export default supabase;
