// app/api/webhook/midtrans/route.ts

import { NextRequest, NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { CreateOrderParams } from "@/types";
import { connectToDatabase } from "@/lib/database";
import Order from "@/lib/database/models/order.model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;

    const core = new midtransClient.CoreApi({
      isProduction: false,
      serverKey,
    });

    const notificationResponse = await core.transaction.notification(body);

    const { order_id, transaction_status, gross_amount } = notificationResponse;

    if (
      transaction_status === "settlement" ||
      transaction_status === "capture"
    ) {
      await connectToDatabase();

      const orderData: CreateOrderParams = {
        stripeId: order_id,
        eventId: body.item_details[0].id,
        buyerId: body.customer_details.email ?? "guest", // bisa diganti sesuai strukturmu
        totalAmount: gross_amount,
        createdAt: new Date(),
      };

      await Order.create({
        ...orderData,
        event: orderData.eventId,
        buyer: orderData.buyerId,
      });
    }

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("[MIDTRANS WEBHOOK ERROR]", error);
    return new NextResponse("Webhook Error", { status: 500 });
  }
}
