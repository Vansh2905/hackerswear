"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/components/CartProvider";
import { useRouter } from "next/navigation";
import {useUser} from "@/components/UserProvider";
import { ToastContainer, toast } from "react-toastify";

export default function ProductPage({ params }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  const { addCart, BuyNow } = useCart();
 const { user, isLoggedIn } = useUser();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [pin, setPin] = useState("");
  const [service, setService] = useState(null);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/getProducts");
        const products = await res.json();
        const found = products.find((p) => p.slug === slug);
        setProduct(found || null);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [slug]);
  useEffect(() => {
    if (service === false) {
      toast.error("Sorry! We do not deliver to this pincode", {
        position: "bottom-left",
        autoClose: 2000,
      });
    } else if (service === true) {
      toast.success("Yay! This pincode is serviceable", {
        position: "bottom-left",
        autoClose: 2000,
      });
    }
  }, [service]);
  const checkServiceability = async () => {
    try {
      const res = await fetch("/api/pincode");

      if (!res.ok) {
        throw new Error("Network response was not OK");
      }

      const pins = await res.json(); // must be valid JSON
      setService(pins.includes(pin));
    } catch (err) {
      console.error("Error checking pincode:", err);
      toast.error("Something went wrong with pincode check");
    }
  };

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const images =
    product.images && product.images.length
      ? product.images
      : product.img
      ? [product.img]
      : [];
  const sizesArray =
    product.sizes.length > 0
      ? product.sizes[0].split(",").map((s) => s.trim())
      : [];

  const colorsArray =
    product.colors.length > 0
      ? product.colors[0].split(",").map((c) => c.trim())
      : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            {images[selectedImage] && (
              <div className="aspect-square bg-white rounded-lg overflow-hidden">
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg border-2 ${
                    selectedImage === i ? "border-black" : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-gray-600">{product.category}</p>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  % OFF
                </span>
              )}
            </div>
            <p className="text-gray-700">{product.desc}</p>

            {/* Sizes */}
            <div>
              <h3 className="font-semibold mb-2">Sizes</h3>
              <div className="flex gap-2 flex-wrap">
                {sizesArray.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="font-semibold mb-2">Colors</h3>
              <div className="flex gap-2 flex-wrap">
                {colorsArray.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded ${
                      selectedColor === color
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border rounded">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Pincode */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter your pincode"
                className="bg-gray-100 px-2 py-2 border rounded-md border-black"
              />
              <button
                onClick={checkServiceability}
                className="p-2 bg-black text-white rounded-sm"
              >
                Check
              </button>
            </div>
            <ToastContainer
              position="bottom-left"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            {/* Cart / Buy */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!selectedSize || !selectedColor) {
                    toast.error("Please select size and color");
                    return;
                  }

                  if (!isLoggedIn) {
                    router.push("/login");
                    return;
                  }

                  BuyNow(
                    slug,
                    quantity,
                    product.price,
                    product.title,
                    selectedSize,
                    selectedColor
                  );
                  router.push("/checkout");
                }}
                className="w-1/2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                Buy Now
              </button>
              <button
                onClick={() => {
                  if (!selectedSize || !selectedColor) {
                    toast.error("Please select size and color", {
                      position: "bottom-left",
                      autoClose: 2000,
                    });
                    return;
                  }
                  if (!isLoggedIn) {
                    router.push("/login");
                  }
                  addCart(
                    slug,
                    quantity,
                    product.price,
                    product.title,
                    selectedSize,
                    selectedColor
                  );
                  toast.success("Added to cart", { position: "bottom-left", autoClose: 2000});
                }}
                className="w-1/2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                Add to Cart - ₹{product.price * quantity}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
