import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      internal_order_id,
    } = await req.json();

    // Verify the signature Razorpay sent back really came from Razorpay,
    // by recomputing it with our secret key and comparing.
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const verified = expectedSignature === razorpay_signature;

    const admin = supabaseAdmin();

    if (verified) {
      // Fetch the order to know which products/quantities to decrement stock for.
      const { data: order } = await admin
        .from("orders")
        .select("items")
        .eq("id", internal_order_id)
        .single();

      await admin
        .from("orders")
        .update({
          razorpay_payment_id,
          status: "paid",
        })
        .eq("id", internal_order_id);

      if (order?.items) {
        for (const item of order.items as { product_id: string; qty: number }[]) {
          await admin.rpc("decrement_stock", {
            product_id_input: item.product_id,
            qty_input: item.qty,
          });
        }
      }
    } else {
      await admin.from("orders").update({ status: "failed" }).eq("id", internal_order_id);
    }

    return NextResponse.json({ verified });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
