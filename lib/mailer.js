import nodemailer from "nodemailer";

/**
 * Reusable Nodemailer transporter configured for Gmail SMTP.
 * Credentials are read from environment variables:
 *   GMAIL_USER         — your Gmail address
 *   GMAIL_APP_PASSWORD — 16-char App Password (NOT your regular password)
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Send an email via Gmail.
 *
 * @param {{ to: string, subject: string, html: string, text?: string }} options
 * @returns {Promise<import("nodemailer").SentMessageInfo>}
 */
export async function sendMail({ to, subject, html, text }) {
  const mailOptions = {
    from: `"AarohanHub" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
    ...(text && { text }),
  };

  return transporter.sendMail(mailOptions);
}
