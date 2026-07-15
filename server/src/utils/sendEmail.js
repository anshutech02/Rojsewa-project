import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("EMAIL_USER or EMAIL_PASS is missing.");
}



const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true", // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP Connection Error:", err);
  } else {
    console.log("SMTP Mailer initialized successfully!");
  }
});


export const sendEmail = async ({ to, subject, html }) => {
  try {
    const fromAddress = process.env.EMAIL_FROM;
    console.log("Sending email to:", to);
    console.log({
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_FROM: process.env.EMAIL_FROM,
      fromAddress,
    });

    const info = await transporter.sendMail({
      from: `"RojSewa" <${fromAddress}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully:", info.messageId);
    console.log(info);

    return info;
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};
