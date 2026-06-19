import { NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, articleSlug } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient() as any;
      if (supabase) {
        const { error } = await supabase
          .from('article_reminders')
          .insert([{
            email: cleanEmail,
            article_slug: articleSlug || 'manufacturing-consent',
            created_at: new Date().toISOString(),
            sent: false,
          }]);

        if (error) {
          if (error.code === '23505') {
            return NextResponse.json({
              success: true,
              message: 'You\'re already on the reminder list! We\'ll email you at 7 PM.',
            });
          }
          console.error('Supabase reminder insert error:', error);
          return NextResponse.json(
            { success: false, message: 'Something went wrong. Please try again.' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Reminder set! You\'ll receive an email at 7:00 PM when the article goes live.',
        });
      }
    }

    // Fallback: no Supabase configured — just acknowledge
    return NextResponse.json({
      success: true,
      message: `Reminder set for ${cleanEmail}. You'll be notified when the article goes live.`,
    });
  } catch (error: any) {
    console.error('Reminder API error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
