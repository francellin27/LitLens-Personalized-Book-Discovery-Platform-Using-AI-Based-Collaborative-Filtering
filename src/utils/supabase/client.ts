import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';
import type { Database } from './types';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient<Database>(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
