// import { Schema, model, models, Document } from "mongoose";

// // Interface untuk tipe data Order
// export interface IOrder extends Document {
//   createdAt: Date;
//   midtransOrderId: string;
//   totalAmount: number; // Menggunakan number untuk totalAmount
//   event: {
//     _id: string;
//     title: string;
//   };
//   buyer: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//   };
// }

// // Schema untuk Order
// const OrderSchema = new Schema<IOrder>({
//   createdAt: {
//     type: Date,
//     default: Date.now, // Secara default, waktu pembuatan order diambil dari Date.now
//   },
//   midtransOrderId: {
//     type: String,
//     required: true,
//     unique: true, // Memastikan setiap order punya ID unik dari Midtrans
//   },
//   totalAmount: {
//     type: Number, // Menggunakan tipe Number untuk totalAmount (seharusnya angka, bukan string)
//     required: true, // Total amount wajib ada untuk setiap order
//   },
//   event: {
//     type: Schema.Types.ObjectId, // Menggunakan ObjectId untuk relasi ke model Event
//     ref: "Event", // Referensi ke model Event
//     required: true, // Pastikan relasi event ada
//   },
//   buyer: {
//     type: Schema.Types.ObjectId, // Menggunakan ObjectId untuk relasi ke model User
//     ref: "User", // Referensi ke model User
//     required: true, // Pastikan relasi buyer ada
//   },
// });

// // Membuat model Order
// const Order = models.Order || model<IOrder>("Order", OrderSchema);

// // Export model
// export default Order;
import { Schema, model, models, Document } from "mongoose";

// Interface untuk tipe data Order
export interface IOrder extends Document {
  createdAt: Date;
  midtransOrderId: string;
  totalAmount: number; // Menggunakan number untuk totalAmount
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

// Schema untuk Order
const OrderSchema = new Schema<IOrder>({
  createdAt: {
    type: Date,
    default: Date.now, // Secara default, waktu pembuatan order diambil dari Date.now
  },
  midtransOrderId: {
    type: String,
    required: true,
    unique: true, // Memastikan setiap order punya ID unik dari Midtrans
  },
  totalAmount: {
    type: Number, // Menggunakan tipe Number untuk totalAmount (seharusnya angka, bukan string)
    required: true, // Total amount wajib ada untuk setiap order
  },
  event: {
    type: Schema.Types.ObjectId, // Menggunakan ObjectId untuk relasi ke model Event
    ref: "Event", // Referensi ke model Event
    required: true, // Pastikan relasi event ada
  },
  buyer: {
    type: Schema.Types.ObjectId, // Menggunakan ObjectId untuk relasi ke model User
    ref: "User", // Referensi ke model User
    required: true, // Pastikan relasi buyer ada
  },
});

export type IOrderItem = {
  _id: string;
  totalAmount: string;
  createdAt: Date;
  eventTitle: string;
  eventId: string;
  buyer: string;
};
// Membuat model Order
const Order = models.Order || model<IOrder>("Order", OrderSchema);

// Export model
export default Order;
