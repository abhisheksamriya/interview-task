import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendOtp = async (email: string, otp: string) => {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL!,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
    mail_settings: {
      sandbox_mode: {
        enable: false,
      },
    },
  };

  await sgMail.send(msg);
};
