"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatINR } from "@/lib/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, totalPaise, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePay() {
    setError("");
    if (!form.name || !form.email || !form.phone || !form.address) {
      setError("Please fill in every field so we know where to ship your order.");
      return;
    }
    setLoading(true);

    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer: form }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Could not start checkout.");

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Leona",
        description: "Kids' gifts order",
        order_id: orderData.razorpay_order_id,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#FF6B4A" },
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              internal_order_id: orderData.internal_order_id,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.verified) {
            clear();
            router.push(`/order/success?order=${orderData.internal_order_id}`);
          } else {
            setError("Payment could not be verified. If money was deducted, contact us — no order was placed.");
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      });
      rzp.on("payment.failed", function () {
        setError("Payment failed. You have not been charged — please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-10">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <h1 className="mb-6 font-display text-3xl text-ink">Checkout</h1>

      <div className="flex flex-col gap-4 rounded-2xl border-2 border-ink bg-white p-6 shadow-[4px_4px_0_0_#2B2250]">
        <Field label="Full name" value={form.name} onChange={(v) => update("name", v)} />
        <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} />
        <Field label="Phone" type="tel" value={form.phone} onChange={(v) => update("phone", v)} />
        <div>
          <label className="mb-1 block font-body text-sm font-bold text-ink">
            Shipping address
          </label>
          <textarea
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            rows={3}
            className="w-full rounded-xl border-2 border-ink/20 px-3 py-2 font-body focus:border-coral focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border-2 border-ink bg-sunshine/40 p-5">
        <span className="font-display text-xl text-ink">Total</span>
        <span className="font-display text-2xl text-ink">{formatINR(totalPaise)}</span>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border-2 border-coral bg-white p-3 font-body text-sm text-coral-dark">
          {error}
        </p>
      )}

      <button
        onClick={handlePay}
        disabled={loading || items.length === 0}
        className="mt-6 w-full rounded-full bg-coral py-4 font-body text-lg font-bold text-white shadow-[3px_3px_0_0_#2B2250] transition hover:bg-coral-dark disabled:cursor-not-allowed disabled:bg-ink/20 disabled:shadow-none"
      >
        {loading ? "Opening payment..." : `Pay ${formatINR(totalPaise)} with Razorpay`}
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block font-body text-sm font-bold text-ink">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-2 border-ink/20 px-3 py-2 font-body focus:border-coral focus:outline-none"
      />
    </div>
  );
}
