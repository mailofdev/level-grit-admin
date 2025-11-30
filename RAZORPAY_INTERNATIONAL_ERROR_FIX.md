# Razorpay International Transaction Error - Fix Guide

## Error You're Seeing

```
Status: 400 Bad Request
Error: "International cards are not supported. Please contact our support team for help"
Reason: "international_transaction_not_allowed"
```

## What This Means

Your Razorpay account is configured to **only accept Indian cards**. When you try to use a non-Indian card (or certain test cards that appear international), Razorpay blocks the transaction.

## Solutions

### Option 1: Use Indian Test Cards (Quick Fix)

Use Indian test cards provided by Razorpay:

**Indian Test Cards:**
```
Card Number: 5267 3181 8797 5449
CVV: 123
Expiry: 12/25 (any future date)
Name: Any name
```

Or:
```
Card Number: 5104 0600 0000 0008
CVV: 123
Expiry: 12/25
```

### Option 2: Enable International Transactions (Recommended for Production)

1. **Login to Razorpay Dashboard**
   - Go to: https://dashboard.razorpay.com/
   - Login with your account

2. **Navigate to Settings**
   - Click on "Settings" → "Configuration"
   - Look for "Payment Methods" or "International Payments"

3. **Enable International Cards**
   - Find "International Cards" or "Accept International Cards"
   - Enable the option
   - Save changes

4. **Contact Razorpay Support** (if option not available)
   - Go to: https://razorpay.com/support/
   - Request to enable international transactions
   - Provide your account details
   - They may require business verification for international payments

### Option 3: Use UPI/NetBanking/Wallet (For Testing)

You can also test with:
- **UPI**: Use any UPI ID
- **NetBanking**: Select any bank
- **Wallet**: Paytm, PhonePe, etc.

## Code Updates Made

✅ **Improved Error Handling**:
- PaymentPopup now catches and displays specific error messages
- Shows helpful message for international transaction errors
- Better error logging for debugging

## Testing Steps

### 1. Test with Indian Card
```
Card: 5267 3181 8797 5449
CVV: 123
Expiry: 12/25
```

### 2. Test with UPI
- Select UPI option in Razorpay checkout
- Use any test UPI ID

### 3. Test with NetBanking
- Select NetBanking option
- Choose any bank for testing

## Why This Happens

1. **Razorpay Account Type**: Test accounts may default to Indian-only
2. **Business Verification**: International payments often require additional verification
3. **Regulatory Compliance**: Some accounts need KYC for international transactions

## Next Steps

1. **Immediate**: Use Indian test card (5267 3181 8797 5449)
2. **Short-term**: Enable international transactions in dashboard
3. **Long-term**: Complete business verification if needed for production

## Error Handling in Code

The code now:
- ✅ Catches `payment.failed` events
- ✅ Shows specific error messages
- ✅ Handles international transaction errors
- ✅ Provides user-friendly messages

## Contact Razorpay Support

If you need to enable international payments:
- **Email**: support@razorpay.com
- **Dashboard**: https://dashboard.razorpay.com/app/support
- **Phone**: Check Razorpay website for phone support

## Test Cards Reference

### Indian Cards (Work with Indian-only accounts)
- `5267 3181 8797 5449` - Visa
- `5104 0600 0000 0008` - Mastercard

### International Cards (Require international payments enabled)
- `4111 1111 1111 1111` - Visa
- `5555 5555 5555 4444` - Mastercard

---

**Quick Fix**: Use card `5267 3181 8797 5449` with CVV `123` and any future expiry date.

