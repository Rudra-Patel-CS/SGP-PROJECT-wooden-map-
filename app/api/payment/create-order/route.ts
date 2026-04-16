import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay credentials missing in environment variables");
      return NextResponse.json(
        { error: "Payment gateway not configured. Contact support." },
        { status: 500 },
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, orderId, customerEmail, customerName, customerPhone } =
      await req.json();

    // Validate required fields
    if (!amount || !orderId) {
      return NextResponse.json(
        { error: "Amount and orderId are required" },
        { status: 400 },
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 },
      );
    }

    // Create Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: orderId,
      payment_capture: true, // Auto capture payment
      notes: {
        orderId,
        customerEmail,
        customerName,
      },
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error);
    console.error("Razorpay order creation error:", errorMessage);

    return NextResponse.json(
      {
        error: "Failed to create payment order",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
