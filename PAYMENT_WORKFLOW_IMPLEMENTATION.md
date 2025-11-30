# Client Activation & Payment Workflow Implementation

## Overview

This document describes the complete client activation and payment workflow implementation with Razorpay integration.

## Business Logic

1. **First client is FREE** for every trainer - no payment required
2. **From the 2nd client onward**, trainer must pay **₹500 per client** to enable services
3. **Payment Flow:**
   - Trainer registers client → Backend creates client → Show payment popup (if 2nd+ client)
   - If trainer doesn't pay immediately → Client appears disabled in "All Clients" list
   - "Pay Now" button appears on inactive clients
   - No services can be used for unpaid clients
4. **Backend sends `IsSubscriptionPaid` parameter:**
   - `true` → Client is paid & active
   - `false` → Client is unpaid & disabled
5. **Login Restriction:**
   - If client tries to sign in and `IsSubscriptionPaid = false` → Block login with message

## Files Created

### 1. Payment API Service
**File:** `src/services/payments.api.js`
- `createOrder()` - Creates Razorpay order via backend
- `verifyPayment()` - Verifies payment after Razorpay checkout
- `refundPayment()` - Processes refunds (if needed)

### 2. Razorpay Script Loader
**File:** `src/utils/razorpayLoader.js`
- `loadRazorpayScript()` - Dynamically loads Razorpay checkout script
- `isRazorpayAvailable()` - Checks if Razorpay is loaded

### 3. Payment Popup Component
**File:** `src/components/payments/PaymentPopup.js`
- Modal popup for payment
- Integrates with Razorpay checkout
- Handles complete payment flow:
  1. Creates order via backend API
  2. Opens Razorpay checkout
  3. Verifies payment on success
  4. Calls success callback

## Files Modified

### 1. RegisterClientForm
**File:** `src/features/auth/RegisterClientForm.js`
**Changes:**
- Removed old payment checking logic
- Removed paymentStorage dependencies
- After successful client registration:
  - Checks if client count > 1 (meaning 2nd+ client)
  - Shows payment popup if payment required
  - First client proceeds without popup

### 2. AllClients Component
**File:** `src/features/users/AllClients.js`
**Changes:**
- Shows disabled state for clients with `IsSubscriptionPaid = false`
- Displays "Inactive" badge for unpaid clients
- Shows "Pay Now ₹500" button for inactive clients
- Clicking "Pay Now" opens payment popup
- Disabled clients cannot be clicked to view details
- After payment success, refreshes client list

### 3. LoginForm
**File:** `src/features/auth/LoginForm.js`
**Changes:**
- Checks `IsSubscriptionPaid` status in login response
- Blocks login for clients with `IsSubscriptionPaid = false`
- Shows message: "Your subscription is inactive. Please contact your trainer to activate your account."

## Files Removed

1. `src/utils/paymentStorage.js` - Old localStorage-based payment tracking (no longer needed)
2. `src/features/payments/RazorpayPayment.js` - Old placeholder component (replaced by PaymentPopup)

## API Endpoints Integration

The implementation integrates with the following backend endpoints:

1. **Create Order**
   - `POST api/payments/create-order`
   - Request: `{ clientId, amount, currency, receipt }`
   - Response: `{ order_id, key_id, ... }`

2. **Verify Payment**
   - `POST api/payments/verify`
   - Request: `{ razorpayPaymentId, razorpayOrderId, razorpaySignature }`
   - Response: Payment verification result

3. **Refund API**
   - `POST api/payments/refund`
   - Request: `{ paymentId, amount, reason }`
   - Response: Refund result

## Payment Flow

```
Trainer registers client
       │
       ▼
Backend creates client (IsSubscriptionPaid = false if 2nd+ client)
       │
       ▼
If clientCount > 1:
   Show Payment Popup
       │
       ▼
User clicks "Pay ₹500"
       │
       ▼
Frontend calls CREATE ORDER API
       │
       ▼
Backend returns order_id
       │
       ▼
UI opens Razorpay checkout popup
       │
       ▼
User pays on Razorpay
       │
       ▼
UI receives payment_id + order_id + signature
       │
       ▼
Frontend calls VERIFY API
       │
       ▼
Backend marks payment as PAID & sets IsSubscriptionPaid = true
       │
       ▼
Success! Client is now active
```

## UI States

### Active Client
- Normal card appearance
- Clickable to view details
- Goal badge displayed
- Full functionality available

### Inactive Client
- Grayed out appearance (grayscale filter)
- Red "Inactive" badge
- "Pay Now ₹500" button visible
- Not clickable for details
- No services available

## Environment Variables

The Razorpay key can be provided in two ways:

1. **Backend Response** (Preferred)
   - Backend includes `key_id` in create-order response
   - More secure, centralized configuration

2. **Environment Variable** (Fallback)
   - `REACT_APP_RAZORPAY_KEY_ID` in `.env.local`
   - Used if backend doesn't provide key_id

## Testing Checklist

- [ ] First client registration → No payment popup
- [ ] Second client registration → Payment popup appears
- [ ] Payment completes successfully → Client becomes active
- [ ] Payment cancelled → Client stays inactive
- [ ] Inactive client shows "Pay Now" button
- [ ] "Pay Now" button opens payment popup
- [ ] Inactive client cannot access services
- [ ] Client login blocked when IsSubscriptionPaid = false
- [ ] Proper error messages for all failure cases
- [ ] Razorpay popup opens correctly
- [ ] Payment verification receives correct data

## Error Handling

- Network errors during order creation
- Payment cancellation by user
- Payment verification failures
- Razorpay script loading failures
- Invalid client ID scenarios
- Backend API errors

All errors are handled with user-friendly toast messages.

## Next Steps

1. **Backend Integration:**
   - Ensure backend APIs are implemented
   - Verify `IsSubscriptionPaid` field in client response
   - Confirm payment verification flow

2. **Environment Setup:**
   - Configure `REACT_APP_RAZORPAY_KEY_ID` in `.env.local` (if needed)
   - Ensure backend provides `key_id` in order response

3. **Testing:**
   - Test with Razorpay test credentials
   - Verify end-to-end payment flow
   - Test all error scenarios

4. **Production:**
   - Switch to live Razorpay keys
   - Update backend with live credentials
   - Monitor payment transactions

