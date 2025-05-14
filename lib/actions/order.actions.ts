"use server";

import { redirect } from "next/navigation";
import { snap } from "../utils/midtrans";
import { CheckoutOrderParams, CreateOrderParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Order from "../database/models/order.model";

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const grossAmount = order.isFree ? 0 : Number(order.price);

  const midtransPayload = {
    transaction_details: {
      order_id: `ORDER-${Date.now()}`, // unique order ID
      gross_amount: grossAmount,
    },
    item_details: [
      {
        id: order.eventId,
        price: grossAmount,
        quantity: 1,
        name: order.eventTitle,
      },
    ],
    customer_details: {
      first_name: order.buyerId,
    },
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
    },
    custom_field1: order.eventId,
    custom_field2: order.buyerId,
  };

  try {
    const transaction = await snap.createTransaction(midtransPayload);
    const redirectUrl = transaction.redirect_url;
    redirect(redirectUrl);
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDatabase();

    const newOrder = await Order.create({
      ...order,
      event: order.eventId,
      buyer: order.buyerId,
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
  }
};
