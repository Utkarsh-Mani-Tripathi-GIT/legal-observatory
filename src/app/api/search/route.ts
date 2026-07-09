import { NextResponse } from 'next/server';
import { getArticles } from '../../../lib/content';

// Simple in-memory rate limiter (3 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { allowed: boolean; resetTimeRemaining?: number } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= 3) {
    return { allowed: false, resetTimeRemaining: Math.ceil((record.resetTime - now) / 1000) };
  }

  record.count += 1;
  return { allowed: true };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  if (!query.trim()) {
    return NextResponse.json({ aiResponse: null, results: [] });
  }

  // 1. Rate Limiting Check
  // In Next.js App Router, 'x-forwarded-for' is usually available in production.
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimitStatus = checkRateLimit(ip);
  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      { 
        error: `You have reached the limit of 3 searches per minute. Try again in ${rateLimitStatus.resetTimeRemaining} seconds.`,
        remaining: rateLimitStatus.resetTimeRemaining
      },
      { status: 429 }
    );
  }

  try {
    // 2. Fetch standard search results
    const articles = await getArticles();
    const cleanQuery = query.toLowerCase().trim();

    const filtered = articles
      .filter((art) => {
        const titleMatch = art.title.toLowerCase().includes(cleanQuery);
        const contentMatch = art.rawContent?.toLowerCase().includes(cleanQuery);
        const tagMatch = art.tags.some((tag) => tag.toLowerCase().includes(cleanQuery));
        const categoryMatch = art.categories.some((cat) => cat.toLowerCase().includes(cleanQuery));
        const authorMatch = art.authorDetails?.name.toLowerCase().includes(cleanQuery);
        const caseMatch = art.caseSummary?.toLowerCase().includes(cleanQuery) || false;
        const statuteMatch = art.statutesReferenced?.some((statute) => statute.toLowerCase().includes(cleanQuery)) || false;
        const yearMatch = new Date(art.date).getFullYear().toString().includes(cleanQuery);

        return titleMatch || contentMatch || tagMatch || categoryMatch || authorMatch || caseMatch || statuteMatch || yearMatch;
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

    // 3. Gemini AI Integration
    let aiResponse = null;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (apiKey) {
      try {
        const contextString = filtered.map(art => `Title: ${art.title}\nAuthor: ${art.authorName}\nCategory: ${art.category}`).join('\n\n');
        const promptText = `You are an AI assistant for the National Legal Observatory website. The user is searching for: "${query}". 
        Using ONLY the following website context, provide a brief, 1-2 sentence summary or explanation related to the user's search. If the context doesn't contain relevant information, state that you couldn't find specific information on the website.
        
        Website Context:
        ${contextString}`;

        const geminiRes = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: promptText,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
        } else {
          console.error('Gemini API Error:', await geminiRes.text());
        }
      } catch (geminiError) {
        console.error('Failed to fetch from Gemini API:', geminiError);
      }
    }

    return NextResponse.json({
      aiResponse,
      results: filtered,
    });
  } catch (error) {
    console.error('Search API failure:', error);
    return NextResponse.json({ error: 'Failed to search archive' }, { status: 500 });
  }
}
