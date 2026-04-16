// Integration example: How to integrate Razorpay into your cart page
// This shows the key changes needed in your existing cart/page.tsx

import { RazorpayCheckout } from '@/components/razorpay-checkout';

// In your CartPage component, update the payment step as follows:

// 1. Modify the state to track payment
// Add to your existing useState calls:
// const [paymentStep, setPaymentStep] = useState<'payment-form' | 'razorpay'>('payment-form');

// 2. Replace the payment card section (around line 452) with this:

/_
{/_ STEP: PAYMENT _\/}
{step === "payment" && (
<>
{/_ Show Razorpay checkout instead of card form \*\/}
<Card className="border-border">
<CardContent className="p-6">
<h2 className="font-serif text-xl font-medium text-foreground mb-6">Payment</h2>

        <div className="mb-6 p-4 bg-secondary rounded-lg">
          <h3 className="font-medium text-foreground mb-2">Shipping to</h3>
          <p className="text-sm text-muted-foreground">
            {shippingInfo.firstName} {shippingInfo.lastName}<br />
            {shippingInfo.address}<br />
            {shippingInfo.city}{shippingInfo.district && \` (\${shippingInfo.district} District)\`}{shippingInfo.state ? \`, \${shippingInfo.state}\` : ""} {shippingInfo.zip}<br />
            {shippingInfo.country}
          </p>
        </div>

        {orderError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {orderError}
          </div>
        )}

        <RazorpayCheckout
          orderTotal={total}
          orderId={generateTempOrderId()} // Generate a unique ID for this order
          customerName={\`\${shippingInfo.firstName} \${shippingInfo.lastName}\`}
          customerEmail={shippingInfo.email}
          customerPhone={shippingInfo.phone}
          onPaymentSuccess={async (paymentId) => {
            try {
              // Create order in database with payment info
              const supabase = createClient();
              const { data: { session } } = await supabase.auth.getSession();

              if (!session?.user?.id) {
                throw new Error("You must be logged in to place an order.");
              }

              const combinedCity = shippingInfo.district
                  ? \`\${shippingInfo.city} (\${shippingInfo.district} District)\`
                  : shippingInfo.city;

              const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  user_id: session.user.id,
                  total_amount: total,
                  shipping_address: shippingInfo.address,
                  shipping_city: combinedCity,
                  shipping_state: shippingInfo.state || "",
                  shipping_zip: shippingInfo.zip || "",
                  shipping_country: shippingInfo.country || "India",
                  contact_email: shippingInfo.email || session.user.email || "",
                  contact_phone: shippingInfo.phone || "",
                  payment_id: paymentId,
                  payment_method: 'razorpay',
                  status: 'paid',
                  items: cartItems.map((item) => ({
                    product_id: item.id.startsWith("custom-") ? null : item.id,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size || "",
                    color: item.color || "",
                  })).filter((item) => item.product_id),
                }),
              });

              if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Order failed");
              }

              const order = await res.json();
              setConfirmedOrderNumber(order.id?.slice(0, 8) || "CONFIRMED");
              clearCart();
              setStep("confirmation");
            } catch (err) {
              setOrderError(err instanceof Error ? err.message : "Failed to complete order");
            }
          }}
          onPaymentError={(error) => {
            setOrderError(\`Payment failed: \${error}\`);
          }}
        />
      </CardContent>
    </Card>

</>
)}
\*/

// 3. Update the handlePlaceOrder function to remove the manual order creation
// The order is now created in the Razorpay onPaymentSuccess callback

// 4. Helper function to generate temp order ID
function generateTempOrderId(): string {
return `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export { generateTempOrderId };
