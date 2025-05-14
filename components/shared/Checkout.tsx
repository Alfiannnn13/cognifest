"use client";

import React, { useEffect, useTransition } from "react";
import { IEvent } from "@/lib/database/models/event.model";
import { Button } from "../ui/button";
import { checkoutOrder } from "@/lib/actions/order.actions";
import { useUser } from "@clerk/nextjs"; // 🔥 import user Clerk

const Checkout = ({ event, userId }: { event: IEvent; userId: string }) => {
  const [isPending, startTransition] = useTransition();
  const { user: clerkUser } = useUser(); // 🧠 Ambil user Clerk

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  const onCheckout = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: Number(event.price),
      isFree: event.isFree,
      buyerId: userId,
      buyerEmail: clerkUser?.emailAddresses[0]?.emailAddress || "", // ✅ FIXED
    };

    try {
      const res = await checkoutOrder(order);

      if (res?.redirectUrl) {
        window.location.href = res.redirectUrl;
      } else {
        console.error("Redirect URL not found in response");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return (
    <Button
      onClick={() => startTransition(onCheckout)}
      role="link"
      size="lg"
      disabled={isPending}
      className="button sm:w-fit"
    >
      {isPending ? "Processing..." : event.isFree ? "Get Ticket" : "Buy Ticket"}
    </Button>
  );
};

export default Checkout;
