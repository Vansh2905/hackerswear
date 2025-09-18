import Product from "@/models/Product";
import connectdb from "@/middleware/mongoose";
import { NextResponse } from "next/server";

// Wrap DB connection
async function dbConnect() {
  await connectdb();
}

// GET handler
export async function GET(request) {
  try {
    await dbConnect();

    const products = await Product.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
