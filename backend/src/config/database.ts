import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});