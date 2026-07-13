import { NextResponse } from 'next/server';
import { getArticles, getAuthors } from '../../../lib/content';

type ArticleRecord = Awaited<ReturnType<typeof getArticles>>[number];

type SearchResult = {
  slug: string;
  type: string;
  title: string;
  date: string;
  authorName: string;
  category: string;
  excerpt: string;
};

type AuthorSearchResult = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  excerpt: string;
};

type ReferenceSearchResult = {
  articleSlug: string;
  articleTitle: string;
  reference: string;
  url?: string;
  host?: string;
  kind?: 'bibliography';
  authorName?: string;
};

type WebReferencePreview = {
  url: string;
  host: string;
  title: string;
  description: string;
  sourceReference: string;
};

type SourceCandidate = {
  kind: 'bibliography';
  articleSlug?: string;
  articleTitle?: string;
  authorName?: string;
  reference: string;
  href?: string;
  host?: string;
  score: number;
};

type AiSearchScope = {
  site: string;
  searchedFields: string[];
  matched: {
    publications: number;
    authorProfiles: number;
    bibliographies: number;
    webPages: number;
  };
  bibliographySources: string[];
  profileSources: string[];
  webSources: string[];
  summary: string;
};

type AiSourcePack = {
  nloArticles: SearchResult[];
  profiles: AuthorSearchResult[];
  citations: ReferenceSearchResult[];
  webPages: WebReferencePreview[];
};

const AI_SEARCH_LIMIT_PER_MINUTE = 3;
const AI_WEB_REFERENCE_LIMIT = 3;
const AI_REFERENCE_CONTEXT_LIMIT = 6;
const FETCH_TIMEOUT_MS = 4500;
const aiRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const BANNED_RESPONSE_KEYWORDS = [
  'whatsapp',
  'telegram',
  'facebook',
  'instagram',
  'twitter',
  'x.com',
  'youtube',
  'reddit',
  'discord',
  'tiktok',
  'snapchat',
];

const WEBSITE_SEARCH_FIELDS = [
  'publication titles',
  'publication abstracts',
  'full publication text',
  'tags',
  'categories',
  'author names',
  'author profiles',
  'author bios',
  'case summaries',
  'statutes referenced',
  'policy overviews',
  'publication dates',
  'verified bibliography entries',
  'internal links',
  'verified bibliography urls',
];

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || '127.0.0.1';
  }

  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

function checkAiRateLimit(ip: string): { allowed: boolean; resetTimeRemaining?: number } {
  const now = Date.now();
  const windowMs = 60 * 1000;

  const record = aiRateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    aiRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= AI_SEARCH_LIMIT_PER_MINUTE) {
    return {
      allowed: false,
      resetTimeRemaining: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  record.count += 1;
  return { allowed: true };
}

function normalizeReference(reference: string) {
  return reference.replace(/\s+/g, ' ').trim();
}

function extractHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./i, '');
  } catch {
    return url;
  }
}

function stripHtmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMetaContent(html: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1].replace(/\s+/g, ' ').trim();
    }
  }
  return '';
}

function extractTextSnippet(text: string, cleanQuery: string) {
  if (!text) {
    return '';
  }

  if (!cleanQuery) {
    return text.slice(0, 240);
  }

  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(cleanQuery);
  if (index === -1) {
    return text.slice(0, 240);
  }

  const start = Math.max(0, index - 90);
  const end = Math.min(text.length, index + cleanQuery.length + 150);
  return text.slice(start, end).trim();
}

function scoreCandidateText(candidateText: string, cleanQuery: string) {
  if (!cleanQuery) {
    return 0;
  }

  const lower = candidateText.toLowerCase();
  if (lower === cleanQuery) return 6;
  if (lower.includes(cleanQuery)) return 4;

  const tokens = cleanQuery.split(/\s+/).filter(Boolean);
  const tokenHits = tokens.filter((token) => lower.includes(token)).length;
  return tokenHits;
}

