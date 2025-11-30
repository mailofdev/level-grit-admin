# Razorpay Checkout Not Opening - Debugging Guide

## Issue
PaymentPopup modal shows, but Razorpay checkout doesn't open when clicking "Pay ₹500".

## Fixed Issues

### 1. Order ID Field Mismatch
- **Problem**: Backend returns `orderId` (camelCase) but code was checking `order_id` (snake_case)
- **Fix**: Now handles both `orderId` and `order_id`

### 2. Razorpay Key Missing
- **Problem**: Backend doesn't return `key_id` in response
- **Fix**: Falls back to `REACT_APP_RAZORPAY_KEY_ID` environment variable

## What to Check

### 1. Check Browser Console
When you click "Pay ₹500", you should see these logs:
```
Starting payment process for clientId: 123
Loading Razorpay script...
Razorpay script loaded successfully
Creating order...
Order response received: { orderId: "...", amount: 500, currency: "INR" }
Razorpay key check: { hasKeyInResponse: false, hasEnvKey: true, finalKey: "***" }
Opening Razorpay checkout with orderId: order_xxx
Razorpay options: { ... }
Attempting to open Razorpay checkout...
Razorpay checkout opened successfully
```

### 2. Check Environment Variable
Make sure `.env.local` or `.env` file has:
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
```

### 3. Check for Errors
Look for any red error messages in console:
- "Razorpay configuration missing" → Set `REACT_APP_RAZORPAY_KEY_ID` in env
- "Failed to load Razorpay" → Check internet connection
- "Failed to open payment gateway" → Check Razorpay key format

### 4. Verify Razorpay Key Format
The key should start with:
- Test: `rzp_test_`
- Live: `rzp_live_`

## Common Issues

### Issue 1: Razorpay Key Not Set
**Symptom**: Console shows "Razorpay configuration missing"
**Solution**: Add to `.env.local`:
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_here
```
Then restart dev server.

### Issue 2: Script Loading Fails
**Symptom**: "Failed to load Razorpay" error
**Solution**: 
- Check internet connection
- Check if `https://checkout.razorpay.com/v1/checkout.js` is accessible
- Check browser console for network errors

### Issue 3: Invalid Order ID
**Symptom**: "Failed to create order" error
**Solution**: Check backend returns `orderId` or `order_id` in response

### Issue 4: Popup Blocked
**Symptom**: No error, but checkout doesn't open
**Solution**: 
- Check if popup blocker is enabled
- Allow popups for your domain
- Try in incognito mode

## Testing Steps

1. **Open Browser Console** (F12)
2. **Click "Pay ₹500"** button
3. **Check Console Logs**:
   - Should see all the log messages above
   - If any step fails, check the error message
4. **Check Network Tab**:
   - Should see request to `api/payments/create-order`
   - Should see response with `orderId`
5. **Expected Behavior**:
   - Razorpay checkout popup should open
   - Should show payment form

## Backend Response Expected

```json
{
  "orderId": "order_xxxxxxxxx",
  "amount": 500,
  "currency": "INR"
}
```

**Optional** (if backend provides):
```json
{
  "orderId": "order_xxxxxxxxx",
  "amount": 500,
  "currency": "INR",
  "key_id": "rzp_test_xxxxxxxxx"
}
```

## Next Steps

1. Check console logs when clicking "Pay ₹500"
2. Verify `REACT_APP_RAZORPAY_KEY_ID` is set in `.env.local`
3. Restart dev server after setting env variable
4. Check browser popup blocker settings
5. Share console logs if issue persists

