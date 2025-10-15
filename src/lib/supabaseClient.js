import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nrdetgsryanpfxkazcap.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZGV0Z3NyeWFucGZ4a2F6Y2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0ODk2NTcsImV4cCI6MjA3NjA2NTY1N30.v5mBtziIXoAcBJSdw9fFilDn5tcnyDB6pQNDWkNy2MQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
