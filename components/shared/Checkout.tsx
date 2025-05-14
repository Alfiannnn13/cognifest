import { checkoutOrder } from "@/lib/actions/order.actions";
import { CheckoutOrderParams } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { Button } from "../ui/button";

type CheckoutProps = {
  userId: string;
  eventId: string;
  eventTitle: string;
  price: string;
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async () => {
    setError(null); // Reset error before new attempt
    startTransition(async () => {
      try {
        await checkoutOrder({
          buyerId: userId,
          eventId,
          eventTitle,
          price: String(price),
          isFree,
        });
        router.push("/profile"); // Redirect to profile after successful checkout
      } catch (err) {
        console.error("Checkout failed:", err);
        setError("Checkout failed. Please try again later.");
      }
    });
  };

  return (
    <div>
      <Button onClick={handleCheckout} disabled={isPending} className="w-full">
        {isFree ? "Get Ticket" : "Buy Ticket"}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
      {/* Show error message */}
    </div>
  );
};

export default Checkout;
