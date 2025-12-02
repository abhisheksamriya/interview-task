import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export const sendOtp = async (email: string, otp: string) => {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL!,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
  };

  await sgMail.send(msg);
};
