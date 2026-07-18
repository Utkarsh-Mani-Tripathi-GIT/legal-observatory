import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return NextResponse.json({ queries: [] });
    }

    const { data, error } = await supabase
      .from('search_queries')
      .select('query')
      .order('count', { ascending: false })
      .order('last_searched_at', { ascending: false })
      .limit(4);

    if (error) {
      console.error('Failed to fetch trending queries:', error);
      return NextResponse.json({ queries: [] });
    }

    const queries = (data as any[])?.map((row) => row.query) || [];
    return NextResponse.json({ queries });
  } catch (error) {
    console.error('Trending API error:', error);
    return NextResponse.json({ queries: [] });
  }
}
