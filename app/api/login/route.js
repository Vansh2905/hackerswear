import User from "@/models/User";
import connectdb from "@/middleware/mongoose";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    await connectdb();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { errors: [{ msg: "Please enter all fields" }] },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { errors: [{ msg: "Invalid credentials" }] },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { errors: [{ msg: "Invalid credentials" }] },
        { status: 400 }
      );
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    return NextResponse.json({ token, user: userData }, { status: 200 });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { errors: [{ msg: "Server error" }] },
      { status: 500 }
    );
  }
}
