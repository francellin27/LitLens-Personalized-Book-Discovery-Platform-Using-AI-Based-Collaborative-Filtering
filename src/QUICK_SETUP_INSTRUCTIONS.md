# Quick Setup Instructions for LitLens

## Current Issue: Email Signups are Disabled

You're seeing the error "Email signups are disabled" because email authentication needs to be enabled in your Supabase project.

## Fix in 3 Steps (Takes 2 minutes):

### Step 1: Enable Email Authentication
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/nrdetgsryanpfxkazcap
2. Click on **Authentication** in the left sidebar
3. Click on **Providers**
4. Find **Email** in the list of providers
5. Make sure the toggle is **ON** (enabled)
6. Click **Save** if you made changes

### Step 2: Disable Email Confirmation (For Easy Testing)
1. Still in **Authentication** > **Providers**
2. Click on the **Email** row to expand its settings
3. Find "Confirm email" option
4. Toggle it **OFF**
5. Click **Save**

*This allows users to sign up and immediately log in without needing to verify their email address.*

### Step 3: Run Database Migrations (If Not Done Already)

You need to create the database tables for user profiles and other data.

1. In your Supabase Dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy and paste the entire contents of `/supabase/migrations/001_initial_schema.sql.tsx` from your project
4. Click **Run** 
5. Wait for it to complete (should take a few seconds)
6. If successful, run `/supabase/migrations/002_seed_data.sql.tsx` the same way to add sample books

## After Setup:

✅ Users can sign up with email/password  
✅ Profiles are automatically created  
✅ Users can log in immediately  
✅ Sample books will be available  

## Test Your Setup:

1. Try signing up with a new email address
2. You should be logged in automatically
3. Your profile should be created in the database

## Still Having Issues?

### Check if migrations ran successfully:
1. Go to **Table Editor** in Supabase Dashboard
2. You should see tables like: `profiles`, `books`, `reviews`, etc.
3. If not, the migrations didn't run - go back to Step 3

### Check email provider:
1. Go to **Authentication** > **Providers**
2. Email should show as "Enabled" with a green indicator

### Check for errors:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try signing up again
4. Look for any error messages - they will give specific details

## Alternative: Use Demo Accounts

While you're setting up Supabase, you can use the demo login buttons:
- **Demo as Reader** - Regular user account
- **Demo as Admin** - Admin account with full access

These will work without any Supabase configuration.

---

**Need more help?** Check the full setup guide in `/SUPABASE_SETUP_GUIDE.md`
