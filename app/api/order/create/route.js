import connectDB from "../../../../config/db";
import Product from "../../../../models/product";
import { inngest } from "../../../../config/inngest";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "../../../../models/User";
import Order from "../../../../models/Order";

// Utility: Convert items array to a comparable string key
function generateItemsKey(items) {
  return items
    .map((item) => `${item.product}-${item.quantity}`)
    .sort()
    .join(",");
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items, requestId } = await request.json();

    // ✅ Validate input
    if (!userId || !address || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    await connectDB();

    // ✅ Prepare unique key from items
    const itemsKey = generateItemsKey(items);

    // ✅ Optional deduplication (based on address, user, items within 1 min)
    const duplicateOrder = await Order.findOne({
      userId,
      address,
      date: { $gte: Date.now() - 60 * 1000 },
      "items.product": { $in: items.map((i) => i.product) },
    });

    if (duplicateOrder) {
      return NextResponse.json({
        success: false,
        message: "You recently placed a similar order. Please wait a few seconds.",
      });
    }

    // ✅ Calculate total amount
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

    // ✅ Save order
    const newOrder = await Order.create({
      userId,
      address,
      items,
      amount: finalAmount,
      date: Date.now(),
    });

    // ✅ Log order to Inngest
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

    // ✅ Clear user's cart
    const user = await User.findById(userId);
    user.cartItems = {};
    await user.save();

    return NextResponse.json({ success: true, message: "Order placed successfully." });
  } catch (error) {
    console.error("❌ Order creation error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
