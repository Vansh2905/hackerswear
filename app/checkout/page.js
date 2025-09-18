"use client";
import React, { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cart, subTotal, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    country: "India",
    paymentMethod: "COD",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Starting checkout process...');

    const token = localStorage.getItem("token");
    console.log('Token found:', !!token);
    
    // Don't require token for Google users
    // if (!token) {
    //   router.push("/Login");
    //   return;
    // }

    // Convert cart to products array
    const products = Object.keys(cart).map((key) => ({
      productId: key,
      quantity: cart[key].qty,
    }));

    const orderData = {
      products,
      amount: subTotal,
      address: formData,
    };
    
    console.log('Order data:', orderData);

    try {
      const headers = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      console.log('Sending request with headers:', headers);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(orderData),
      });

      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Response data:', result);

      // Check if order was created successfully
      if (response.ok && (result.success || result._id)) {
        toast.success("✅ Order placed successfully!");
        clearCart();
        setTimeout(() => {
          router.push("/orders");
        }, 1000);
      } else {
        toast.error(
          "❌ Error placing order: " + (result.error || "Unknown error")
        );
        console.error('Order creation failed:', result);
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("There was an error placing your order. Please try again.");
    }
  };

  // Convert cart object → array for rendering
  const cartItems = Object.keys(cart).map((key) => ({
    code: key,
    ...cart[key],
  }));

  return (
    <div className="min-h-screen text-black px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between border-b border-gray-300 pb-2"
                >
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>₹{item.price * item.qty}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-between mt-4 text-lg font-bold">
            <span>Total:</span>
            <span>₹{subTotal}</span>
          </div>
        </div>

        {/* Shipping & Payment Form */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-400 text-black"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-400 text-black"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-400 text-black"
              required
            />
            <textarea
              name="address"
              placeholder="Street Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-400 text-black"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-400 text-black"
                required
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-400 text-black"
                required
              />
            </div>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-400 text-black hover:cursor-pointer"
            >
              <option value="COD">Cash on Delivery</option>
              <option value="Card">Credit/Debit Card</option>
              <option value="UPI">UPI</option>
            </select>

            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-green-500 text-lg hover:bg-green-600 rounded-lg transition"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
