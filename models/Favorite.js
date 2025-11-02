import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  clientId: { type: String, required: true, index: true },
  city: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Favorite", favoriteSchema);
