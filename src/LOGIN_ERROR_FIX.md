# 🔧 LOGIN ERROR FIX

## ❌ Error: "AuthApiError: Invalid login credentials"

**Why?** No user accounts exist in your Supabase database.

---

## ✅ FIX IT NOW (3 Steps - 2 Minutes)

### Step 1: Open Supabase SQL Editor
👉 Click here: **https://supabase.com/dashboard/project/nrdetgsryanpfxkazcap/sql/new**

### Step 2: Run the SQL
1. Open the file: **`RUN_THIS_TO_FIX_LOGIN.sql`** (in your project root)
2. Copy **ALL** the contents
3. Paste into Supabase SQL Editor
4. Click **"Run"** button

### Step 3: Login
Use these credentials:

```
Email:    test@example.com
Password: password123
```

**OR**

```
Email:    admin@example.com
Password: admin123
```

---

## 🎯 That's It!

The SQL creates:
- ✅ Regular user account (test@example.com)
- ✅ Admin user account (admin@example.com)
- ✅ Both profiles in the database
- ✅ Ready to login immediately

---

## 📱 What You'll See

After fixing, the login error disappears and you can:
- Browse all 60 books
- Create reviews
- Manage your profile
- Access reading lists
- Admin can access admin panel

---

## 🆕 Alternative: Create Your Own Account

Don't want test accounts? Create your own:

1. **Enable Email Provider** (one-time):
   - Go to: https://supabase.com/dashboard/project/nrdetgsryanpfxkazcap/auth/providers
   - Toggle ON "Email" provider
   - Toggle OFF "Confirm email"
   - Save

2. **Sign Up in App**:
   - Click "Sign Up" tab
   - Fill in your details
   - Click "Sign Up"
   - You're in!

---

## 💡 Pro Tip

The Login page now shows helpful instructions automatically when you enter wrong credentials. It will guide you to this file!

---

## ✅ Verify It Worked

Check in Supabase:
- **Users**: https://supabase.com/dashboard/project/nrdetgsryanpfxkazcap/auth/users
  - Should see your test users
- **Profiles**: https://supabase.com/dashboard/project/nrdetgsryanpfxkazcap/editor
  - Click `profiles` table
  - Should see matching profile records

---

## ❓ Still Having Issues?

See the detailed guide: `FIX_LOGIN_ERROR.md`
