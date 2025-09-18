import User from "@/models/User";
import connectdb from "@/middleware/mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    await connectdb();
    console.log("Connected to MongoDB");
    const reqBody = await request.json();
    const { name, email, password } = reqBody;

    const errors = [];
    if (!name?.trim()) errors.push({ msg: "Name is required" });
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push({ msg: "Please include a valid email" });
    if (!password || password.length < 6) errors.push({ msg: "Password must be 6 or more characters" });

    if (errors.length > 0) return NextResponse.json({ errors }, { status: 400 });

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) return NextResponse.json({ errors: [{ msg: "User already exists" }] }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email: email.toLowerCase(), password: hashedPassword });
    await user.save();
    console.log("User saved to database:", user._id);

    // Generate JWT token
    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    // Return user data for frontend
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    return NextResponse.json({ 
      msg: "User registered successfully", 
      token, 
      user: userData 
    }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ errors: [{ msg: "Server error" }] }, { status: 500 });
  }
}