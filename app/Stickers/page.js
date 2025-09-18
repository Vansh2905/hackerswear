"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const Stickers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/getProducts");
        const data = await res.json();
        const stickers = data.filter((p) => p.category === "Stickers");
        setProducts(stickers);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return <div className="text-center py-20 text-lg">Loading products...</div>;

  if (!products.length)
    return <div className="text-center py-20 text-lg">No stickers found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h1 className="text-3xl font-bold text-center mb-10">
        Stickers Collection
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition"
          >
            <Link href={`/product/${item.slug}`}>
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-70 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
              />
              <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
              <p className="text-gray-600">₹{item.price}</p>
            </Link>
            <Link href={`/product/${item.slug}`}>
            <button className="mt-4 w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 cursor-pointer transition-colors duration-200">
              Add to Cart
            </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stickers;
