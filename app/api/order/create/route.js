import Product from "../../../../models/product";
import { inngest } from "../../../../config/inngest";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "../../../../models/User";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    // ✅ calculate amount properly
    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return NextResponse.json({
          success: false,
          message: `Product not found for ID: ${item.product}`,
        });
      }

      amount += product.offerPrice * item.quantity;
    }

    // ✅ fire event
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: amount + Math.floor(amount * 0.03),
        date: Date.now(),
      },
    });

    // ✅ clear cart
    const user = await User.findById(userId);
    user.cartItems = {};
    await user.save();

    return NextResponse.json({ success: true, message: "Order placed" });
  } catch (error) {
    console.error("❌ Order creation failed:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
