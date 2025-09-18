"use client";
import React, { useState,useEffect} from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const Forgot= () => {
  const router=useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const error="";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("/api/forgotPass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    toast.success(data.message || "Check your email for reset link");
  } catch (err) {
    console.error(err);
    alert("Server error. Please try again later.");
  }
};

   useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/");
      }
    }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.3),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.3),transparent_50%)] animate-pulse" />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8"
      >
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Forgot Password
        </h1>
        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-center text-red-400 font-medium bg-red-900/30 p-2 rounded-lg"
          >
            {error}
          </motion.p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-gray-400 text-center mb-6">
          Enter your email to reset your password.
        </p>
          {/* Floating label Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="peer w-full p-3 rounded-lg bg-black/50 border border-gray-600 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Email"
            />
            <label htmlFor="Email" className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:left-2 peer-focus:text-xs peer-focus:text-green-400">
              Email
            </label>
          </div>

          {/* Continue Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #22c55e" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 font-semibold text-lg rounded-lg transition bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
          >
            Continue
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Forgot;
