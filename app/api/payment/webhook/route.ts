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

/**
 * Webhook handler for Razorpay events
 * Setup URL: https://dashboard.razorpay.com/app/webhooks
 * Webhook URL: https://yoursite.com/api/payment/webhook
 * Events to listen:
 * - payment.authorized
 * - payment.failed
 * - payment.captured
 * - refund.created
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const supabase = getServiceClient();

    switch (event.event) {
      case "payment.authorized": {
        // Payment authorized but not yet captured
        const paymentId = event.payload.payment.entity.id;
        const orderId = event.payload.payment.entity.notes.orderId;

        await supabase
          .from("orders")
          .update({
            status: "paid",
            payment_id: paymentId,
            payment_method: "razorpay",
          })
          .eq("id", orderId);

        console.log(`Payment authorized: ${paymentId}`);
        break;
      }

      case "payment.captured": {
        // Payment successfully captured (amount deducted)
        const paymentId = event.payload.payment.entity.id;
        const orderId = event.payload.payment.entity.notes.orderId;
        const amount = event.payload.payment.entity.amount / 100; // Convert from paise

        await supabase
          .from("orders")
          .update({
            status: "paid",
            payment_id: paymentId,
            payment_method: "razorpay",
          })
          .eq("id", orderId);

        // Optional: Send confirmation email
        // await sendPaymentConfirmationEmail(orderId, amount);

        console.log(`Payment captured: ${paymentId}, Amount: ₹${amount}`);
        break;
      }

      case "payment.failed": {
        // Payment failed
        const paymentId = event.payload.payment.entity.id;
        const orderId = event.payload.payment.entity.notes.orderId;
        const reason = event.payload.payment.entity.error_reason;

        await supabase
          .from("orders")
          .update({
            status: "failed",
            payment_id: paymentId,
            payment_method: "razorpay",
          })
          .eq("id", orderId);

        console.log(`Payment failed: ${paymentId}, Reason: ${reason}`);
        break;
      }

      case "refund.created": {
        // Refund initiated
        const refundId = event.payload.refund.entity.id;
        const paymentId = event.payload.refund.entity.payment_id;
        const amount = event.payload.refund.entity.amount / 100; // Convert from paise

        // Find order by payment_id and update status
        const { data: order } = await supabase
          .from("orders")
          .select("id")
          .eq("payment_id", paymentId)
          .single();

        if (order) {
          await supabase
            .from("orders")
            .update({
              status: "refunded",
            })
            .eq("id", order.id);

          // Optional: Store refund details in a separate table
          // await supabase.from('refunds').insert({
          //   order_id: order.id,
          //   refund_id: refundId,
          //   amount: amount,
          // });
        }

        console.log(`Refund created: ${refundId}, Amount: ₹${amount}`);
        break;
      }

      default:
        console.log(`Unhandled event: ${event.event}`);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

/**
 * Helper function to send payment confirmation email
 * Implement based on your email service (SendGrid, Resend, etc.)
 */
async function sendPaymentConfirmationEmail(orderId: string, amount: number) {
  try {
    // Example: Using Resend or SendGrid
    // await sendEmail({
    //   to: customerEmail,
    //   subject: `Payment Confirmed - Order #${orderId}`,
    //   template: 'payment-confirmation',
    //   data: { orderId, amount },
    // });
    console.log(`Sending confirmation email for order ${orderId}`);
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }
}
