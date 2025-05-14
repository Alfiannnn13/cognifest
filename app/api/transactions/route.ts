import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    });

    const parameter = {
      transaction_details: {
        order_id: `order-${Date.now()}`,
        gross_amount: body.price,
      },
      customer_details: {
        first_name: body.buyerName,
        email: body.buyerEmail,
      },
      item_details: [
        {
          id: body.eventId,
          name: body.eventTitle,
          quantity: 1,
          price: body.price,
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({ token: transaction.token }, { status: 200 });
  } catch (err) {
    console.error("[MIDTRANS_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
