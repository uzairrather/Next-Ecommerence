import connectDB from "../../../../config/db";
import Product from "../../../../models/product";
import { inngest } from "../../../../config/inngest";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "../../../../models/User";
import Order from "../../../../models/Order";

// Utility: Create a unique order key for deduplication
function generateOrderKey(userId, address, items) {
  const itemsKey = items
    .map((item) => `${item.product}-${item.quantity}`)
    .sort()
    .join(",");
  return `${userId}-${address}-${itemsKey}`;
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items, requestId } = await request.json();

    if (!userId || !address || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    await connectDB();

    //  Generate unique key to prevent duplicate orders
    const orderKey = generateOrderKey(userId, address, items);

    // 🔍 Check if identical order exists within last 60 seconds
    const duplicateOrder = await Order.findOne({
      orderKey,
      date: { $gte: Date.now() - 60 * 1000 },
    });

    if (duplicateOrder) {
      return NextResponse.json({
        success: false,
        message: "You already placed this order. Please wait a moment.",
      });
    }

    //  Calculate total amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }
      amount += product.offerPrice * item.quantity;
    }

    const finalAmount = amount + Math.floor(amount * 0.03); // tax/fee

    //  Save the order with orderKey
    const newOrder = await Order.create({
      userId,
      address,
      items,
      amount: finalAmount,
      date: Date.now(),
      orderKey, //  deduplication key
    });

    // Log order to Inngest
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: finalAmount,
        date: newOrder.date,
        requestId: requestId || null,
      },
    });

    //  Clear user cart
    const user = await User.findById(userId);
    user.cartItems = {};
    await user.save();

    return NextResponse.json({ success: true, message: "Order placed successfully." });
  } catch (error) {
    console.error("❌ Order creation error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
