"use server";

import { isValidObjectId } from "mongoose";
import midtransClient from "midtrans-client";
import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByEventParams,
  GetOrdersByUserParams,
} from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Order from "../database/models/order.model";
import Event from "../database/models/event.model";
import User from "../database/models/user.model";
import { ObjectId } from "mongodb";
import { useUser } from "@clerk/nextjs";

// ========== FUNGSI CHECKOUT MIDTRANS ==========

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const { user } = useUser(); // Ambil data user yang login dari Clerk

  // Pastikan user sudah terautentikasi
  if (!user) {
    throw new Error("User not logged in.");
  }

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
  });

  const price = order.isFree ? 0 : Number(order.price);

  try {
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: `ORDER-${Date.now()}`,
        gross_amount: price, // Menggunakan gross_amount (bukan price)
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
        first_name: user.firstName, // Ambil firstName dari Clerk
        email: user.emailAddresses, // Ambil email pertama
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      },
    });

    return { redirectUrl: transaction.redirect_url };
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
      midtransOrderId: order.midtransOrderId ?? "", // pakai midtransOrderId, sesuaikan dengan yang digunakan
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
  grossAmount, // gunakan grossAmount di sini
  paymentStatus,
  transactionId,
}: {
  eventId: string;
  eventTitle: string;
  buyerEmail: string;
  grossAmount: number; // pastikan tipe data adalah number, sesuai dengan response dari Midtrans
  paymentStatus: "paid" | "unpaid";
  transactionId: string;
}) => {
  try {
    await connectToDatabase();

    // Cek apakah eventId valid
    if (!isValidObjectId(eventId)) {
      console.error("[MIDTRANS WEBHOOK] Invalid eventId format:", eventId);
      throw new Error("Invalid eventId format");
    }

    // Ambil event berdasarkan eventId
    const event = await Event.findById(new ObjectId(eventId));
    if (!event) throw new Error("Event not found");

    // Ambil user berdasarkan email buyer
    const user = await User.findOne({ email: buyerEmail });
    if (!user) throw new Error("User not found");

    // Buat order baru menggunakan grossAmount yang sudah diterima
    const newOrder = await Order.create({
      createdAt: new Date(),
      midtransId: transactionId, // Pakai midtransId sesuai kesepakatan
      totalAmount: String(grossAmount), // Gunakan grossAmount dari parameter
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
