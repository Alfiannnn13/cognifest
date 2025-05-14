// lib/utils/midtrans.ts
import midtransClient from "midtrans-client";

export const snap = new midtransClient.Snap({
  isProduction: false, // set true jika sudah live
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});
