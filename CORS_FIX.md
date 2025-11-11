# CORS Error Fix Guide

If you're getting CORS errors when calling Firebase Cloud Functions, follow these steps:

## Issue
The error: `Access to fetch at 'https://...cloudfunctions.net/...' from origin 'http://localhost:3001' has been blocked by CORS policy`

## Solution

### Option 1: Use Firebase `onCall` Functions (Recommended - Already Implemented)

The functions are already using `functions.https.onCall()` which automatically handles CORS. However, you need to:

1. **Deploy the functions:**
   ```bash
   cd functions
   npm install
   cd ..
   firebase deploy --only functions
   ```

2. **Ensure user is authenticated:**
   - `onCall` functions require Firebase Authentication
   - Make sure users are logged in before making payments
   - If you're not using Firebase Auth, see Option 2 below

### Option 2: Use `onRequest` with CORS (If not using Firebase Auth)

If you're not using Firebase Authentication, you'll need to modify the functions to use `onRequest` with CORS headers.

1. **Install CORS package:**
   ```bash
   cd functions
   npm install cors
   ```

2. **Update functions/index.js** to use `onRequest` instead of `onCall` (not recommended if you have auth)

### Option 3: Use Backend API Fallback (Current Implementation)

The code already has a fallback to your backend API. If Cloud Functions fail, it will automatically try the backend API at `https://localhost:7240`.

## Quick Fix Steps

1. **Check if functions are deployed:**
   ```bash
   firebase functions:list
   ```

2. **If not deployed, deploy them:**
   ```bash
   firebase deploy --only functions
   ```

3. **Check Firebase Authentication:**
   - Make sure users are authenticated
   - Check browser console for auth errors

4. **Check function logs:**
   ```bash
   firebase functions:log
   ```

5. **Verify environment variables:**
   ```bash
   firebase functions:config:get
   ```

## Testing

After deploying, test the function:
```bash
# Test locally (if using emulator)
firebase emulators:start --only functions

# Or test deployed function
curl -X POST https://us-central1-level-grit-messagener.cloudfunctions.net/createRazorpayOrder \
  -H "Content-Type: application/json" \
  -d '{"data":{"amount":500}}'
```

## Common Issues

1. **Functions not deployed:** Deploy them first
2. **Not authenticated:** `onCall` requires Firebase Auth
3. **Wrong region:** Make sure functions are in the same region
4. **Missing config:** Set Razorpay credentials in Firebase config

## Next Steps

1. Deploy the functions
2. Test with authenticated user
3. Check function logs for errors
4. If still failing, use backend API fallback (already implemented)

