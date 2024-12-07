import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = await razorpay.orders.create({
      amount: body.amount, // Razorpay expects the amount in the smallest currency unit
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json({ message: "Error creating order" }, { status: 500 });
  }
}
