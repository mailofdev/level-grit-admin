# Razorpay Setup Complete ✅

## Environment Variables Configured

### Frontend (.env file)
- ✅ **Key ID**: `rzp_test_RlRR9bdHC18if4`
- ✅ **Location**: `/Users/apple/WORK/level-grit/level-grit-admin/.env`
- ✅ **Variable**: `REACT_APP_RAZORPAY_KEY_ID`

### Backend (Important!)
- ⚠️ **Secret Key**: `h2McIV5IGhMBF25TYQMENBLM`
- ⚠️ **MUST be configured in backend only** (not in frontend)
- ⚠️ Backend should use this secret for:
  - Creating Razorpay orders
  - Verifying payment signatures
  - Processing refunds

## Next Steps

### 1. Restart Development Server
After creating/updating `.env` file, restart your dev server:

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm start
```

### 2. Configure Backend
Make sure your backend API (`api/payments/create-order`) uses the secret key:
- **Key ID**: `rzp_test_RlRR9bdHC18if4` (can be shared)
- **Secret**: `h2McIV5IGhMBF25TYQMENBLM` (backend only, never expose to frontend)

### 3. Test the Payment Flow

1. **Register a 2nd client** (first client is free)
2. **Payment popup should appear**
3. **Click "Pay ₹500"**
4. **Razorpay checkout should open**
5. **Use test card**: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

## How It Works

### Frontend Flow
1. User clicks "Pay ₹500" in PaymentPopup
2. Frontend calls `api/payments/create-order` (with clientId)
3. Backend creates Razorpay order and returns `orderId`
4. Frontend uses `REACT_APP_RAZORPAY_KEY_ID` to initialize Razorpay
5. Razorpay checkout popup opens
6. User completes payment
7. Frontend calls `api/payments/verify` with payment details
8. Backend verifies using secret key and activates client

### Security Notes
- ✅ Key ID is safe to expose (public)
- ⚠️ Secret key MUST stay in backend only
- ✅ Payment verification happens on backend
- ✅ All sensitive operations use backend API

## Troubleshooting

### If Razorpay checkout doesn't open:

1. **Check Console Logs**:
   - Open browser console (F12)
   - Click "Pay ₹500"
   - Look for errors

2. **Verify Environment Variable**:
   - Check `.env` file exists
   - Verify `REACT_APP_RAZORPAY_KEY_ID=rzp_test_RlRR9bdHC18if4`
   - Restart dev server after changes

3. **Check Network Tab**:
   - Verify `api/payments/create-order` returns `orderId`
   - Check for any failed requests

4. **Common Issues**:
   - **Popup blocker**: Allow popups for your domain
   - **Missing key**: Restart server after adding to `.env`
   - **Wrong key format**: Should start with `rzp_test_` or `rzp_live_`

## Test Cards

### Success Card
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25 (any future date)
```

### Failure Card
```
Card Number: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25
```

## Files Updated

- ✅ `.env` - Created with Razorpay Key ID
- ✅ `.gitignore` - Updated to ignore .env files
- ✅ `PaymentPopup.js` - Already configured to use env variable
- ✅ `payments.api.js` - API calls configured

## Verification Checklist

- [ ] `.env` file created with `REACT_APP_RAZORPAY_KEY_ID`
- [ ] Dev server restarted after creating `.env`
- [ ] Backend configured with secret key
- [ ] Backend `create-order` API returns `orderId`
- [ ] Payment popup appears for 2nd+ clients
- [ ] Razorpay checkout opens when clicking "Pay ₹500"
- [ ] Test payment works with test card

## Support

If issues persist:
1. Check browser console for errors
2. Verify backend API is working
3. Confirm environment variable is loaded (check console logs)
4. Test with Razorpay test mode credentials

