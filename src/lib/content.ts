import {
  getArticles as getLocalArticles,
  getArticleBySlug as getLocalArticleBySlug,
  getAuthors as getLocalAuthors,
  getAuthorBySlug as getLocalAuthorBySlug,
  getCategories as getLocalCategories,
  getCategoryBySlug as getLocalCategoryBySlug,
  ArticleData,
  AuthorData,
  CategoryData,
} from './markdown';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

// Helper to map DB row to ArticleData type
function mapDbArticleToArticleData(dbArt: any, authorDetails?: AuthorData): ArticleData {
  return {
    slug: dbArt.slug,
    type: dbArt.type,
    title: dbArt.title,
    author: dbArt.author_slug,
    authorDetails,
    date: dbArt.date,
    categories: dbArt.categories || [],
    tags: dbArt.tags || [],
    content: dbArt.content,
    rawContent: dbArt.raw_content || '',
    readingTime: dbArt.reading_time || '5 min read',
    
    caseSummary: dbArt.case_summary,
    legalPrinciples: dbArt.legal_principles,
    statutesReferenced: dbArt.statutes_referenced,
    keyTakeaways: dbArt.key_takeaways,
    citation: dbArt.citation,
    
    policyOverview: dbArt.policy_overview,
    policyObjectives: dbArt.policy_objectives,
    legalImplications: dbArt.legal_implications,
    
    abstract: dbArt.abstract,
    references: dbArt.references,
    coverImage: dbArt.cover_image ?? dbArt.coverImage,
    excludeFromArchive: dbArt.exclude_from_archive ?? false,
  };
}

export async function getCategories(): Promise<CategoryData[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient() as any;
    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      if (!error && data) {
        return data as CategoryData[];
      }
      console.warn('Supabase categories error, falling back to local files:', error);
    }
  }
  return getLocalCategories();
}

export async function getCategoryBySlug(slug: string): Promise<CategoryData | undefined> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient() as any;
    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        return data as CategoryData;
      }
    }
  }
  return getLocalCategoryBySlug(slug);
}

export async function getAuthors(): Promise<AuthorData[]> {
  const localAuthors = getLocalAuthors();
  const localAuthorsMap = new Map(localAuthors.map((a) => [a.slug, a]));

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient() as any;
    if (supabase) {
      const { data, error } = await supabase
        .from('authors')
        .select('*');
      if (!error && data) {
        return data
          .map((d: any): AuthorData => {
            const local = localAuthorsMap.get(d.slug);
            const rawLinks = local?.socialLinks || d.social_links || {};
            const socialLinks = { ...rawLinks };
            delete (socialLinks as any).twitter;

            return {
              slug: d.slug,
              name: local?.name || d.name,
              role: local?.role || d.role,
              avatar: local?.avatar || d.avatar,
              bio: local?.bio || d.bio,
              socialLinks,
            };
          })
          .filter((a: AuthorData) => localAuthorsMap.has(a.slug));
      }
      console.warn('Supabase authors error, falling back to local files:', error);
    }
  }
  return localAuthors;
}

export async function getAuthorBySlug(slug: string): Promise<AuthorData | undefined> {
  const localAuthor = getLocalAuthorBySlug(slug);
  if (!localAuthor) {
    return undefined;
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient() as any;
    if (supabase) {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        const rawLinks = localAuthor.socialLinks || data.social_links || {};
        const socialLinks = { ...rawLinks };
        delete (socialLinks as any).twitter;

        return {
          slug: data.slug,
          name: localAuthor.name || data.name,
          role: localAuthor.role || data.role,
          avatar: localAuthor.avatar || data.avatar,
          bio: localAuthor.bio || data.bio,
          socialLinks,
        };
      }
    }
  }
  return localAuthor;
}

export async function getArticles(
  typeFolder?: 'judgments' | 'policies' | 'research' | 'opinions'
): Promise<ArticleData[]> {
  const localArticles = await getLocalArticles(typeFolder);
  const localArticlesMap = new Map(localArticles.map((a) => [a.slug, a]));

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient() as any;
    if (supabase) {
      let query = supabase.from('articles').select('*');
      if (typeFolder) {
        // Map typeFolder names to db type slugs (singular)
        const typeMapping: Record<string, string> = {
          judgments: 'judgment',
          policies: 'policy',
          research: 'research',
          opinions: 'opinion',
        };
        query = query.eq('type', typeMapping[typeFolder] || typeFolder);
      }
      
      const { data: dbArticles, error } = await query.order('date', { ascending: false });
      
      if (!error && dbArticles) {
        const authors = await getAuthors();
        const authorsMap = new Map(authors.map((a) => [a.slug, a]));
        const dbArticlesMap = new Map(dbArticles.map((art: any) => [art.slug, art]));

        return localArticles.map((local) => {
          const dbArt = dbArticlesMap.get(local.slug);
          if (dbArt) {
            const authorDetails = authorsMap.get(dbArt.author_slug);
            const mapped = mapDbArticleToArticleData(dbArt, authorDetails);
            return {
              ...mapped,
              title: local.title || mapped.title,
              content: local.content || mapped.content,
              rawContent: local.rawContent || mapped.rawContent,
              abstract: local.abstract || mapped.abstract,
              categories: local.categories || mapped.categories,
              tags: local.tags || mapped.tags,
              citation: local.citation || mapped.citation,
              references: local.references || mapped.references,
              authorDetails: local.authorDetails || mapped.authorDetails,
              excludeFromArchive: local.excludeFromArchive ?? mapped.excludeFromArchive,
            };
          }
          return local;
        });
      }
      console.warn('Supabase articles query error, falling back to local files:', error);
    }
  }
  return localArticles;
}

