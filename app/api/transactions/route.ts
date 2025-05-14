import { connectToDatabase } from "@/lib/database";
import Event from "@/lib/database/models/event.model";
import Order from "@/lib/database/models/order.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("📩 Webhook HIT");

  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      order_id,
      transaction_status,
      gross_amount,
      custom_field1: userId,
      custom_field2: eventId,
    } = body;

    if (!order_id || !userId || !eventId) {
      console.error("❌ Missing order_id, userId, or eventId");
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      console.error("❌ Event not found:", eventId);
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    await Order.create({
      orderId: order_id,
      eventId: event._id,
      eventTitle: event.title, // ⬅️ Ini yang sebelumnya gak ada
      buyer: userId,
      totalAmount: gross_amount,
      status: transaction_status,
    });

    console.log("✅ Order saved successfully");
    return NextResponse.json({ message: "OK" });
  } catch (err) {
    console.error("❌ Error saving order:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
