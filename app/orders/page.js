"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserProvider";
import { useSession } from "next-auth/react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isLoggedIn } = useUser();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      // Wait for session to load
      if (status === "loading") {
        return;
      }
      
      // Skip authentication check - let the API handle it
      console.log('Auth status:', { isLoggedIn, hasSession: !!session?.user, status });

      try {
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('/api/orders', { headers });

        const data = await response.json();
        console.log('API Response:', data);

        // Handle both response formats
        setOrders(Array.isArray(data) ? data : Array.isArray(data.orders) ? data.orders : []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router, isLoggedIn, session, status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-xl">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">No orders yet.</h2>
        <Link
          href="/"
          className="bg-black text-white  px-6 py-2 rounded-xl hover:bg-blue-500 hover:text-white transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black px-6 py-12">
      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide">
        My Orders
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {orders.map((order) => (
          <div
            key={order._id || order.id}
            className="bg-white text-black p-6 rounded-2xl shadow-lg border border-gray-500 hover:border-black transition"
          >
            <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
              <h2 className="text-xl font-semibold">Order #{order._id?.slice(-6) || order.id}</h2>
              <span className="text-sm text-gray-400">
                {new Date(order.createdAt || order.date).toLocaleDateString()}
              </span>
            </div>

            <p className="mb-4 text-sm font-semibold text-green-400">
              Status: {order.status || "Processing"}
            </p>

            <ul className="space-y-3">
              {order.products?.map((product, index) => (
                <li
                  key={`${order._id}-product-${index}`}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium">Product ID: {product.productId}</p>
                    <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-between mt-6 text-lg font-bold border-t border-gray-700 pt-4">
              <span>Total:</span>
              <span className="text-black">₹{order.amount || order.total}</span>
            </div>

            {order.address && (
              <div className="mt-6 text-sm text-gray-400 space-y-1">
                <p>
                  <strong className="text-gray-400">Address:</strong>{" "}
                  {typeof order.address === 'string' ? order.address : JSON.stringify(order.address)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
