function e(){const o={title:"color: #ea580c; font-size: 20px; font-weight: bold; padding: 10px 0;",step:"color: #f97316; font-size: 14px; font-weight: bold;",code:"background: #1e293b; color: #22d3ee; padding: 10px; border-radius: 4px; font-family: monospace;",info:"color: #64748b; font-size: 12px;",success:"color: #22c55e; font-size: 14px; font-weight: bold;"};console.log("%c⚠️ DATABASE MIGRATION REQUIRED",o.title),console.log("%cYour database is missing required columns for date tracking.",o.info),console.log(""),console.log("%cSTEP 1: Copy this SQL ↓",o.step),console.log("%c"+`
ALTER TABLE user_book_status
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS finish_date DATE;

CREATE INDEX IF NOT EXISTS idx_user_book_status_dates 
ON user_book_status(start_date, finish_date);
  `.trim(),o.code),console.log(""),console.log("%cSTEP 2: Run in Supabase",o.step),console.log("1. Go to: https://supabase.com/dashboard/project/_/sql"),console.log('2. Click "New Query"'),console.log("3. Paste the SQL above"),console.log('4. Click "Run"'),console.log(""),console.log("%c✅ After running, refresh this page!",o.success),console.log(""),console.log("%cOR just follow the orange banner at the top of the app! 🎯",o.info)}export{e as logMigrationInstructions};
