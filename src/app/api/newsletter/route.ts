import { NextResponse } from 'next/server';
import { subscribeToNewsletter } from '../../../lib/content';
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY || 're_placeholder_for_build';
const resend = new Resend(apiKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Please provide a valid email address.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Extract headers for metadata
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const device = request.headers.get('sec-ch-ua-platform') || 'unknown';
    const country = request.headers.get('x-vercel-ip-country') || 'unknown';
    const region = request.headers.get('x-vercel-ip-country-region') || 'unknown';
    const city = request.headers.get('x-vercel-ip-city') || 'unknown';
    const timezone = request.headers.get('x-vercel-ip-timezone') || 'unknown';
    const latitude = request.headers.get('x-vercel-ip-latitude');
    const longitude = request.headers.get('x-vercel-ip-longitude');
    const loc = latitude && longitude ? `${latitude},${longitude}` : 'unknown';

    const metadata = {
      ip,
      userAgent,
      device,
      country,
      region,
      city,
      timezone,
      loc
    };

    // Dispatch to DAL subscription logic (Supabase or local simulation)
    const result = await subscribeToNewsletter(cleanEmail, metadata);


    if (result.success) {
      // Send welcome email
      if (process.env.RESEND_API_KEY && result.message !== 'You have already subscribed to our newsletter.') {
        try {
          await resend.emails.send({
            from: 'National Legal Observatory <onboarding@resend.dev>',
            to: cleanEmail,
            subject: 'Welcome to the National Legal Observatory',
            html: `
              <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #fafafa; padding: 40px 32px; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 32px;">
                  <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #6366f1; font-weight: 700; margin: 0;">National Legal Observatory</p>
                  <p style="font-size: 11px; color: #94a3b8; margin: 4px 0 0 0;">Independent Legal Research</p>
                </div>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0 0 28px 0;" />
                <h1 style="font-size: 24px; color: #0f172a; font-weight: 800; line-height: 1.3; margin: 0 0 16px 0;">
                  Welcome to NLO!
                </h1>
                <p style="font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 20px 0;">
                  Thank you for subscribing to the National Legal Observatory. We're thrilled to have you join our community.
                  You'll now receive updates on our latest independent legal research, policy analysis, and expert opinions directly in your inbox.
                </p>
                <div style="text-align: center; margin: 28px 0;">
                  <a href="https://legal-observatory.vercel.app/publications"
                     style="display: inline-block; background: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 700; letter-spacing: 0.5px;">
                    Explore Our Publications →
                  </a>
                </div>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0 16px 0;" />
                <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0; line-height: 1.6;">
                  You received this email because you subscribed to the National Legal Observatory newsletter.<br />
                  <a href="https://legal-observatory.vercel.app" style="color: #6366f1; text-decoration: none;">legal-observatory.vercel.app</a>
                </p>
              </div>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // We still return success since the subscription itself was successful
        }
      }

      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 500 });
    }
  } catch (error) {
    console.error('Newsletter API failure:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
