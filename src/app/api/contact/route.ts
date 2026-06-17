import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend lazily or with a fallback placeholder for build/compilation
const apiKey = process.env.RESEND_API_KEY || 're_placeholder_for_build';
const resend = new Resend(apiKey);

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY environment variable is not configured.');
      return NextResponse.json(
        { success: false, message: 'Email service is not configured. Please set the RESEND_API_KEY env variable.' },
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

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'NLO Portal <onboarding@resend.dev>',
      to: 'nationallegalobservatory@gmail.com',
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

    if (error) {
      console.error('Resend email error:', error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error.' }, { status: 500 });
  }
}
