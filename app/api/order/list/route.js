import connectDB from "../../../../config/db";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import Order from "../../../../models/Order";
import Address from "../../../../models/Address";
import Product from "../../../../models/product";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find({ userId })
      .populate("address")
      .populate("items.product");

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error in /api/order/list:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
