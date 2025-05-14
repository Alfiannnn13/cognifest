"use client";

import { checkoutOrder } from "@/lib/actions/order.actions";
import { CheckoutOrderParams } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui/button";

type CheckoutProps = {
  userId: string;
  eventId: string;
  eventTitle: string;
  price: number;
  isFree: boolean;
};

const Checkout = ({
  userId,
  eventId,
  eventTitle,
  price,
  isFree,
}: CheckoutProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCheckout = async () => {
    startTransition(async () => {
      try {
        await checkoutOrder({
          buyerId: userId,
          eventId,
          eventTitle,
          price,
          isFree,
        });
      } catch (err) {
        console.error("Checkout failed:", err);
      }
    });
  };

  return (
    <Button onClick={handleCheckout} disabled={isPending} className="w-full">
      {isFree ? "Get Ticket" : "Buy Ticket"}
    </Button>
  );
};

export default Checkout;
