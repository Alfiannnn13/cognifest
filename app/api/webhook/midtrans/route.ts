import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/actions/order.actions";
import { connectToDatabase } from "@/lib/database";
import Event from "@/lib/database/models/event.model";
import { isValidObjectId } from "mongoose"; // Import untuk validasi ObjectId jika perlu

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      transaction_status,
      order_id,
      gross_amount, // Pastikan gross_amount ada dalam payload
      custom_field1: eventId,
      custom_field2: buyerId,
    } = body;

    // Cek jika status transaksi adalah 'capture' atau 'settlement'
    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      await connectToDatabase();

      // Validasi eventId
      if (!isValidObjectId(eventId)) {
        return NextResponse.json(
          { message: "Invalid event ID format" },
          { status: 400 }
        );
      }

      // Ambil data event berdasarkan eventId
      const event = await Event.findById(eventId);

      if (!event) {
        return NextResponse.json(
          { message: "Event not found" },
          { status: 404 }
        );
      }

      // Simpan order baru ke database
      await createOrder({
        eventId,
        eventTitle: event.title,
        buyerId,
        totalAmount: gross_amount.toString(), // Gunakan gross_amount dari payload
        midtransOrderId: order_id, // Gunakan order_id dari Midtrans
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