function getArticleMatchScore(article: ArticleRecord, cleanQuery: string) {
  const titleMatch = article.title.toLowerCase().includes(cleanQuery);
  const contentMatch = article.rawContent?.toLowerCase().includes(cleanQuery);
  const htmlContentMatch = article.content?.toLowerCase().includes(cleanQuery);
  const tagMatch = article.tags.some((tag) => tag.toLowerCase().includes(cleanQuery));
  const categoryMatch = article.categories.some((cat) => cat.toLowerCase().includes(cleanQuery));
  const authorMatch = article.authorDetails?.name.toLowerCase().includes(cleanQuery);
  const caseMatch = article.caseSummary?.toLowerCase().includes(cleanQuery) || false;
  const policyMatch = article.policyOverview?.toLowerCase().includes(cleanQuery) || false;
  const statuteMatch =
    article.statutesReferenced?.some((statute) => statute.toLowerCase().includes(cleanQuery)) ||
    false;
  const referenceMatch =
    article.references?.some((reference) => reference.toLowerCase().includes(cleanQuery)) || false;
  const bibliographyMatch =
    article.bibliography?.some((entry) =>
      [entry.citation, entry.label, entry.url]
        .filter((value): value is string => typeof value === 'string')
        .some((value) => value.toLowerCase().includes(cleanQuery))
    ) || false;
  const yearMatch = new Date(article.date).getFullYear().toString().includes(cleanQuery);

  return {
    matched:
      titleMatch ||
      contentMatch ||
      htmlContentMatch ||
      tagMatch ||
      categoryMatch ||
      authorMatch ||
      caseMatch ||
      policyMatch ||
      statuteMatch ||
      referenceMatch ||
      bibliographyMatch ||
      yearMatch,
    titleMatch,
    contentMatch,
    htmlContentMatch,
    tagMatch,
    categoryMatch,
    authorMatch,
    caseMatch,
    policyMatch,
    statuteMatch,
    referenceMatch,
    bibliographyMatch,
    yearMatch,
  };
}

function buildSearchResults(cleanQuery: string, articles: ArticleRecord[]) {
  return articles
    .filter((article) => getArticleMatchScore(article, cleanQuery).matched)
    .map<SearchResult>((article) => ({
      slug: article.slug,
      type: article.type,
      title: article.title,
      date: article.date,
      authorName: article.authorDetails?.name || 'Observatory Scholar',
      category: article.categories[0] ? article.categories[0].replace('-', ' ').toUpperCase() : 'GENERAL',
      excerpt:
        article.abstract ||
        article.caseSummary ||
        article.policyOverview ||
        article.rawContent?.slice(0, 240) ||
        '',
    }))
    .slice(0, 8);
}

function buildAuthorResults(cleanQuery: string, authors: Awaited<ReturnType<typeof getAuthors>>) {
  return authors
    .filter((author) => {
      const searchableFields = [author.name, author.role, author.bio, author.content];
      return searchableFields.some((field) => field?.toLowerCase().includes(cleanQuery));
    })
    .map<AuthorSearchResult>((author) => ({
      slug: author.slug,
      name: author.name,
      role: author.role,
      bio: author.bio,
      excerpt: author.content?.replace(/\s+/g, ' ').trim().slice(0, 240) || author.bio || '',
    }))
    .slice(0, 4);
}

