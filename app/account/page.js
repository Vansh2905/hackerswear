"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, ShoppingBag, CreditCard, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/components/UserProvider";
import { useSession } from "next-auth/react";

const Account = () => {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useUser();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn && status !== "loading") {
      router.push("/Login");
    }
  }, [mounted, isLoggedIn, status, router]);

  const handleLogout = () => {
    logout();
  };

  if (!mounted || status === "loading" || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse text-gray-400 text-lg">
          Loading your account...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <div className="border-b bg-gradient-to-bl from-gray-900 to-black py-7 px-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white text-black rounded-full w-24 h-24 flex items-center justify-center text-3xl font-bold shadow-md">
            {user.image ? (
              <img 
                src={user.image} 
                alt={user.name} 
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : user.name ? (
              user.name[0].toUpperCase()
            ) : (
              <User size={40} />
            )}
          </div>
          <h1 className="text-3xl font-bold">Hi, {user.name || "Guest"} 👋</h1>
          <p className="text-sm text-gray-400">{user.email}</p>
          {session && (
            <p className="text-xs text-green-400">Signed in with Google</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="bg-zinc-900 rounded-xl shadow-md p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Profile Info</h2>
          <ul className="divide-y divide-gray-800 text-sm">
            <li className="py-2">
              <span className="font-medium">Phone:</span> {user.phone || "N/A"}
            </li>
            <li className="py-2">
              <span className="font-medium">Address:</span>{" "}
              {user.address || "N/A"}
            </li>
            <li className="py-2">
              <span className="font-medium">City:</span> {user.city || "N/A"}
            </li>
            <li className="py-2">
              <span className="font-medium">Country:</span>{" "}
              {user.country || "India"}
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Link
              href="/orders"
              className="flex flex-col items-center justify-center bg-zinc-900 p-8 rounded-xl shadow-md border border-gray-800 hover:border-white hover:shadow-xl transition hover:bg-white/45 hover:text-black"
            >
              <ShoppingBag size={40} className="text-white mb-3" />
              <span className="text-lg font-semibold">My Orders</span>
              <p className="text-sm text-gray-400 mt-1">
                Track and view past orders
              </p>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Link
              href="/checkout"
              className="flex flex-col items-center justify-center bg-zinc-900 p-8 rounded-xl shadow-md border border-gray-800 hover:border-white hover:shadow-xl hover:bg-white/45 hover:text-black transition"
            >
              <CreditCard size={40} className="text-white mb-3" />
              <span className="text-lg font-semibold">Checkout</span>
              <p className="text-sm text-gray-400 mt-1">
                Complete your purchase
              </p>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="sm:col-span-2"
          >
            <Link
              href="/"
              className="flex flex-col items-center justify-center bg-zinc-900 p-8 rounded-xl shadow-md border border-gray-800 hover:border-white hover:shadow-xl hover:bg-white/45 hover:text-black transition"
            >
              <ShoppingBag size={40} className="text-white mb-3" />
              <span className="text-lg font-semibold">Continue Shopping</span>
              <p className="text-sm text-gray-400 mt-1">
                Browse new products
              </p>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Sticky Logout */}
      <div className="bg-black border-t border-gray-800 py-4 flex justify-center">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white text-xl font-semibold text-black hover:bg-red-500 py-3 px-6 rounded-xl shadow-md transition hover:text-white cursor-pointer"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Account;
