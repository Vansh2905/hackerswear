import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "@/models/User";
import connectdb from "@/middleware/mongoose";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    await connectdb();
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate reset token (15 min expiry)
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // ✅ Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Send mail
    await transporter.sendMail({
      from: `"Hacker's Wear Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
  html: `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background-color: #000; padding: 20px; text-align: center; color: #fff;">
        <h1 style="margin: 0; font-size: 24px;">Hacker's Wear</h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px; color: #111;">
        <h2 style="margin-top: 0; color: #000;">Password Reset Request</h2>
        <p>Hello ${user.name || "User"},</p>
        <p>We received a request to reset your password. Click the button below to reset it. This link will expire in <strong>15 minutes</strong>.</p>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #111; color: #fff; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Reset Password
          </a>
        </div>

        <p style="font-size: 14px; color: #555;">If you did not request a password reset, please ignore this email or contact support.</p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #555;">
        &copy; ${new Date().getFullYear()} Hacker's Wear. All rights reserved.
      </div>
    </div>
  </div>
`

    });

    return NextResponse.json({ message: "Password reset email sent!" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ message: "Server error"}, { status: 500 });
  }
}
