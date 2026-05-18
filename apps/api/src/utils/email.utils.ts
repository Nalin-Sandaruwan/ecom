import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  // 1. Create a transporter
  // Gmail works best with service: 'gmail' or these specific settings
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `ChilleBazzar <${process.env.EMAIL_FROM || "no-reply@chillebazzar.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

export const generateOTPTemplate = (otp: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 12px;">
      <h2 style="color: #f97316; text-align: center;">ChilleBazzar</h2>
      <p style="font-size: 16px; color: #374151;">Hello,</p>
      <p style="font-size: 16px; color: #374151;">You requested a password reset for your ChilleBazzar account. Use the code below to verify your identity:</p>
      <div style="background-color: #fff7ed; border: 1px solid #fdba74; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #f97316;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #6b7280;">This OTP is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">© ${new Date().getFullYear()} ChilleBazzar. All rights reserved.</p>
    </div>
  `;
};
