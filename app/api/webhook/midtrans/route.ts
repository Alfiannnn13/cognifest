import { NextResponse } from "next/server";
import { saveOrderFromWebhook } from "@/lib/actions/order.actions";
import mongoose from "mongoose";
import Event from "@/lib/database/models/event.model"; // buat ambil title dari DB

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { order_id, transaction_status, transaction_id, gross_amount } = body;

    const [eventId, buyerId] = order_id.split("_");

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      console.error("[WEBHOOK] Invalid eventId format:", eventId);
      return NextResponse.json(
        { message: "Invalid eventId format" },
        { status: 400 }
      );
    }

    // ✅ Ambil eventTitle dari database
    const event = await Event.findById(eventId).lean();
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    await saveOrderFromWebhook({
      eventId,
      eventTitle: event.title, // ✅ Ambil dari DB, bukan dari Midtrans
      buyerEmail: body.customer_email || "", // pastikan kamu enable email di Midtrans
      totalAmount: gross_amount,
      paymentStatus: transaction_status === "settlement" ? "paid" : "unpaid",
      transactionId: transaction_id,
    });

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (err) {
    console.error("[MIDTRANS WEBHOOK ERROR]", err);
    return NextResponse.json({ message: "Webhook Error" }, { status: 500 });
  }
}
