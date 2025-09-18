import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },   // use "name" in frontend, but save as title
  slug: { type: String, required: true, unique: true },
  desc: { type: String, required: true },    // description → desc
  img: [{ type: String, required: true }],   // images → img
  category: { type: String, required: true },
  price: { type: Number, required: true },
  availableQty: { type: Number, required: true },
  sizes: [{ type: String }],                 // allow array of strings
  colors: [{ type: String }]                 // allow array of strings
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
