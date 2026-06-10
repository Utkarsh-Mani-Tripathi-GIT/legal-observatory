import { NextResponse } from 'next/server';
import { getArticles } from '../../../lib/content';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  try {
    const articles = await getArticles();
    const cleanQuery = query.toLowerCase().trim();

    const filtered = articles
      .filter((art) => {
        const titleMatch = art.title.toLowerCase().includes(cleanQuery);
        const contentMatch = art.rawContent?.toLowerCase().includes(cleanQuery);
        const tagMatch = art.tags.some((tag) => tag.toLowerCase().includes(cleanQuery));
        const categoryMatch = art.categories.some((cat) => cat.toLowerCase().includes(cleanQuery));
        const authorMatch = art.authorDetails?.name.toLowerCase().includes(cleanQuery);

        return titleMatch || contentMatch || tagMatch || categoryMatch || authorMatch;
      })
      .map((art) => ({
        slug: art.slug,
        type: art.type,
        title: art.title,
        date: art.date,
        authorName: art.authorDetails?.name || 'Observatory Scholar',
        category: art.categories[0] ? art.categories[0].replace('-', ' ').toUpperCase() : 'GENERAL',
      }))
      .slice(0, 8); // Cap suggestions at 8 results for autocomplete clarity

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Search API failure:', error);
    return NextResponse.json({ error: 'Failed to search archive' }, { status: 500 });
  }
}
