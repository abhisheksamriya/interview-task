import { Router } from "express";
import Lead from "../models/Lead.js";
import { addToGoogleSheet } from "../utils/googleSheet.js";
import { Otp } from "../models/Otp.js";
import { sendOtp } from "../utils/sendOtp.js";

const router = Router();

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, msg: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({ otp });

    await sendOtp(email, otp);

    res.json({ success: true, msg: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp)
      return res.status(400).json({ success: false, msg: "OTP is required" });

    const otpDoc = await Otp.findOne({ otp });
    if (!otpDoc)
      return res.status(400).json({ success: false, msg: "Invalid OTP" });

    await Otp.findByIdAndDelete(otpDoc._id);

    res.json({ success: true, msg: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
});

router.post("/submit", async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    await addToGoogleSheet(lead);

    return res.json({
      success: true,
      id: (lead as any)._id ?? null,
    });
  } catch (error: any) {
    console.error("Submit Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/lead/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: "Not found" });

    return res.json({
      name: lead.name,
      email: lead.email,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

export default router;
