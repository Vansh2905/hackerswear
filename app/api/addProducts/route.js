import Product from "@/models/Product";
import connectdb from "@/middleware/mongoose";

export async function POST(req) {
  try {
    await connectdb();
    const body = await req.json();

    // always an array
    const products = Array.isArray(body) ? body : [body];

    const formatted = products.map((p) => {
      if (
        !p.name ||
        !p.slug ||
        !p.description ||
        !p.images?.length ||
        !p.category ||
        !p.price ||
        p.availableQty == null
      ) {
        throw new Error(`All fields are required for product: ${p.name || "Unknown"}`);
      }

      return {
        title: p.name, // ✅ mapped
        slug: p.slug,
        desc: p.description, // ✅ mapped
        img: Array.isArray(p.images) ? p.images[0] : p.images, // ✅ schema expects single string
        category: p.category,
        price: p.price,
        availableQty: p.availableQty,
        sizes: Array.isArray(p.sizes) ? p.sizes.join(", ") : p.sizes, // ✅ string
        colors: Array.isArray(p.colors) ? p.colors.join(", ") : p.colors, // ✅ string
        originalPrice: p.originalPrice, 
      };
    });

    const inserted = await Product.insertMany(formatted);

    return new Response(
      JSON.stringify({ message: "✅ Products added", products: inserted }),
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Error in addProducts:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500 }
    );
  }
}
