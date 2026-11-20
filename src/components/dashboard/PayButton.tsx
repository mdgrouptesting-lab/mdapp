"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { authedFetch } from "@/lib/firebase";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void; on: (ev: string, cb: (r: { error?: { description?: string } }) => void) => void };
declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => RazorpayInstance;
  }
}

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function PayButton({ label, className, onDone }: { label: string; className?: string; onDone?: (ok: boolean, msg: string) => void }) {
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    try {
      const ok = await loadScript();
      if (!ok || !window.Razorpay) throw new Error("Could not load payment window. Check your internet connection.");
      const order = await authedFetch("/api/payment/create-order", { method: "POST", body: "{}" });
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "MD Group",
        description: order.description,
        image: "/icons/icon-192.png",
        prefill: { name: order.name, email: order.email, contact: order.phone },
        theme: { color: "#f98207" },
        handler: async (resp: RazorpayResponse) => {
          try {
            await authedFetch("/api/payment/verify", { method: "POST", body: JSON.stringify(resp) });
            onDone?.(true, "Payment successful! Your membership is now active.");
          } catch (e) {
            onDone?.(false, e instanceof Error ? e.message : "Verification failed. Contact MD Group with your payment ID.");
          } finally {
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.on("payment.failed", (r) => {
        onDone?.(false, r.error?.description || "Payment failed");
        setLoading(false);
      });
      rzp.open();
    } catch (e) {
      onDone?.(false, e instanceof Error ? e.message : "Payment failed");
      setLoading(false);
    }
  }

  return (
    <button onClick={pay} disabled={loading} className={cn("btn-primary", className)}>
      {loading ? <Spinner /> : <CreditCard className="h-5 w-5" />} {label}
    </button>
  );
}
