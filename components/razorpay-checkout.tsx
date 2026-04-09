"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

interface RazorpayCheckoutProps {
  orderTotal: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayCheckout({
  orderTotal,
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  onPaymentSuccess,
  onPaymentError,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load Razorpay script if not already loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay script");
      }

      // Step 1: Create Razorpay order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: orderTotal,
          orderId,
          customerEmail,
          customerName,
          customerPhone,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create payment order");
      }

      const orderData = await orderResponse.json();

      // Step 2: Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Wooden Maps Store",
        description: `Order #${orderId}`,
        order_id: orderData.orderId,
        customer_notify: 1,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: "#8B6F47", // Wood-like brown color
        },
        method: {
          upi: true,
          netbanking: true,
          card: true,
          wallet: true,
          emandate: false,
        },
        handler: async (response: any) => {
          try {
            // Step 3: Verify payment on server
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: orderData.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            onPaymentSuccess(response.razorpay_payment_id);
          } catch (err) {
            onPaymentError(
              err instanceof Error
                ? err.message
                : "Payment verification failed",
            );
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Payment process failed";
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>Pay ₹{orderTotal.toFixed(2)}</>
        )}
      </button>

      <p className="text-center text-sm text-gray-600">
        Secure payment powered by Razorpay
      </p>
    </div>
  );
}
