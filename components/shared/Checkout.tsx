"use client";

import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";

declare global {
  interface Window {
    snap: any;
  }
}

const Checkout = ({
  eventId,
  eventTitle,
  price,
  isFree,
  userId,
}: {
  eventId: string;
  eventTitle: string;
  price: string; // Received as string from component props
  isFree: boolean;
  userId: string;
}) => {
  const { user } = useUser();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
    );
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onCheckout = async () => {
    // Parse price to number
    const order = {
      eventId,
      eventTitle,
      price: parseInt(price), // Convert price from string to number
      buyerName: user?.firstName || "Guest",
      buyerEmail: user?.emailAddresses[0]?.emailAddress || "guest@example.com",
      userId, // Send user ID as buyer ID
    };

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      const data = await res.json();

      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: () => alert("Pembayaran berhasil!"),
          onPending: () => alert("Menunggu pembayaran..."),
          onError: () => alert("Pembayaran gagal!"),
          onClose: () => alert("Kamu menutup popup pembayaran."),
        });
      }
    } catch (error) {
      console.error("Midtrans checkout failed:", error);
    }
  };

  return (
    <Button onClick={onCheckout} size="lg" className="button sm:w-fit">
      {isFree ? "Get Ticket" : "Buy Ticket"}
    </Button>
  );
};

export default Checkout;
