import nodemailer from "nodemailer";
import {config} from "dotenv";

config();



export async function sendEmail(email, subject, htmlContent) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: htmlContent,
    });

    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.log("Email Error:", error);
     console.log(error);
  throw error;
  }
}