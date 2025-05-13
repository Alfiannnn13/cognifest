import { Schema, model, models, Document } from "mongoose";

export interface IOrder extends Document {
  createdAt: Date;
  stripeId: string;
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

const OrderSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    required: true,
    unique: true,
  },
  totalAmount: {
    type: String,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;

// new
// const OrderSchema = new Schema({
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   totalAmount: {
//     type: String,
//   },
//   status: {
//     type: String,
//     enum: ["pending", "confirmed", "cancelled"],
//     default: "pending",
//   },
//   event: {
//     type: Schema.Types.ObjectId,
//     ref: "Event",
//     required: true,
//   },
//   buyerId: {
//     type: String, // Clerk userId
//     required: true,
//   },
//   buyerUsername: String,
//   buyerEmail: String,
//   buyerFirstName: String,
//   buyerLastName: String,
// });

// const Order = models.Order || model("Order", OrderSchema);
// export default Order;
