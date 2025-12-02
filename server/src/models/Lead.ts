import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    mobile: String,
    service: String,
    description: String,
    utm_source: String,
    utm_medium: String,
    utm_campaign: String,
  },
  { timestamps: true }
);

export default mongoose.model("Lead", LeadSchema);
