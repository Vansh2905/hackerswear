import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectdb from "@/middleware/mongoose";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    await connectdb();
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Token expired or invalid" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    return NextResponse.json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
