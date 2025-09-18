"use client";
import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          feedback: form.message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });

        setTimeout(() => setSubmitted(false), 3000);
      } else {
        console.error("Failed to submit feedback");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold">Contact Us</h1>
        <p className="text-gray-400 mt-2">
          Have questions or feedback? We would love to hear from you.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800">
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

          {submitted ? (
            <p className="text-green-400 font-semibold">
              ✅ Thanks for reaching out! We will get back to you soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md bg-black border border-gray-700 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md bg-black border border-gray-700 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 rounded-md bg-black border border-gray-700 text-white focus:outline-none focus:border-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-bold py-2 px-4 rounded-md hover:bg-green-500 hover:text-white transition"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Details */}
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-2xl font-bold">Get in Touch</h2>
          <p className="text-gray-400">
            Whether you have a question about your order, products, or just want
            to say hi, we are here for you.
          </p>

          <div className="space-y-3">
            <p>
              📍 <span className="font-semibold">Address:</span> HackerWear HQ,
              Panchkula, India
            </p>
            <p>
              📧 <span className="font-semibold">Email:</span> support@hackerwear.com
            </p>
            <p>
              📞 <span className="font-semibold">Phone:</span> +91 98765 43210
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
