import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  stripeId: {
    type: String,
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  eventTitle: {
    type: String,
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
