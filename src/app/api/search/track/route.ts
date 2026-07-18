import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
    }

    const cleanQuery = query.toLowerCase().trim();
    const supabase = getSupabaseClient();

    if (!supabase) {
      console.warn('Supabase not configured, skipping tracking');
      return NextResponse.json({ success: true, simulated: true });
    }

    // @ts-ignore - Supabase generated types don't include the new RPC function yet
    const { error } = await supabase.rpc('increment_search_query', {
      query_text: cleanQuery,
    });

    if (error) {
      console.error('Failed to track search query:', error);
      return NextResponse.json({ error: 'Failed to track query' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
