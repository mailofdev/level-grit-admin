# Razorpay Integration - Quick Start Guide

This guide will help you quickly set up and test the Razorpay payment integration.

## Prerequisites Checklist

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Razorpay account (test or live)
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Node.js 18+ installed

## Step 1: Environment Setup

### Frontend Environment Variables

Create or update `.env.local` file in the project root:

```env
RAZORPAY_KEY_ID="rzp_test_Rdf9QGAn7DocxS"
RAZORPAY_KEY_SECRET="tEKm2RDiOlhR3qROYSsI6F25"
REACT_APP_RAZORPAY_KEY_ID="rzp_test_Rdf9QGAn7DocxS"
```

**Important:** The `REACT_APP_` prefix is required for Create React App.

### Backend Environment Variables (Firebase Functions)

```bash
# Login to Firebase
firebase login

# Set Razorpay credentials
firebase functions:config:set razorpay.key_id="rzp_test_Rdf9QGAn7DocxS"
firebase functions:config:set razorpay.key_secret="tEKm2RDiOlhR3qROYSsI6F25"
firebase functions:config:set razorpay.mode="test"
```

## Step 2: Install Dependencies

### Frontend
```bash
npm install
```

### Firebase Functions
```bash
cd functions
npm install
cd ..
```

## Step 3: Deploy Firebase Functions

```bash
firebase deploy --only functions
```

Wait for deployment to complete. You should see URLs for:
- `createRazorpayOrder`
- `verifyRazorpayPayment`
- `getPaymentStatus`

## Step 4: Configure Firestore Security Rules

Go to Firebase Console → Firestore Database → Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /payments/{paymentId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.userId || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Administrator'
      );
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update: if false;
    }
  }
}
```

## Step 5: Start the Application

```bash
npm start
```

## Step 6: Test Payment Flow

1. Navigate to a page that uses `RazorpayPayment` component
2. Click the "Pay ₹500" button
3. Use Razorpay test card:
   - **Card Number:** `4111 1111 1111 1111`
   - **CVV:** Any 3 digits (e.g., `123`)
   - **Expiry:** Any future date (e.g., `12/25`)
   - **Name:** Any name
4. Complete the payment
5. Verify payment appears in Payment Management page

## Testing Checklist

- [ ] Order creation works (check browser console for errors)
- [ ] Razorpay modal opens
- [ ] Payment can be completed with test card
- [ ] Payment verification succeeds
- [ ] Payment record saved to Firestore
- [ ] Payment appears in Payment Management view
- [ ] Error handling works (try cancelling payment)

## Troubleshooting

### "Functions not found" error
- Check if functions are deployed: `firebase functions:list`
- Verify Firebase project: `firebase use --add`

### Payment verification fails
- Check Firebase Functions logs: `firebase functions:log`
- Verify Razorpay credentials are correct
- Check browser console for detailed errors

### Payment not appearing in Firestore
- Check Firestore security rules
- Verify user is authenticated
- Check browser console for errors

## Next Steps

1. Test with different scenarios (failed payments, cancelled payments)
2. Review payment records in Firestore
3. Test Payment Management view
4. When ready for production, switch to live keys (see RAZORPAY_SETUP.md)

## Support

For detailed documentation, see `RAZORPAY_SETUP.md`.

