"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useUser } from "@/components/UserProvider";

// Google Icon
const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Signup = () => {
  const router = useRouter();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Google signup with NextAuth
  const handleGoogleSignup = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");
  
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    setIsLoading(false);
    return;
  }

  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data?.errors?.[0]?.msg || data?.error || "Signup failed");
      setIsLoading(false);
      return;
    }

    localStorage.setItem("token", data.token);
    login(data.user); // Store user data in context
    router.push("/");
  } catch (err) {
    console.error(err);
    setError("Server error");
  } finally {
    setIsLoading(false);
  }
};

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
          HackersWear Signup
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Create your account to get started.
        </p>

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
          {/* Floating label Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="peer w-full p-3 rounded-lg bg-black/50 border border-gray-600 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Name"
            />
            <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:left-2 peer-focus:text-xs peer-focus:text-green-400">
              Name
            </label>
          </div>

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
            <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:left-2 peer-focus:text-xs peer-focus:text-green-400">
              Email
            </label>
          </div>

          {/* Floating label Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="peer w-full p-3 rounded-lg bg-black/50 border border-gray-600 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Password"
            />
            <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:left-2 peer-focus:text-xs peer-focus:text-green-400">
              Password
            </label>
          </div>

          {/* Floating label Confirm Password */}
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="peer w-full p-3 rounded-lg bg-black/50 border border-gray-600 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Confirm Password"
            />
            <label htmlFor="Confirm Password"className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:left-2 peer-focus:text-xs peer-focus:text-green-400">
              Confirm Password
            </label>
          </div>

          {/* Signup Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #22c55e" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 font-semibold text-lg rounded-lg transition bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg disabled:opacity-50"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </motion.button>
        </form>

        {/* Google Signup Button */}
        <button
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full flex justify-center items-center mt-3 py-3 px-6 rounded-xl font-semibold border-2 border-gray-200 bg-white/50 backdrop-blur-sm hover:bg-white/80 text-gray-700 hover:border-gray-300 transition disabled:opacity-50"
        >
          <GoogleIcon /> Continue with Google
        </button>

        {/* Link to Login */}
        <div className="flex justify-center mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <Link href={"/Login"} className="ml-1 hover:text-blue-400 transition">
            Login
        </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
