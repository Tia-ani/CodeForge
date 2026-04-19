# Database Fix: "User or Problem not found" on Submit

## Problem

When clicking the **Submit** button, users see:
```
❌ Error: User or Problem not found
Test Cases: 0/? passed
Runtime: 0.0 ms
```

## Root Cause

The backend was configured with `sequelize.sync({ force: true })`, which:
1. **Drops all tables** on every server restart
2. **Recreates tables** from scratch
3. **Reseeds data** with new IDs

### What This Means

If you:
1. Log in → Get JWT token with `userId: 1`
2. Server restarts → Database wiped
3. Database reseeded → New user created with potentially different ID
4. Try to submit → JWT token has old `userId` that no longer exists

**Result**: "User or Problem not found" error

## Solution

Changed database sync mode from `force: true` to `force: false, alter: true`:

```typescript
// BEFORE (❌ Problematic)
sequelize.sync({ force: true })  // Drops tables on every restart

// AFTER (✅ Fixed)
sequelize.sync({ force: false, alter: true })  // Preserves data, updates schema
```

### What This Does

- `force: false` - **Preserves existing data** (doesn't drop tables)
- `alter: true` - **Updates schema** if models change (adds/removes columns)

## Changes Made

### 1. `backend/src/index.ts`
- ✅ Changed `force: true` to `force: false, alter: true`
- ✅ Added better logging for database seeding
- ✅ Improved seed data messages

### 2. `backend/src/services/SubmissionService.ts`
- ✅ Added debug logging to identify which lookup fails
- ✅ Better error messages (shows specific ID that failed)

### 3. `backend/reset-db.js` (NEW)
- ✅ Script to manually reset database when needed
- ✅ Deletes SQLite file
- ✅ Provides instructions for restart

### 4. `backend/package.json`
- ✅ Added `npm run reset-db` script

## How to Fix Right Now

### Option 1: Restart Backend (Recommended)

Since the code is now fixed, just restart the backend:

```bash
cd backend
npm run dev
```

The database will be preserved and your login will work.

### Option 2: Reset Database & Re-login

If you want a fresh database:

```bash
cd backend
npm run reset-db
npm run dev
```

Then in the frontend:
1. **Log out** (to clear old JWT token)
2. **Log in again** with: `anishka@codeforge.com` / `user123`
3. Try submitting code

### Option 3: Clear Browser Storage

If the backend is already running with the fix:

1. Open browser DevTools (F12)
2. Go to **Application** tab
3. Click **Local Storage** → `http://localhost:5173`
4. Delete `codeforge_token`
5. Refresh page and log in again

## Testing the Fix

### Test 1: Submit Code
1. Navigate to any problem (e.g., Two Sum)
2. Write a solution:
   ```python
   class Solution:
       def solve(self, nums, target):
           seen = {}
           for i in range(len(nums)):
               complement = target - nums[i]
               if complement in seen:
                   return [seen[complement], i]
               seen[nums[i]] = i
           return []
   ```
3. Click **Submit**
4. Should see: ✅ **Accepted** or specific test case failure

### Test 2: Run Custom Test
1. Go to **Testcase** tab
2. Enter input:
   ```
   [2,7,11,15]
   9
   ```
3. Click **Run**
4. Should see output: `[0, 1]`

### Test 3: Server Restart Persistence
1. Submit a problem (should work)
2. Restart backend server
3. Submit another problem (should still work - no re-login needed)

## Debug Logging

The fix includes debug logging. Check backend console for:

```
[DEBUG] processSubmission called with: { userId: 1, problemId: 1, language: 'python' }
[DEBUG] User lookup result: Found user 1
[DEBUG] Problem lookup result: Found problem 1
[DEBUG] Found test cases: 3
```

If you see:
```
[DEBUG] User lookup result: User not found
```

Then the JWT token has an invalid `userId`. Solution: Log out and log in again.

## Why This Happened

### Development vs Production

- **Development**: `force: true` is useful for rapid schema changes
- **Production**: `force: false` is required to preserve user data

### The Fix

We're now using `alter: true` which gives us the best of both worlds:
- ✅ Preserves data (no drops)
- ✅ Updates schema automatically
- ✅ Safe for development and production

## When to Reset Database

You should manually reset the database when:

1. **Schema changes significantly** (new tables, major refactoring)
2. **Seed data needs updating** (new problems, changed test cases)
3. **Database corruption** (rare, but possible)
4. **Testing from scratch** (clean slate for testing)

### How to Reset

```bash
cd backend
npm run reset-db
npm run dev
```

Then log in again in the frontend.

## Additional Improvements

### Better Error Messages

Before:
```
❌ Error: User or Problem not found
```

After:
```
❌ Error: User not found with ID: 123
```
or
```
❌ Error: Problem not found with ID: 456
```

This makes debugging much easier.

### Logging

Added comprehensive logging:
- Database sync status
- Seed data creation
- User/problem lookups
- Test case counts

## Prevention

To prevent this issue in the future:

1. ✅ **Never use `force: true` in production**
2. ✅ **Use migrations for schema changes** (future improvement)
3. ✅ **Validate JWT tokens properly** (already done)
4. ✅ **Handle database errors gracefully** (improved)

## Summary

### The Problem
- Database was wiped on every restart
- JWT tokens became invalid
- Users couldn't submit code

### The Solution
- Changed to `force: false, alter: true`
- Data persists across restarts
- JWT tokens remain valid
- Added reset script for manual resets

### What to Do Now
1. Restart backend: `npm run dev`
2. If still broken: `npm run reset-db` then `npm run dev`
3. Log out and log in again in frontend
4. Test submitting code ✅

## Files Modified

- ✅ `backend/src/index.ts` - Database sync mode
- ✅ `backend/src/services/SubmissionService.ts` - Debug logging
- ✅ `backend/reset-db.js` - Reset script (NEW)
- ✅ `backend/package.json` - Added reset-db script

The fix is complete and ready to test! 🚀
