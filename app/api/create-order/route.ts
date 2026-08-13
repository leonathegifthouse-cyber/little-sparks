import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase";
import type { CartItem } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { items, customer } = (await req.json()) as {
      items: CartItem[];
      customer: { name: string; email: string; phone: string; address: string };
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }
    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
      return NextResponse.json({ error: "Missing customer details." }, { status: 400 });
    }

    // Recalculate the total server-side — never trust a price sent from the browser.
    const admin = supabaseAdmin();
    const productIds = items.map((i) => i.product_id);
    const { data: dbProducts, error: fetchError } = await admin
      .from("products")
      .select("id, price_paise, stock, is_active")
      .in("id", productIds);

    if (fetchError || !dbProducts) {
      return NextResponse.json({ error: "Could not verify products." }, { status: 500 });
    }

    let totalPaise = 0;
    for (const item of items) {
      const product = dbProducts.find((p: any) => p.id === item.product_id);
      if (!product || !product.is_active) {
        return NextResponse.json(
          { error: `${item.name} is no longer available.` },
          { status: 400 }
        );
      }
      if (product.stock < item.qty) {
        return NextResponse.json(
          { error: `Only ${product.stock} left of ${item.name}.` },
          { status: 400 }
        );
      }
      totalPaise += product.price_paise * item.qty;
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: totalPaise,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    const { data: internalOrder, error: insertError } = await admin
      .from("orders")
      .insert({
        razorpay_order_id: razorpayOrder.id,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address: customer.address,
        items,
        total_paise: totalPaise,
        status: "created",
      })
      .select("id")
      .single();

    if (insertError || !internalOrder) {
      return NextResponse.json({ error: "Could not create order record." }, { status: 500 });
    }

    return NextResponse.json({
      razorpay_order_id: razorpayOrder.id,
      amount: totalPaise,
      internal_order_id: internalOrder.id,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong starting checkout." }, { status: 500 });
  }
}
