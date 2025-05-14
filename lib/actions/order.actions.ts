"use server";

import midtransClient from "midtrans-client";
import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByEventParams,
  GetOrdersByUserParams,
} from "@/types";
import { redirect } from "next/navigation";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Order from "../database/models/order.model";
import Event from "../database/models/event.model";
import User from "../database/models/user.model";
import { ObjectId } from "mongodb";

// ========== FUNGSI CHECKOUT MIDTRANS ==========
export const checkoutOrder = async (order: CheckoutOrderParams) => {
  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
    });

    const price = order.isFree ? 0 : Number(order.price);

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: `ORDER-${Date.now()}`,
        gross_amount: price,
      },
      item_details: [
        {
          id: order.eventId,
          price: price,
          quantity: 1,
          name: order.eventTitle,
        },
      ],
      customer_details: {
        first_name: "Guest",
        email: "guest@example.com",
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      },
    });

    redirect(transaction.redirect_url);
  } catch (error) {
    console.error("Midtrans Error:", error);
    throw error;
  }
};

// ========== FUNGSI SIMPAN ORDER ==========
export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDatabase();

    const newOrder = await Order.create({
      createdAt: new Date(),
      midtransId: order.midtransId,
      totalAmount: String(order.totalAmount),
      event: order.eventId,
      buyer: order.buyerId,
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
  }
};

// ========== FUNGSI SIMPAN ORDER DARI WEBHOOK MIDTRANS ==========
export const saveOrderFromWebhook = async ({
  eventId,
  eventTitle,
  buyerEmail,
  totalAmount,
  paymentStatus,
  transactionId,
}: {
  eventId: string;
  eventTitle: string;
  buyerEmail: string;
  totalAmount: number;
  paymentStatus: "paid" | "unpaid";
  transactionId: string;
}) => {
  try {
    await connectToDatabase();

    // Cari event berdasarkan eventId
    const event = await Event.findById(new ObjectId(eventId));
    if (!event) throw new Error("Event not found");

    // Cari user berdasarkan email yang dikirimkan
    const user = await User.findOne({ email: buyerEmail });
    if (!user) throw new Error("User not found");

    // Buat order baru dengan data yang valid
    const newOrder = await Order.create({
      createdAt: new Date(),
      midtransId: transactionId,
      totalAmount: String(totalAmount),
      event: event._id,
      buyer: user._id,
      paymentStatus: paymentStatus,
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    console.error("[saveOrderFromWebhook] Error:", error);
    throw error;
  }
};

// ========== GET ORDERS BY EVENT ==========
export async function getOrdersByEvent({
  searchString,
  eventId,
}: GetOrdersByEventParams) {
  try {
    await connectToDatabase();

    if (!eventId) throw new Error("Event ID is required");
    const eventObjectId = new ObjectId(eventId);

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        },
      },
      {
        $unwind: "$buyer",
      },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: "$event",
      },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          createdAt: 1,
          eventTitle: "$event.title",
          eventId: "$event._id",
          buyer: {
            $concat: ["$buyer.firstName", " ", "$buyer.lastName"],
          },
        },
      },
      {
        $match: {
          $and: [
            { eventId: eventObjectId },
            { buyer: { $regex: RegExp(searchString, "i") } },
          ],
        },
      },
    ]);

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    handleError(error);
  }
}

// ========== GET ORDERS BY USER ==========
export async function getOrdersByUser({
  userId,
  limit = 3,
  page,
}: GetOrdersByUserParams) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = { buyer: userId };

    const orders = await Order.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "event",
        model: Event,
        populate: {
          path: "organizer",
          model: User,
          select: "_id firstName lastName",
        },
      });

    const ordersCount = await Order.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(ordersCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
