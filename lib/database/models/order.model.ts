import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IOrder extends Document {
  createdAt: Date;
  midtransId: string; // Ganti stripeId dengan midtransId
  totalAmount: string;
  event: {
    _id: string;
    title: string;
  };
  buyer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export type IOrderItem = {
  _id: string;
  totalAmount: string;
  createdAt: Date;
  eventTitle: string;
  eventId: string;
  buyer: string;
};

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  eventTitle: { type: String, required: true }, // ⬅️ Ini WAJIB ADA
  buyer: { type: String, required: true }, // userId dari Clerk
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;