function buildReferenceResults(
  cleanQuery: string,
  articles: ArticleRecord[]
) {
  const candidates: SourceCandidate[] = [];

  for (const article of articles) {
    const articleContext = [
      article.title,
      article.authorDetails?.name || '',
      article.abstract || '',
      article.caseSummary || '',
      article.policyOverview || '',
      article.rawContent || '',
      article.content || '',
      ...(article.categories || []),
      ...(article.tags || []),
      ...((article.bibliography || []).map((entry) => entry.citation)),
    ].join(' ');

    for (const entry of article.bibliography || []) {
      const normalized = normalizeReference(entry.citation || entry.label || entry.url || '');
      const url = entry.url;
      candidates.push({
        kind: 'bibliography',
        articleSlug: article.slug,
        articleTitle: article.title,
        reference: normalized,
        href: url,
        host: url ? extractHost(url) : undefined,
        score: scoreCandidateText(`${articleContext} ${normalized} ${url || ''}`, cleanQuery),
      });
    }
  }

  const rankedCandidates = candidates
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score)
    .filter((candidate, index, array) => {
      const key = `${candidate.kind}|${candidate.href || ''}|${candidate.reference}`;
      return array.findIndex((item) => `${item.kind}|${item.href || ''}|${item.reference}` === key) === index;
    });

  return rankedCandidates.slice(0, AI_REFERENCE_CONTEXT_LIMIT).map<ReferenceSearchResult>((candidate) => ({
    articleSlug: candidate.articleSlug || 'site',
    articleTitle: candidate.articleTitle || candidate.authorName || 'Site source',
    reference: candidate.reference,
    url: candidate.href,
    host: candidate.host,
    kind: candidate.kind,
    authorName: candidate.authorName,
  }));
}

