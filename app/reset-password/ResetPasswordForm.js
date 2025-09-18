"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      router.push("/forgot-password");
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Reset failed");
        return;
      }

      toast.success("Password reset successful!");
      router.push("/Login");
    } catch (err) {
      console.error("Reset Password Error:", err);
      toast.error("Server error, try again later");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.3),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.3),transparent_50%)] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer w-full p-3 rounded-lg bg-black/50 border border-gray-600 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="New Password"
            />
            <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:left-2 peer-focus:text-xs peer-focus:text-green-400">
              New Password
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="peer w-full p-3 rounded-lg bg-black/50 border border-gray-600 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Confirm Password"
            />
            <label htmlFor="confirmPassword" className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:left-2 peer-focus:text-xs peer-focus:text-green-400">
              Confirm Password
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #22c55e" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 font-semibold text-lg rounded-lg transition bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
          >
            Reset Password
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
