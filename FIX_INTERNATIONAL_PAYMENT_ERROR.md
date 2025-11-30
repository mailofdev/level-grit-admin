# Fix: International Payment Error (400 Bad Request)

## 🔴 Error You're Getting

```
Status: 400 Bad Request
Error: "International cards are not supported. Please contact our support team for help"
Reason: "international_transaction_not_allowed"
```

## ✅ Quick Solution - Use Indian Test Card

Your Razorpay account is configured for **Indian cards only**. Use this test card:

```
Card Number: 5267 3181 8797 5449
CVV: 123
Expiry: 12/25 (or any future date)
Name: Test User
```

This should work immediately!

## 🔧 Permanent Solution - Enable International Payments

### Option 1: Enable in Razorpay Dashboard

1. **Login to Razorpay Dashboard**
   - Go to: https://dashboard.razorpay.com/
   - Login with your account credentials

2. **Navigate to Settings**
   - Click on your account/profile icon
   - Go to "Settings" → "Configuration" or "Payment Methods"

3. **Enable International Cards**
   - Look for "International Cards" or "Accept International Payments"
   - Toggle it ON
   - Save changes

### Option 2: Contact Razorpay Support

If you don't see the option:

1. **Go to Razorpay Support**
   - Dashboard: https://dashboard.razorpay.com/app/support
   - Email: support@razorpay.com

2. **Request to Enable International Payments**
   - Mention your account details
   - Request: "Please enable international card transactions for my account"
   - They may require business verification

## 📝 Code Updates Made

✅ **Improved Error Handling**:
- Better error messages for international transaction errors
- Shows helpful guidance to users
- Added payment cancellation handler

## 🧪 Test Cards

### Indian Cards (Work with your current setup)
```
Card: 5267 3181 8797 5449
CVV: 123
Expiry: 12/25

OR

Card: 5104 0600 0000 0008
CVV: 123
Expiry: 12/25
```

### International Cards (Need international payments enabled)
```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
```

## 🔄 Alternative Payment Methods

You can also test with:
- **UPI**: Select UPI in checkout, use any UPI ID
- **NetBanking**: Select any bank
- **Wallet**: Paytm, PhonePe, etc.

## ✅ Next Steps

1. **Immediate**: Use Indian test card `5267 3181 8797 5449`
2. **Test the payment flow** - it should work now
3. **Long-term**: Enable international payments if needed for production

## 📞 Need Help?

- **Razorpay Support**: support@razorpay.com
- **Dashboard Support**: https://dashboard.razorpay.com/app/support
- **Documentation**: https://razorpay.com/docs/

---

**Try the Indian test card first - it should work immediately!** 🎯