async function fetchWebReferencePreview(
  url: string,
  sourceReference: string,
  cleanQuery: string
): Promise<WebReferencePreview | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    const finalUrl = response.url || url;
    const host = extractHost(finalUrl);
    if (!response.ok) {
      return {
        url: finalUrl,
        host,
        title: host,
        description: `Unable to fetch cited page (HTTP ${response.status}).`,
        sourceReference,
      };
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('html') && !contentType.toLowerCase().includes('xml')) {
      return {
        url: finalUrl,
        host,
        title: host,
        description: `Cited page is not HTML (${contentType || 'unknown content type'}).`,
        sourceReference,
      };
    }

    const html = await response.text();
    const title =
      extractMetaContent(html, [
        /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
        /<title[^>]*>([^<]+)<\/title>/i,
      ]) || host;
    const description =
      extractMetaContent(html, [
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
      ]) || extractTextSnippet(stripHtmlToText(html), cleanQuery) || 'No description available.';

    return {
      url: finalUrl,
      host,
      title,
      description,
      sourceReference,
    };
  } catch (error) {
    console.error('Failed to fetch cited web reference:', error);
    return {
      url,
      host: extractHost(url),
      title: extractHost(url),
      description: 'Unable to fetch cited page.',
      sourceReference,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function buildAiScope(
  publicationResults: SearchResult[],
  authorResults: AuthorSearchResult[],
  referenceResults: ReferenceSearchResult[],
  webPreviews: WebReferencePreview[]
): AiSearchScope {
  const bibliographySources = referenceResults.map((result) =>
    result.url
      ? `${result.articleTitle} · ${result.host || extractHost(result.url)}`
      : `${result.articleTitle} · ${result.reference}`
  );
  const profileSources = authorResults.map((result) => `${result.name} · ${result.role}`);
  const webSources = webPreviews.map((preview) => `${preview.host} · ${preview.title}`);

  return {
    site: 'National Legal Observatory website, profiles, and verified bibliography',
    searchedFields: WEBSITE_SEARCH_FIELDS,
    matched: {
      publications: publicationResults.length,
      authorProfiles: authorResults.length,
      bibliographies: referenceResults.length,
      webPages: webPreviews.length,
    },
    bibliographySources,
    profileSources,
    webSources,
    summary: `Website content, author profiles, and verified bibliography entries, plus fetched previews for cited pages.`,
  };
}

function buildAnswerPrompt(
  query: string,
  publicationResults: SearchResult[],
  authorResults: AuthorSearchResult[],
  referenceResults: ReferenceSearchResult[],
  webPreviews: WebReferencePreview[],
  scope: AiSearchScope
) {
  const publicationContext = publicationResults
    .slice(0, 6)
    .map(
      (result, index) => `
${index + 1}. ${result.title}
   Author: ${result.authorName}
   Category: ${result.category}
   Snippet: ${result.excerpt || 'No snippet available.'}`
    )
    .join('\n');

  const authorContext = authorResults
    .slice(0, 4)
    .map(
      (result, index) => `
${index + 1}. ${result.name}
   Role: ${result.role}
   Bio: ${result.bio || 'No bio available.'}
   Snippet: ${result.excerpt || 'No snippet available.'}`
    )
    .join('\n');

  const bibliographyContext = referenceResults
    .slice(0, AI_REFERENCE_CONTEXT_LIMIT)
    .map(
      (result, index) => `
${index + 1}. ${result.articleTitle}
   Bibliography: ${result.reference}
   URL: ${result.url || 'No URL available.'}`
    )
    .join('\n');

  const webContext = webPreviews
    .slice(0, AI_WEB_REFERENCE_LIMIT)
    .map(
      (result, index) => `
${index + 1}. ${result.title}
   Host: ${result.host}
   Source: ${result.sourceReference}
   Preview: ${result.description}`
    )
    .join('\n');

  return [
    'CAVEMAN[COMPACT]',
    'You are a strict legal research assistant for the National Legal Observatory.',
    'Use only the provided website content, author profiles, and verified bibliography entries.',
    'If a fact is missing, say: Information not found in the observatory database.',
    'Never invent sources, URLs, or platforms.',
    'Never reference casual platforms like WhatsApp, Telegram, social media, or any unverified domain.',
    'Do not print raw URLs unless they appear in the verified bibliography context below.',
    'Output at most 4 short lines.',
    'Use only these labels when relevant: NLO:, PROFILE:, BIB:, WEB:, NOTE:.',
    'Keep each line to one sentence. No extra prose.',
    `Scope searched: ${scope.searchedFields.join(', ')}.`,
    '',
    `User query: ${query}`,
    '',
    `Matched publications: ${scope.matched.publications}`,
    `Matched author profiles: ${scope.matched.authorProfiles}`,
    `Matched verified bibliography entries: ${scope.matched.bibliographies}`,
    `Matched cited web pages: ${scope.matched.webPages}`,
    '',
    'Publication context:',
    publicationContext || 'No matching publication context found.',
    '',
    'Author profile context:',
    authorContext || 'No matching author profile context found.',
    '',
    'Verified bibliography context:',
    bibliographyContext || 'No matching bibliography entries found.',
    '',
    'Cited web page context:',
    webContext || 'No fetchable cited web pages found.',
  ].join('\n');
}

function formatCompactAiResponse(text: string) {
  const normalized = text
    .replace(/\r/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/^\s*(answer|response|summary)\s*:\s*/i, '')
    .replace(/^\s*caveman\s*[\[\(]?\s*compact\s*[\]\)]?\s*[:\-–]?\s*/i, '')
    .replace(/[“”]/g, '"')
    .trim();

  const lines = normalized
    .split('\n')
    .flatMap((line) =>
      line
        .split(/(?<=[.!?])\s+/)
        .map((part) => part.trim())
    )
    .map((line) =>
      line
        .replace(/https?:\/\/[^\s<>"')\]]+/gi, '')
        .replace(/[ \t]+/g, ' ')
        .replace(/^["']+|["']+$/g, '')
        .trim()
    )
    .filter((line) => !BANNED_RESPONSE_KEYWORDS.some((keyword) => line.toLowerCase().includes(keyword)))
    .filter(Boolean);

  const compactLines = lines.slice(0, 4);
  return compactLines.length > 0
    ? compactLines.join('\n')
    : 'NOTE: Information not found in the observatory database.';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const aiRequested = searchParams.get('ai') === '1' || searchParams.get('mode') === 'ai';

  if (!query.trim()) {
    return NextResponse.json({ aiResponse: null, aiError: null, results: [] });
  }

  try {
    const articles = await getArticles();
    const authors = await getAuthors();
    const cleanQuery = query.toLowerCase().trim();
    const filtered = buildSearchResults(cleanQuery, articles);
    const authorResults = buildAuthorResults(cleanQuery, authors);
    const referenceResults = buildReferenceResults(cleanQuery, articles);
    const baseScope = buildAiScope(filtered, authorResults, referenceResults, []);
    const sourcePack: AiSourcePack = {
      nloArticles: filtered.slice(0, 6),
      profiles: authorResults.slice(0, 4),
      citations: referenceResults.slice(0, AI_REFERENCE_CONTEXT_LIMIT),
      webPages: [],
    };

    if (!aiRequested) {
      return NextResponse.json({
        aiResponse: null,
        aiError: null,
        results: filtered,
        sources: sourcePack,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({
        aiResponse: null,
        aiError: 'AI search is not configured on this server yet.',
        scope: baseScope,
        results: filtered,
        sources: sourcePack,
      });
    }

    const ip = getClientIdentifier(request);
    const rateLimitStatus = checkAiRateLimit(ip);
    if (!rateLimitStatus.allowed) {
      return NextResponse.json(
        {
          error: `You have reached the limit of ${AI_SEARCH_LIMIT_PER_MINUTE} AI searches per minute. Try again in ${rateLimitStatus.resetTimeRemaining} seconds.`,
          remaining: rateLimitStatus.resetTimeRemaining,
          aiResponse: null,
          aiError: 'AI search limit reached.',
          scope: baseScope,
          results: filtered,
          sources: sourcePack,
        },
        { status: 429 }
      );
    }

    const webUrls = Array.from(
      new Set(referenceResults.map((result) => result.url).filter((url): url is string => Boolean(url)))
    ).slice(0, AI_WEB_REFERENCE_LIMIT);

    const webPreviews = (
      await Promise.all(
        webUrls.map((url) => {
          const sourceReference =
            referenceResults.find((result) => result.url === url)?.reference || url;
          return fetchWebReferencePreview(url, sourceReference, cleanQuery);
        })
      )
    ).filter((preview): preview is WebReferencePreview => Boolean(preview));

    const scope = buildAiScope(filtered, authorResults, referenceResults, webPreviews);
    sourcePack.webPages = webPreviews;
    sourcePack.profiles = authorResults.slice(0, 4);
    sourcePack.citations = referenceResults.slice(0, AI_REFERENCE_CONTEXT_LIMIT);
    sourcePack.nloArticles = filtered.slice(0, 6);

    if (!filtered.length && !authorResults.length && !referenceResults.length) {
      return NextResponse.json({
        aiResponse: 'I could not find that on the site or in cited references.',
        aiError: null,
        scope,
        results: filtered,
        sources: sourcePack,
      });
    }

    let aiResponse: string | null = null;
    let aiError: string | null = null;

    try {
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
                    text: buildAnswerPrompt(
                      query,
                      filtered,
                      authorResults,
                      referenceResults,
                      webPreviews,
                      scope
                    ),
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 180,
            },
          }),
        }
      );

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const rawResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        aiResponse = rawResponse ? formatCompactAiResponse(rawResponse) : null;
      } else {
        console.error('AI search API error:', await geminiRes.text());
        aiError = 'AI summary temporarily unavailable.';
      }
    } catch (geminiError) {
      console.error('Failed to fetch AI summary:', geminiError);
      aiError = 'AI summary temporarily unavailable.';
    }

    return NextResponse.json({
      aiResponse,
      aiError,
      scope,
      results: filtered,
      sources: sourcePack,
    });
  } catch (error) {
    console.error('Search API failure:', error);
    return NextResponse.json({ error: 'Failed to search archive' }, { status: 500 });
  }
}
