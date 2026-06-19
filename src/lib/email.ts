import nodemailer from 'nodemailer';

// Create a reusable transporter using the Gmail SMTP server
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nationallegalobservatory@gmail.com',
    // Uses the GMAIL_APP_PASSWORD from env, falls back to build string
    pass: process.env.GMAIL_APP_PASSWORD || 'placeholder_app_password',
  },
});

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailParams) {
  const mailOptions = {
    from: '"National Legal Observatory" <nationallegalobservatory@gmail.com>',
    to,
    subject,
    html,
    replyTo,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Nodemailer sendMail error:', error);
    return { success: false, error: error.message };
  }
}
