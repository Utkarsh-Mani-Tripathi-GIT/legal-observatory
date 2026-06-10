import { NextResponse } from 'next/server';
import { getPageViewCount, incrementPageView } from '../../../lib/content';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    const views = await getPageViewCount(slug);
    return NextResponse.json({ views });
  } catch (error) {
    console.error('Views GET failure:', error);
    return NextResponse.json({ error: 'Failed to retrieve views' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.slug;

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug in request body' }, { status: 400 });
    }

    const views = await incrementPageView(slug);
    return NextResponse.json({ views });
  } catch (error) {
    console.error('Views POST failure:', error);
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
  }
}
