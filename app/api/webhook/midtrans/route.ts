import { NextResponse } from "next/server";
import { saveOrderFromWebhook } from "@/lib/actions/order.actions";

export async function POST(request: Request) {
  const body = await request.json(); // Parse JSON dari request body

  // Pastikan parameter penting ada dalam data
  if (!body.transaction_status || !body.order_id || !body.payment_type) {
    return NextResponse.json(
      { message: "Invalid webhook data" },
      { status: 400 }
    );
  }

  try {
    // Ambil data dari body yang dikirim Midtrans
    const { transaction_status, order_id, payment_type, gross_amount, email } =
      body;

    // Simpan atau perbarui status order
    await saveOrderFromWebhook({
      eventId: order_id, // Ganti dengan ID event dari database jika diperlukan
      eventTitle: "Some Event", // Sesuaikan dengan nama event
      buyerEmail: email, // Ambil dari body email
      totalAmount: gross_amount,
      paymentStatus: transaction_status === "settlement" ? "paid" : "unpaid",
      transactionId: body.transaction_id,
    });

    return NextResponse.json(
      { message: "Webhook received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing Midtrans webhook:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
