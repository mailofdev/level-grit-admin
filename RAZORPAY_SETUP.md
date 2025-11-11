# Razorpay Payment Integration Setup Guide

This guide will help you set up and deploy the Razorpay payment integration with Firebase Cloud Functions.

## Prerequisites

1. Firebase project with Firestore enabled
2. Firebase CLI installed (`npm install -g firebase-tools`)
3. Razorpay account (test or live)
4. Node.js 18+ installed

## Environment Variables

### Frontend (.env.local)

Add these variables to your `.env.local` file:

```env
# Razorpay Test Keys (for development)
RAZORPAY_KEY_ID="rzp_test_Rdf9QGAn7DocxS"
RAZORPAY_KEY_SECRET="tEKm2RDiOlhR3qROYSsI6F25"
REACT_APP_RAZORPAY_KEY_ID="rzp_test_Rdf9QGAn7DocxS"

# For production, use live keys:
# RAZORPAY_KEY_ID="rzp_live_..."
# RAZORPAY_KEY_SECRET="..."
# REACT_APP_RAZORPAY_KEY_ID="rzp_live_..."
```

**Note:** The `REACT_APP_` prefix is required for Create React App to expose the variable to the frontend.

### Firebase Functions Configuration

Set environment variables for Firebase Functions:

```bash
# Login to Firebase
firebase login

# Set Razorpay credentials
firebase functions:config:set razorpay.key_id="rzp_test_Rdf9QGAn7DocxS"
firebase functions:config:set razorpay.key_secret="tEKm2RDiOlhR3qROYSsI6F25"
firebase functions:config:set razorpay.mode="test"
```

For production:

```bash
firebase functions:config:set razorpay.key_id="rzp_live_YOUR_LIVE_KEY"
firebase functions:config:set razorpay.key_secret="YOUR_LIVE_SECRET"
firebase functions:config:set razorpay.mode="live"
```

## Firebase Functions Setup

### 1. Initialize Firebase Functions (if not already done)

```bash
cd functions
npm install
```

### 2. Deploy Functions

```bash
# Deploy all functions
firebase deploy --only functions

# Or deploy specific functions
firebase deploy --only functions:createRazorpayOrder
firebase deploy --only functions:verifyRazorpayPayment
firebase deploy --only functions:getPaymentStatus
```

### 3. Verify Deployment

After deployment, you should see URLs like:
```
✔ functions[createRazorpayOrder(us-central1)]: Successful create operation.
✔ functions[verifyRazorpayPayment(us-central1)]: Successful create operation.
✔ functions[getPaymentStatus(us-central1)]: Successful create operation.
```

## Firestore Security Rules

Add these rules to secure your payment data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Payments collection
    match /payments/{paymentId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.userId || 
        // Admin can read all payments (adjust role check as needed)
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Administrator'
      );
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update: if false; // Payments should not be updated after creation
    }
  }
}
```

## Testing

### Test Mode

1. Use Razorpay test credentials
2. Use test card numbers from Razorpay dashboard
3. Test payment flow end-to-end

### Test Cards

Use these test cards from Razorpay:

- **Success:** `4111 1111 1111 1111`
- **Failure:** `4000 0000 0000 0002`
- **CVV:** Any 3 digits
- **Expiry:** Any future date

### Testing Checklist

- [ ] Order creation works
- [ ] Payment modal opens correctly
- [ ] Payment success flow works
- [ ] Payment verification works
- [ ] Payment records saved to Firestore
- [ ] Error handling works (failed payments, cancelled payments)
- [ ] Payment management view shows correct data

## Switching to Live Mode

1. **Update Environment Variables:**
   ```bash
   # Frontend
   # Update .env.local with live keys
   
   # Backend
   firebase functions:config:set razorpay.key_id="rzp_live_..."
   firebase functions:config:set razorpay.key_secret="..."
   firebase functions:config:set razorpay.mode="live"
   ```

2. **Redeploy Functions:**
   ```bash
   firebase deploy --only functions
   ```

3. **Update Frontend:**
   - Update `.env.local` with live keys
   - Rebuild and deploy frontend

4. **Verify:**
   - Test with small real transaction
   - Verify payment appears in Razorpay dashboard
   - Check Firestore for payment records

## Troubleshooting

### Functions Not Found

If you see "functions/unavailable" errors:

1. Check if functions are deployed: `firebase functions:list`
2. Verify Firebase project: `firebase projects:list`
3. Check function logs: `firebase functions:log`

### Payment Verification Fails

1. Check Razorpay credentials are correct
2. Verify signature generation matches Razorpay's algorithm
3. Check function logs for detailed errors

### Order Creation Fails

1. Verify Razorpay credentials in Firebase config
2. Check Firestore permissions
3. Verify user authentication

## Security Best Practices

1. **Never expose key_secret in frontend code**
2. **Always verify payments on backend**
3. **Use HTTPS in production**
4. **Implement rate limiting**
5. **Log all payment attempts**
6. **Monitor for suspicious activity**
7. **Keep Razorpay credentials secure**

## Support

For issues:
1. Check Firebase Functions logs
2. Check browser console for frontend errors
3. Check Razorpay dashboard for transaction status
4. Review Firestore data for payment records

## Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

