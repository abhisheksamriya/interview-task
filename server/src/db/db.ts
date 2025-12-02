import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const url = process.env.MONGODB_URL || "";
    await mongoose.connect(url);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Mongo Error:", error);
    process.exit(1);
  }
};
