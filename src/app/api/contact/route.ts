import { NextResponse } from 'next/server';
import { sendEmail } from '../../../lib/email';

export async function POST(request: Request) {
  try {
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.warn('GMAIL_APP_PASSWORD environment variable is not configured.');
      return NextResponse.json(
        { success: false, message: 'Email service is not configured. Please set the GMAIL_APP_PASSWORD env variable.' },
        { status: 500 }
      );
    }

    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (name, email, message).' },
        { status: 400 }
      );
    }

    // Send email via Nodemailer
    const result = await sendEmail({
      to: 'nationallegalobservatory@gmail.com',
      replyTo: email,
      subject: `NLO Query: ${subject.toUpperCase()} - ${name}`,
      html: `
        <h3>New Inquiry from National Legal Observatory Portal</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject Classification:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
          ${message}
        </div>
      `,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Inquiry sent successfully.' });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error.' }, { status: 500 });
  }
}

