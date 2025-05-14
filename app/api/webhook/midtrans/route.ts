import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { connectToDatabase } from "@/lib/database";
import { saveOrderFromWebhook } from "@/lib/actions/order.actions";
import User from "@/lib/database/models/user.model";
import Event from "@/lib/database/models/event.model";
import { ObjectId } from "mongodb"; // Mengimpor ObjectId untuk konversi

export async function POST(req: Request) {
  const body = await req.json();

  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey,
  });

  const signatureKey = body.signature_key;
  const expectedSignature = require("crypto")
    .createHash("sha512")
    .update(body.order_id + body.status_code + body.gross_amount + serverKey)
    .digest("hex");

  if (signatureKey !== expectedSignature) {
    console.error("[MIDTRANS] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    body.transaction_status === "settlement" ||
    body.transaction_status === "capture"
  ) {
    // Ambil eventId yang valid dari order_id
    const orderId = body?.order_id; // Misalnya "ORDER-12345"
    const eventId = orderId.split("-")[1]; // Ambil bagian setelah "-" (misalnya 12345)

    const buyerEmail = body?.customer_details?.email; // Email dari webhook

    try {
      // Koneksi ke database
      await connectToDatabase();

      // Pastikan eventId adalah ObjectId yang valid (panjang 24 karakter dan berupa hexadecimal)
      if (!ObjectId.isValid(eventId)) {
        console.error("[MIDTRANS WEBHOOK] Invalid eventId format");
        return NextResponse.json(
          { error: "Invalid eventId format" },
          { status: 400 }
        );
      }

      // Ambil data event dari database
      const eventObjectId = new ObjectId(eventId); // Konversi string ke ObjectId
      const event = await Event.findOne({ _id: eventObjectId });

      if (!event) {
        console.error("[MIDTRANS WEBHOOK] Event not found");
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }

      // Ambil data user berdasarkan email
      const user = await User.findOne({ email: buyerEmail });

      if (!user) {
        console.error("[MIDTRANS WEBHOOK] User not found");
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Menyusun data order yang akan disimpan
      const orderData = {
        eventId: eventObjectId.toString(), // Menggunakan ObjectId yang valid
        eventTitle: event.title, // Mengambil title dari database
        buyerEmail: user.email, // Menggunakan email dari database
        totalAmount: Number(body?.gross_amount),
        paymentStatus: "paid" as const,
      };

      // Simpan order ke database
      await saveOrderFromWebhook(orderData);
      return NextResponse.json({ message: "Order saved" }, { status: 200 });
    } catch (error) {
      console.error("[MIDTRANS WEBHOOK] Error saving order:", error);
      return NextResponse.json({ error: "DB Save Failed" }, { status: 500 });
    }
  }

  return NextResponse.json(
    { message: "Ignored non-paid transaction" },
    { status: 200 }
  );
}
