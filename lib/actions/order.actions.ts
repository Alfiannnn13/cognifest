"use server";

import { redirect } from "next/navigation";
import { snap } from "../utils/midtrans";
import { CheckoutOrderParams, CreateOrderParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Order from "../database/models/order.model";

// ✅ Untuk mulai transaksi dan redirect ke Midtrans
export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const grossAmount = order.isFree ? 0 : Number(order.price);

  const midtransPayload = {
    transaction_details: {
      order_id: `ORDER-${Date.now()}`,
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

// ✅ Simpan order setelah Midtrans berhasil (dipanggil dari webhook)
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

// ✅ Ambil semua order berdasarkan user (untuk halaman Profile)
export const getOrdersByUser = async (userId: string) => {
  try {
    await connectToDatabase();

    const orders = await Order.find({ buyer: userId })
      .populate("event")
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    handleError(error);
  }
};

// ✅ Ambil semua order berdasarkan event (untuk admin event)
export const getOrdersByEvent = async (eventId: string) => {
  try {
    await connectToDatabase();

    const orders = await Order.find({ event: eventId })
      .populate("buyer")
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    handleError(error);
  }
};

// ✅ Ambil 1 order by ID
export const getOrderById = async (orderId: string) => {
  try {
    await connectToDatabase();

    const order = await Order.findById(orderId).populate("buyer event");
    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    handleError(error);
  }
};
