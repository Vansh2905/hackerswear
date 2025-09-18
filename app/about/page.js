"use client";
import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="py-20 text-center border-b border-gray-800">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          About <span className="text-gray-400">HackerWear</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg">
          Built for hackers. Designed for rebels. Worn by those who live outside the system.
        </p>
      </div>

      {/* Mission Section */}
      <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 border-b border-gray-800">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed">
            At HackerWear, we merge fashion with the underground spirit of hacking. 
            Our goal is to empower creators, coders, and cyberpunks with clothing 
            that represents their bold mindset — sharp, minimalist, and unapologetic.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-zinc-900 border border-gray-800 rounded-xl p-6 shadow-lg"
        >
          <p className="text-lg italic text-gray-300">
            “Hack the system, wear your identity.”
          </p>
        </motion.div>
      </div>

      {/* Vision Section */}
      <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 border-b border-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-400 leading-relaxed">
            We envision a world where hackers, developers, and innovators express 
            themselves not just through code, but through the clothes they wear. 
            HackerWear isn’t just a brand — it’s a movement, a culture, and a 
            statement of freedom.
          </p>
        </motion.div>
      </div>

      {/* Team Section */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">The Crew</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold">Vansh Ahluwalia</h3>
            <p className="text-gray-400 text-sm mt-2">Founder & Visionary</p>
          </div>
          <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold">The Dev Team</h3>
            <p className="text-gray-400 text-sm mt-2">Code Architects</p>
          </div>
          <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold">The Creators</h3>
            <p className="text-gray-400 text-sm mt-2">Design Rebels</p>
          </div>
        </div>
      </div>

      {/* Call To Action */}
      <div className="py-16 text-center border-t border-gray-800">
        <h2 className="text-2xl font-bold mb-4">Join the Movement</h2>
        <p className="text-gray-400 mb-6">
          HackerWear isn’t just apparel — it’s a way of life. Be part of the revolution.
        </p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          href="/"
          className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition"
        >
          Explore the Collection
        </motion.a>
      </div>
    </div>
  );
};

export default About;
