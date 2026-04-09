# Razorpay Implementation - Quick Start

## ✅ What's Been Set Up

### Files Created:

1. **`app/api/payment/create-order/route.ts`** - Creates Razorpay order
2. **`app/api/payment/verify/route.ts`** - Verifies payment signature
3. **`app/api/payment/webhook/route.ts`** - Handles Razorpay webhook events
4. **`components/razorpay-checkout.tsx`** - Checkout UI component
5. **`components/checkout-page.tsx`** - Example checkout page
6. **`RAZORPAY_SETUP.md`** - Complete setup documentation
7. **`RAZORPAY_CART_INTEGRATION.md`** - Integration guide for your cart

### Files Modified:

- **`package.json`** - Added `razorpay` dependency
- **`.env.local`** - Added Razorpay credential placeholders

---

## 🚀 Next Steps (5-10 minutes)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Get Razorpay Credentials

1. Go to https://razorpay.com/
2. Create account (if don't have one)
3. Navigate to https://dashboard.razorpay.com/app/keys
4. Copy **Key ID** and **Key Secret**

### Step 3: Update Environment Variables

Edit `.env.local` and replace:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret_here
```

### Step 4: Update Database (Supabase)

Run this SQL in Supabase SQL Editor:

```sql
-- Add payment tracking columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'razorpay',
ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT FALSE;
```

### Step 5: Integrate into Cart Page

Update your `app/cart/page.tsx`:

Replace the payment step section (around line 452) with:

```tsx
{
  step === "payment" && (
    <RazorpayCheckout
      orderTotal={total}
      orderId={generateOrderId()}
      customerName={`${shippingInfo.firstName} ${shippingInfo.lastName}`}
      customerEmail={shippingInfo.email}
      customerPhone={shippingInfo.phone}
      onPaymentSuccess={handlePaymentSuccess}
      onPaymentError={handlePaymentError}
    />
  );
}
```

See `RAZORPAY_CART_INTEGRATION.md` for complete code.

### Step 6: Test Payment

Use test credentials:

```
Card: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
```

---

## 📋 Files at a Glance

```
app/api/payment/
├── create-order/route.ts     ← Creates Razorpay order
├── verify/route.ts           ← Verifies payment
└── webhook/route.ts          ← Handles Razorpay events

components/
├── razorpay-checkout.tsx     ← Checkout UI component
└── checkout-page.tsx         ← Example implementation

.env.local
├── NEXT_PUBLIC_RAZORPAY_KEY_ID
└── RAZORPAY_KEY_SECRET

Documentation/
├── RAZORPAY_SETUP.md         ← Full setup guide
└── RAZORPAY_CART_INTEGRATION.md ← Integration examples
```

---

## 🔐 Security Notes

✅ **Key Secret** is server-only (in `.env.local`)
✅ **Payment signature** verified on backend
✅ **Payment form** is Razorpay-hosted (PCI compliant)
✅ **Order status** updated after verification

---

## 🧪 Test Mode vs Live Mode

### Test Mode (Development)

- Key ID prefix: `rzp_test_`
- No real charges
- Use test card: 4111 1111 1111 1111

### Live Mode (Production)

- Key ID prefix: `rzp_live_`
- Real payments processed
- Switch keys in dashboard when ready

---

## 📞 Support

- **Razorpay Docs:** https://razorpay.com/docs/
- **Contact:** support@razorpay.com
- **Dashboard:** https://dashboard.razorpay.com

---

## ✨ Features Included

✅ Payment order creation
✅ Signature verification
✅ Order status updates
✅ Webhook handling (optional)
✅ Error handling
✅ Test/Live mode support
✅ Mobile responsive UI
✅ TypeScript types

---

## 🎯 What Happens When User Pays

1. User fills shipping info → Continues to payment
2. Clicks "Pay" button → Razorpay modal opens
3. Enters payment details → Razorpay processes
4. Payment succeeds → Signature verified on your server
5. Order created → Status = "paid"
6. Confirmation shown → Order tracked

---

## ⚠️ If Something Goes Wrong

| Problem                   | Solution                            |
| ------------------------- | ----------------------------------- |
| "Razorpay is not defined" | Script didn't load, check console   |
| "Invalid signature"       | Check RAZORPAY_KEY_SECRET matches   |
| "Failed to create order"  | Verify Razorpay credentials in .env |
| "Failed to update order"  | Check Supabase connection & schema  |

---

## 🎉 You're Ready!

Your project now supports Razorpay payments. The payment gateway:

- Is secure and PCI-compliant
- Handles test and production modes
- Includes webhooks for automation
- Supports payments, refunds, and settlements

For detailed documentation, see `RAZORPAY_SETUP.md`.
