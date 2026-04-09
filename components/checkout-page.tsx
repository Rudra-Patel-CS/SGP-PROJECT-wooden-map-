"use client";

import { useState } from "react";
import { RazorpayCheckout } from "@/components/razorpay-checkout";
import { useRouter } from "next/navigation";

// Example checkout page component
export function CheckoutPage({
  orderData,
}: {
  orderData: {
    id: string;
    total_amount: number;
    contact_email: string;
    contact_phone: string;
    shipping_address: string;
  };
}) {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const handlePaymentSuccess = (paymentId: string) => {
    setPaymentStatus("success");
    setPaymentId(paymentId);

    // Redirect to order confirmation after 2 seconds
    setTimeout(() => {
      router.push(
        `/order-status?orderId=${orderData.id}&paymentId=${paymentId}`,
      );
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentStatus("error");
    console.error("Payment error:", error);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Order Checkout</h1>

        {paymentStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold">Payment Successful!</p>
            <p className="text-sm text-green-700 mt-1">
              Payment ID: {paymentId}
            </p>
          </div>
        )}

        {paymentStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">Payment Failed</p>
            <p className="text-sm text-red-700 mt-1">Please try again</p>
          </div>
        )}

        {paymentStatus === "pending" && (
          <>
            <div className="mb-6 space-y-2 text-sm text-gray-600">
              <p>
                <strong>Order ID:</strong> {orderData.id}
              </p>
              <p>
                <strong>Amount:</strong> ₹{orderData.total_amount.toFixed(2)}
              </p>
              <p>
                <strong>Email:</strong> {orderData.contact_email}
              </p>
              <p>
                <strong>Address:</strong> {orderData.shipping_address}
              </p>
            </div>

            <RazorpayCheckout
              orderTotal={orderData.total_amount}
              orderId={orderData.id}
              customerName={
                orderData.shipping_address.split(",")[0] || "Customer"
              }
              customerEmail={orderData.contact_email}
              customerPhone={orderData.contact_phone}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </>
        )}
      </div>
    </div>
  );
}
