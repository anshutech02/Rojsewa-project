import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Validate email config at startup
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("⚠️  EMAIL_USER or EMAIL_PASS environment variable is missing! Email sending will fail.");
  console.error("   Make sure these are set in your deployment platform (e.g., Render Environment Variables).");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error(
        "Email configuration missing: EMAIL_USER and EMAIL_PASS must be set as environment variables on your deployment platform."
      );
    }

    const info = await transporter.sendMail({
      from: `"Rojsewa" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Email Error:", error.message);
    console.error("Email Error Details:", {
      code: error.code,
      command: error.command,
      to,
      subject,
    });
    throw error;
  }
};