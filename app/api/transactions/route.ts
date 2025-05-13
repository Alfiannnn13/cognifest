// app/api/transactions/route.ts
import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(req: Request) {
  const body = await req.json();

  const { orderId, eventTitle, price, customerName, email } = body;

  if (!orderId || !price || !customerName || !email || !eventTitle) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
  });

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: price,
    },
    customer_details: {
      first_name: customerName,
      email,
    },
    item_details: [
      {
        id: orderId,
        name: eventTitle,
        price: price,
        quantity: 1,
      },
    ],
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_BASE_URL}/#profile`,
    },
  };

  const transaction = await snap.createTransaction(parameter);

  return NextResponse.json({ redirect_url: transaction.redirect_url });
}
