import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    otp: { type: String, required: true },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600,
    },
  },
  { timestamps: false }
);

export const Otp = mongoose.model("otp", otpSchema);
