import Product from "@/models/Product";
import connectdb from "@/middleware/mongoose";
import { NextResponse } from "next/server";

// PUT handler
export async function PUT(request) {
  try {
    await connectdb();

    const body = await request.json();
    const { id, title, slug, desc, img, category, price, availableQty } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Build update object dynamically (ignore undefined fields)
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (desc !== undefined) updateData.desc = desc;
    if (img !== undefined) updateData.img = img;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (availableQty !== undefined) updateData.availableQty = availableQty;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "✅ Product updated", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/products error:", error);
    return NextResponse.json(
      { error: "Database Connection Error", details: error.message },
      { status: 500 }
    );
  }
}
