# 🚨 Quick Fix: "User or Problem not found" Error

## The Problem
You're seeing this error when clicking Submit or Run:
```
❌ Error: User or Problem not found
```

## Why It Happens
Your JWT login token has an old user ID that doesn't exist in the database anymore (because the server restarted and wiped the database).

## ✅ Quick Fix (Choose One)

### Option 1: Log Out & Log In Again (FASTEST)

1. In the frontend, click **Logout**
2. Log in again with:
   - Email: `anishka@codeforge.com`
   - Password: `user123`
3. Try submitting code again ✅

### Option 2: Clear Browser Storage

1. Press **F12** (open DevTools)
2. Go to **Application** tab
3. Click **Local Storage** → `http://localhost:5173`
4. Find `codeforge_token` and delete it
5. Refresh the page
6. Log in again
7. Try submitting code again ✅

### Option 3: Reset Database (NUCLEAR OPTION)

If the above don't work:

```bash
cd backend
npm run reset-db
npm run dev
```

Then log in again in the frontend.

## What Was Fixed

The backend code has been updated so this won't happen again after server restarts. The database will now persist your login across restarts.

## Test It Works

After logging in again:

1. Go to any problem (e.g., Two Sum)
2. Write this code:
   ```python
   class Solution:
       def solve(self, nums, target):
           return [0, 1]
   ```
3. Click **Submit**
4. Should see results (even if wrong answer) ✅

## Still Not Working?

Check the backend console for debug messages:
```
[DEBUG] processSubmission called with: { userId: X, problemId: Y, language: 'python' }
[DEBUG] User lookup result: Found user X
[DEBUG] Problem lookup result: Found problem Y
```

If you see "User not found" or "Problem not found", you need to log out and log in again.

---

**TL;DR**: Log out, log in again, problem solved! 🎉
