# Razorpay Payment Integration Guide

## Overview

This guide explains the complete Razorpay payment integration for your Wooden Maps Store e-commerce application.

---

## Step 1: Installation

### Install Razorpay SDK

```bash
npm install razorpay
```

The package.json has already been updated with the `razorpay` dependency.

---

## Step 2: Get Razorpay Credentials

1. **Create/Login to Razorpay Account**
   - Go to https://razorpay.com
   - Sign up or login to your account

2. **Get API Keys**
   - Visit https://dashboard.razorpay.com/app/keys
   - You'll see:
     - **Key ID** (Publishable Key)
     - **Key Secret** (Secret Key)

3. **Copy these credentials to `.env.local`**
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## Step 3: Database Schema Updates

Add these columns to your `orders` table in Supabase:

```sql
ALTER TABLE orders ADD COLUMN payment_id VARCHAR(100);
ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50);
ALTER TABLE orders ADD COLUMN payment_verified BOOLEAN DEFAULT FALSE;
```

Or run this migration:

```sql
-- Add payment tracking columns
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'razorpay',
ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT FALSE;
```

---

## Step 4: Updated Order Status Flow

### Order Lifecycle:

1. **Create Order** → Status: `pending` (awaiting payment)
2. **Payment Success** → Status: `paid` (payment verified)
3. **Shipping** → Status: `shipped`
4. **Delivered** → Status: `delivered`

---

## Step 5: Integration Points

### A. Cart/Checkout Page

```tsx
import { RazorpayCheckout } from "@/components/razorpay-checkout";

// In your checkout page:
<RazorpayCheckout
  orderTotal={totalAmount}
  orderId={orderId}
  customerName={name}
  customerEmail={email}
  customerPhone={phone}
  onPaymentSuccess={handleSuccess}
  onPaymentError={handleError}
/>;
```

### B. Update Orders API

The orders API now supports payment flow:

```typescript
// File: app/api/orders/route.ts

// Existing POST route creates order with status: "pending"
// After payment verification, status is updated to "paid"
```

### C. Webhooks (Optional - for production)

For production, set up webhooks at https://dashboard.razorpay.com/app/webhooks

```
Webhook URL: https://yoursite.com/api/payment/webhook
Webhook Events:
- payment.authorized
- payment.failed
- payment.captured
```

---

## Step 6: Files Created/Modified

### New Files:

1. **`app/api/payment/create-order/route.ts`**
   - Creates Razorpay order before checkout

2. **`app/api/payment/verify/route.ts`**
   - Verifies payment signature and updates order status

3. **`components/razorpay-checkout.tsx`**
   - React component that handles Razorpay checkout UI

4. **`components/checkout-page.tsx`**
   - Example checkout page implementation

### Modified Files:

- **`package.json`** - Added razorpay dependency
- **`.env.local`** - Added Razorpay credentials

---

## Step 7: Testing

### Test Cards (India)

Use these in test mode:

| Card Number         | Expiry          | CVV          | Result  |
| ------------------- | --------------- | ------------ | ------- |
| 4111 1111 1111 1111 | Any future date | Any 3 digits | Success |
| 4222 2222 2222 2222 | Any future date | Any 3 digits | Failure |

### Test UPI

- Use `success@razorpay` for successful payments
- Use `failure@razorpay` for failed payments

### Test Mode

- Use **Test Key ID** and **Test Key Secret** from dashboard
- Payments are not actually processed
- Prefix: `rzp_test_`

### Production Mode

- Switch to **Live Key ID** and **Live Key Secret**
- Payments are actually processed
- Prefix: `rzp_live_`

---

## Step 8: Payment Flow Diagram

```
User buys products
    ↓
Creates order (status: pending)
    ↓
Opens Razorpay checkout
    ↓
Enters card/UPI details
    ↓
Razorpay processes payment
    ↓
Returns to your app with payment details
    ↓
Verify signature & update order (status: paid)
    ↓
Send confirmation email
    ↓
Display order confirmation
```

---

## Step 9: Error Handling

### Common Errors:

1. **"Invalid payment signature"**
   - Check if RAZORPAY_KEY_SECRET matches
   - Verify signature calculation

2. **"Failed to create payment order"**
   - Check Razorpay credentials in .env
   - Verify key_id and key_secret are correct

3. **"Failed to update order"**
   - Check Supabase connection
   - Verify service role key is valid
   - Ensure payment_id column exists in orders table

---

## Step 10: Security Best Practices

✅ **Do:**

- Store RAZORPAY_KEY_SECRET on server only (never expose to client)
- Always verify payment signature on backend
- Use HTTPS in production
- Validate amounts on server before creating payment
- Store payment_id for audit trail

❌ **Don't:**

- Expose RAZORPAY_KEY_SECRET in frontend code
- Trust client-side amount verification
- Skip signature verification
- Store sensitive payment data in localStorage

---

## Step 11: Next Steps for Production

1. **Setup Database Webhooks** (optional)
   - For auto-refunds, payment notifications

2. **Email Notifications**
   - Send payment confirmation email
   - Order updates to customer

3. **Admin Dashboard**
   - View payment status per order
   - Reconcile payments in admin panel

4. **CSR (Customer Service)**
   - Manual refund process
   - Payment failure handling

5. **Analytics**
   - Track payment success rate
   - Monitor failed transactions

---

## Troubleshooting

### Issue: "Razorpay is not defined"

**Solution:** Ensure the Razorpay script is loaded before clicking payment button.

### Issue: "CORS error"

**Solution:** Razorpay handles CORS automatically. This shouldn't be an issue.

### Issue: Signature mismatch

**Solution:**

```typescript
// Verify you're using correct secret
const secret = process.env.RAZORPAY_KEY_SECRET!;
// Check order_id format matches exactly from Razorpay
```

---

## Support & Resources

- **Razorpay Docs:** https://razorpay.com/docs/
- **Dashboard:** https://dashboard.razorpay.com
- **Support Email:** support@razorpay.com
- **API Reference:** https://razorpay.com/docs/api/

---

## Quick Reference: Environment Variables

```env
# .env.local
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx      # Client-side (public)
RAZORPAY_KEY_SECRET=xxxxxx                       # Server-side (secret)
```

---

## Implementation Checklist

- [ ] Install razorpay package
- [ ] Get Razorpay API credentials
- [ ] Update .env.local with credentials
- [ ] Run database migration for payment columns
- [ ] Create payment API routes
- [ ] Create checkout component
- [ ] Integrate checkout component into cart page
- [ ] Test with test credentials
- [ ] Setup email notifications
- [ ] Go live with production credentials
