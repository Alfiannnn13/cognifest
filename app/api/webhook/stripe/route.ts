// /app/api/webhook/stripe/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder } from "@/lib/actions/order.actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function GET() {
  return NextResponse.json({ message: "Stripe webhook endpoint is live ✅" });
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return NextResponse.json({ message: "Webhook error", error: err });
  }

  console.log("✅ Stripe webhook event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const order = {
      stripeId: session.id,
      eventId: session.metadata?.eventId || "",
      buyerId: session.metadata?.buyerId || "",
      totalAmount: session.amount_total
        ? (session.amount_total / 100).toString()
        : "0",
      createdAt: new Date(),
    };

    try {
      const newOrder = await createOrder(order);
      console.log("✅ Order created:", newOrder);
      return NextResponse.json({ message: "Order saved", order: newOrder });
    } catch (err) {
      console.error("❌ Failed to save order:", err);
      return NextResponse.json({ message: "DB error", error: err });
    }
  }

  return new Response("", { status: 200 });
}
