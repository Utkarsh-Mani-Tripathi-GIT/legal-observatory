import { NextResponse } from 'next/server';
import { subscribeToNewsletter } from '../../../lib/content';
import { sendEmail } from '../../../lib/email';
import { getSupabaseAdminClient } from '../../../lib/supabase';

// In-memory rate limiting map: IP -> timestamp array
const rateLimitMap = new Map<string, number[]>();

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting (Max 5 requests per 10 minutes per IP)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const now = Date.now();
    const windowMs = 10 * 60 * 1000; // 10 minutes
    const maxRequests = 5;

    const timestamps = (rateLimitMap.get(ip) || []).filter((t) => now - t < windowMs);
    if (timestamps.length >= maxRequests) {
      return NextResponse.json(
        { success: false, message: 'Too many signup requests. Please try again in a few minutes.' },
        { status: 429 }
      );
    }
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    const body = await request.json();
    const email = body.email;

    // 2. Strict Email Regex Validation (RFC 5322 standard + disposable/fake domain filter)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address (e.g., scholar@university.edu).' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check for common temporary / disposable email domains
    const disposableDomains = ['tempmail.com', 'throwawaymail.com', 'mailinator.com', '10minutemail.com', 'yopmail.com', 'guerrillamail.com'];
    const domain = cleanEmail.split('@')[1];
    if (disposableDomains.includes(domain)) {
      return NextResponse.json(
        { success: false, message: 'Disposable or temporary email domains are not allowed.' },
        { status: 400 }
      );
    }

    // Dispatch to DAL subscription logic (Supabase or local simulation)
    const result = await subscribeToNewsletter(cleanEmail);

    if (result.success) {
      // Send welcome email to subscriber
      if (process.env.GMAIL_APP_PASSWORD && result.message !== 'You have already subscribed to our newsletter.') {
        try {
          await sendEmail({
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
        }

        // Send signup notification + updated subscriber list to NLO itself
        try {
          const adminClient = getSupabaseAdminClient();
          let subscribersHtml = '';

          if (adminClient) {
            const { data: subs } = await adminClient
              .from('newsletter_subscribers')
              .select('email, subscribed_at')
              .order('subscribed_at', { ascending: false });

            if (subs && subs.length > 0) {
              subscribersHtml = `
                <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-family: sans-serif; font-size: 13px;">
                  <thead>
                    <tr style="background: #f1f5f9; text-align: left;">
                      <th style="padding: 8px; border: 1px solid #e2e8f0;">Email</th>
                      <th style="padding: 8px; border: 1px solid #e2e8f0;">Subscribed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${subs.map(s => `
                      <tr>
                        <td style="padding: 8px; border: 1px solid #e2e8f0;"><strong>${s.email}</strong></td>
                        <td style="padding: 8px; border: 1px solid #e2e8f0; color: #64748b;">${new Date(s.subscribed_at).toLocaleString()}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              `;
            }
          }

          await sendEmail({
            to: 'nationallegalobservatory@gmail.com',
            subject: `🔔 New Subscriber Signup: ${cleanEmail}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
                <h2 style="color: #0f172a; margin-top: 0;">New Newsletter Subscription</h2>
                <p style="font-size: 14px; color: #334155;">
                  <strong>${cleanEmail}</strong> has just signed up for the National Legal Observatory newsletter.
                </p>
                
                <h3 style="margin-top: 24px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
                  Updated Subscribers List
                </h3>
                ${subscribersHtml || `<p style="color: #64748b; font-size: 14px;">Total subscribers: 1 (dynamic list unavailable)</p>`}
              </div>
            `,
          });
        } catch (adminEmailError) {
          console.error('Failed to send admin notification email:', adminEmailError);
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


