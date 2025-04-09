import connectDB from "../../../../config/db";
import Product from "../../../../models/product";
import { inngest } from "../../../../config/inngest";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "../../../../models/User";
import Order from "../../../../models/Order"; // ✅ import this

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    await connectDB(); // ✅ make sure DB is connected

    // ⛔️ Check for recent duplicate order (within last 30s)
    const lastOrder = await Order.findOne({ userId }).sort({ date: -1 });

    if (lastOrder && Date.now() - lastOrder.date < 30 * 1000) {
      return NextResponse.json({
        success: false,
        message: "You just placed an order. Please wait a few seconds.",
      });
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

    // ✅ Save order to MongoDB
    const newOrder = await Order.create({
      userId,
      address,
      items,
      amount: amount + Math.floor(amount * 0.03),
      date: Date.now(),
    });

    // ✅ Fire Inngest event (optional)
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: amount + Math.floor(amount * 0.03),
        date: newOrder.date,
      },
    });

    // ✅ Clear cart
    const user = await User.findById(userId);
    user.cartItems = {};
    await user.save();

    return NextResponse.json({ success: true, message: "Order placed" });
  } catch (error) {
    console.error("❌ Order creation failed:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