export async function getArticleBySlug(
  typeFolder: 'judgments' | 'policies' | 'research' | 'opinions',
  slug: string
): Promise<ArticleData | undefined> {
  const localArticle = await getLocalArticleBySlug(typeFolder, slug);
  if (!localArticle) {
    return undefined;
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient() as any;
    if (supabase) {
      const { data: dbArt, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (!error && dbArt) {
        const articleData = dbArt as any;
        const authorDetails = await getAuthorBySlug(articleData.author_slug);
        const mapped = mapDbArticleToArticleData(articleData, authorDetails);
        return {
          ...mapped,
          title: localArticle.title || mapped.title,
          content: localArticle.content || mapped.content,
          rawContent: localArticle.rawContent || mapped.rawContent,
          abstract: localArticle.abstract || mapped.abstract,
          categories: localArticle.categories || mapped.categories,
          tags: localArticle.tags || mapped.tags,
          citation: localArticle.citation || mapped.citation,
            coverImage: localArticle.coverImage || mapped.coverImage,
          references: localArticle.references || mapped.references,
          excludeFromArchive: localArticle.excludeFromArchive ?? mapped.excludeFromArchive,
        };
      }
    }
  }
  return localArticle;
}

// Get related articles
export async function getRelatedArticles(currentArticle: ArticleData, limit: number = 3): Promise<ArticleData[]> {
  const allArticles = await getArticles();
  return allArticles
    .filter((art) => !art.excludeFromArchive)
    .filter((art) => art.slug !== currentArticle.slug) // exclude current
    .filter((art) => 
      art.categories.some((cat) => currentArticle.categories.includes(cat)) ||
      art.tags.some((tag) => currentArticle.tags.includes(tag))
    )
    .slice(0, limit);
}

// Page View Tracking
export async function incrementPageView(slug: string): Promise<number> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient() as any;
    if (supabase) {
      // Direct database call via rpc or increment table row
      const { data, error } = await (supabase as any).rpc('increment_page_view', { article_slug: slug });
      if (!error && data !== null) {
        return data as number;
      }
      // If RPC is missing, insert/update page_views row
      const { data: selectData } = await supabase
        .from('page_views')
        .select('views')
        .eq('slug', slug)
        .maybeSingle();
      
      const newViews = ((selectData as any)?.views || 0) + 1;
      await supabase
        .from('page_views')
        .upsert({ slug, views: newViews, updated_at: new Date().toISOString() });
      return newViews;
    }
  }
  
  // Client-side LocalStorage fallback for tracking
  if (typeof window !== 'undefined') {
    const key = `view_count_${slug}`;
    const current = parseInt(localStorage.getItem(key) || '0', 10);
    const updated = current + 1;
    localStorage.setItem(key, updated.toString());
    return updated;
  }
  return 124; // Static server render default page view placeholder
}

// Fetch Page Views
export async function getPageViewCount(slug: string): Promise<number> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient() as any;
    if (supabase) {
      const { data, error } = await supabase
        .from('page_views')
        .select('views')
        .eq('slug', slug)
        .maybeSingle();
      if (!error && data) {
        return (data as any).views;
      }
    }
  }
  
  if (typeof window !== 'undefined') {
    return parseInt(localStorage.getItem(`view_count_${slug}`) || '0', 10) + 124;
  }
  
  // Return a seeded predictable view count for aesthetics
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 400) + 112;
}

// Newsletter subscription
export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient() as any;
    if (supabase) {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, subscribed_at: new Date().toISOString() }]);
      
      if (error) {
        if (error.code === '23505') { // Postgres duplicate key error
          return { success: true, message: 'You have already subscribed to our newsletter.' };
        }
        return { success: false, message: error.message };
      }
      return { success: true, message: 'Thank you for subscribing to our publications!' };
    }
  }
  
  return {
    success: true,
    message: 'Subscription successful (Local Mode: Simulating newsletter subscription for ' + email + ')',
  };
}


