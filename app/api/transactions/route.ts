// import { NextResponse } from "next/server";
// import midtransClient from "midtrans-client";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const snap = new midtransClient.Snap({
//       isProduction: false,
//       serverKey: process.env.MIDTRANS_SERVER_KEY!,
//       clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
//     });

//     const parameter = {
//       transaction_details: {
//         order_id: `order-${Date.now()}`,
//         gross_amount: body.price,
//       },
//       customer_details: {
//         first_name: body.buyerName,
//         email: body.buyerEmail,
//       },
//       item_details: [
//         {
//           id: body.eventId,
//           name: body.eventTitle,
//           quantity: 1,
//           price: body.price,
//         },
//       ],
//     };

//     const transaction = await snap.createTransaction(parameter);

//     return NextResponse.json({ token: transaction.token }, { status: 200 });
//   } catch (err) {
//     console.error("[MIDTRANS_ERROR]", err);
//     return NextResponse.json(
//       { error: "Failed to create transaction" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { eventId, eventTitle, price, buyerName, buyerEmail, userId } = body;

    if (
      !eventId ||
      !eventTitle ||
      !price ||
      !buyerName ||
      !buyerEmail ||
      !userId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
    });

    const orderId = `order-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price,
      },
      customer_details: {
        first_name: buyerName,
        email: buyerEmail,
      },
      item_details: [
        {
          id: eventId,
          name: eventTitle,
          quantity: 1,
          price: price,
        },
      ],
      custom_field1: eventId, // ✅ Untuk webhook: eventId
      custom_field2: userId, // ✅ Untuk webhook: userId
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
