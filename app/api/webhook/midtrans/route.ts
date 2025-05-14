import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/actions/order.actions";
import { connectToDatabase } from "@/lib/database";
import Event from "@/lib/database/models/event.model";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      transaction_status,
      order_id,
      custom_field1: eventId,
      custom_field2: buyerId,
    } = body;

    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      await connectToDatabase();
      const event = await Event.findById(eventId);

      if (!event) {
        return NextResponse.json(
          { message: "Event not found" },
          { status: 404 }
        );
      }

      await createOrder({
        stripeId: order_id,
        eventId,
        eventTitle: event.title,
        buyerId,
        createdAt: new Date(),
      });

      return NextResponse.json(
        { message: "Order created successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "No action taken" }, { status: 200 });
  } catch (error) {
    console.error("[MIDTRANS_WEBHOOK_ERROR]", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
