import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { checkoutOrder } from "@/lib/actions/order.actions";
import Midtrans from "midtrans-client";
import { IEvent } from "@/lib/database/models/event.model";

// Inisialisasi Midtrans Snap
const snap = new Midtrans.Snap({
  isProduction: false, // Ganti dengan `true` jika sudah di environment production
  serverKey: process.env.MIDTRANS_SERVER_KEY || "", // Masukkan server key
});

const Checkout = ({ event, userId }: { event: IEvent; userId: string }) => {
  const [error, setError] = useState<string | null>(null);

  // Handle redirect atau cancel status setelah transaksi
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log("Order canceled, feel free to continue shopping.");
    }
  }, []);

  // Function untuk menangani checkout
  const onCheckout = async () => {
    try {
      // Kirim data order ke Midtrans dan dapatkan token pembayaran
      const response = await snap.createTransaction({
        transaction_details: {
          order_id: `${userId}-${event._id}-${Date.now()}`,
          gross_amount: parseFloat(event.price),
        },
        customer_details: {
          first_name: "Customer",
          email: "customer@example.com", // Ganti dengan email pengguna yang valid
        },
      });

      // Setelah token didapat, redirect pengguna ke halaman Midtrans
      window.location.href = response.redirect_url;

      // Simpan data order di DB jika pembayaran sukses
      await checkoutOrder({
        eventTitle: event.title,
        eventId: event._id,
        price: event.price,
        isFree: event.isFree,
        buyerId: userId,
      });
    } catch (err) {
      setError("Checkout failed. Please try again.");
      console.error("Midtrans checkout failed:", err);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <Button onClick={onCheckout} size="lg" className="button sm:w-fit">
        {event.isFree ? "Get Ticket" : "Buy Ticket"}
      </Button>
    </div>
  );
};

export default Checkout;
