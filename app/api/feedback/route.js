import connectdb from "@/middleware/mongoose";
import Feedback from "@/models/feedback";

export async function POST(req) {
  try {
    await connectdb();
    const body = await req.json();
    const { name, email, feedback } = body;
    if (!name || !email || !feedback) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }
    const newFeedback = new Feedback({ name, email, feedback });
    await newFeedback.save();
    return new Response(
        JSON.stringify({ message: "Feedback submitted successfully" }),
        { status: 201 }
        );
    } catch (err) {
    console.error("❌ Error in feedback route:", err);
    return new Response(
        JSON.stringify({ error: "Internal Server Error", details: err.message }),
        { status: 500 }
        );
    }
}