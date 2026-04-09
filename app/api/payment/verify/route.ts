import Razorpay from "razorpay";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await req.json();

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    // Fetch payment details from Razorpay to double-check
    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    // Check payment status
    if (payment.status !== "captured") {
      return NextResponse.json(
        { error: "Payment not captured" },
        { status: 400 },
      );
    }

    // Signature is valid and payment is captured
    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 },
    );
  }
}
