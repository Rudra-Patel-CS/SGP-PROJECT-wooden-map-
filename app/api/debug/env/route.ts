import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    razorpay_key_id: process.env.RAZORPAY_KEY_ID || "NOT SET",
    razorpay_key_secret: process.env.RAZORPAY_KEY_SECRET || "NOT SET",
    next_public_razorpay_key_id:
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "NOT SET",
    all_env_keys: Object.keys(process.env).filter((key) =>
      key.includes("RAZORPAY"),
    ),
  });
}
