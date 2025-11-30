# ⚠️ CRITICAL: Backend Amount Conversion Fix Required

## Problem

Users are paying **₹5 instead of ₹500** when activating clients.

## Root Cause

The backend `api/payments/create-order` endpoint is creating Razorpay orders with the wrong amount.

### Current (Wrong) Behavior
- Frontend sends: `amount: 500` (rupees)
- Backend creates Razorpay order with: `amount: 500` (treated as paise)
- Razorpay charges: **₹5** (500 paise = ₹5)

### Expected (Correct) Behavior
- Frontend sends: `amount: 500` (rupees)
- Backend creates Razorpay order with: `amount: 50000` (converted to paise)
- Razorpay charges: **₹500** (50000 paise = ₹500)

## Backend Fix Required

### In `api/payments/create-order` endpoint:

```csharp
// WRONG - Don't do this:
var razorpayOrder = razorpay.Order.Create(new {
    amount = request.Amount,  // This is 500 (rupees) - WRONG!
    currency = "INR",
    receipt = request.Receipt
});

// CORRECT - Do this:
var razorpayOrder = razorpay.Order.Create(new {
    amount = request.Amount * 100,  // Convert rupees to paise: 500 * 100 = 50000
    currency = "INR",
    receipt = request.Receipt
});
```

### Razorpay Amount Format

Razorpay requires amount in **smallest currency unit**:
- For INR: Use **paise** (not rupees)
- ₹1 = 100 paise
- ₹500 = 50000 paise
- ₹1000 = 100000 paise

## Frontend Status

✅ Frontend is already correct:
- Sends amount in **rupees** (500) to backend
- Expects backend to convert to paise (50000) when creating order
- Always uses 50000 paise when opening Razorpay checkout

## Validation

After fixing backend, verify:
1. Backend receives: `amount: 500` (rupees)
2. Backend creates order with: `amount: 50000` (paise)
3. Razorpay checkout shows: **₹500**
4. Payment charges: **₹500** (not ₹5)

## Test

1. Create order with amount: 500
2. Check Razorpay order in dashboard
3. Verify order amount is 50000 (paise) = ₹500
4. Complete test payment
5. Verify charged amount is ₹500

---

**This is a CRITICAL bug - users are being undercharged. Please fix immediately!**

