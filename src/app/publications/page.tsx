import React from 'react';
import { getArticles, getCategories, getPageViewCount } from '../../lib/content';
import ArticleCard from '../../components/ArticleCard';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowUpDown, Tag, Landmark, User, Clock, AlertCircle, FileText } from 'lucide-react';

interface SearchParams {
  q?: string;
  category?: string;
  type?: string;
  tag?: string;
  author?: string;
  sort?: string;
  page?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export const metadata = {
  title: 'Publications Archive',
  description: 'Search, filter, and read our entire repository of independent legal research papers.',
};

export default async function PublicationsPage(props: PageProps) {
  // Await searchParams in Next.js 15/16
  const params = await props.searchParams;
  const query = params.q || '';
  const category = params.category || '';
  const activeType = params.type || '';
  const activeTag = params.tag || '';
  const author = params.author || '';
  const sort = params.sort || 'date';
  const pageNum = parseInt(params.page || '1', 10);
  const itemsPerPage = 6;

  // Retrieve base content data
  const rawArticles = await getArticles();
  const categories = await getCategories();

  // 1. Filter Articles
  let filteredArticles = [...rawArticles];

  if (query.trim()) {
    const cleanQuery = query.toLowerCase().trim();
    filteredArticles = filteredArticles.filter((art) => {
      const titleMatch = art.title.toLowerCase().includes(cleanQuery);
      const contentMatch = art.rawContent?.toLowerCase().includes(cleanQuery);
      const tagMatch = art.tags.some((t) => t.toLowerCase().includes(cleanQuery));
      const authorMatch = art.authorDetails?.name.toLowerCase().includes(cleanQuery);
      return titleMatch || contentMatch || tagMatch || authorMatch;
    });
  }

  if (category) {
    filteredArticles = filteredArticles.filter((art) => art.categories.includes(category));
  }

  if (activeType) {
    filteredArticles = filteredArticles.filter((art) => art.type === activeType || art.format === activeType);
  }

  if (activeTag) {
    filteredArticles = filteredArticles.filter((art) => 
      art.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase())
    );
  }

  if (author) {
    filteredArticles = filteredArticles.filter((art) => art.author === author);
  }

  // 2. Sort Articles
  if (sort === 'popularity') {
    // Dynamically retrieve and map page view counts to sort
    const articlesWithViews = await Promise.all(
      filteredArticles.map(async (art) => {
        const views = await getPageViewCount(art.slug);
        return { art, views };
      })
    );
    articlesWithViews.sort((a, b) => b.views - a.views);
    filteredArticles = articlesWithViews.map((item) => item.art);
  } else {
    // Default: Date Descending
    filteredArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // 3. Paginate
  const totalItems = filteredArticles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (pageNum - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  // Collect all unique tags for suggestion pills
  const allTags = Array.from(
    new Set(rawArticles.flatMap((art) => art.tags))
  ).slice(0, 8);

  // Helper to compile search href parameters
  const getHref = (updates: Partial<SearchParams>, isReset: boolean = false) => {
    const newParams = isReset ? {} : { q: query, category, type: activeType, tag: activeTag, author, sort, page: pageNum.toString() };
    const merged = { ...newParams, ...updates };
    
    // Clear empty parameters
    Object.keys(merged).forEach((key) => {
      const val = merged[key as keyof typeof merged];
      if (!val || val === '1' && key === 'page' || val === 'date' && key === 'sort') {
        delete merged[key as keyof typeof merged];
      }
    });

    const queryString = new URLSearchParams(merged).toString();
    return `/publications${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Publications Archive
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-normal">
          Explore independent legal research publications and papers.
        </p>
      </div>

      {/* Main Grid: Filters Sidebar + Content Grid + Categories Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Formats & Tags Sidebar */}
        <aside className="space-y-6 lg:col-span-1">
          
          {/* A. Inline Search Input Bar */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl shadow-sm glass-card">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center text-slate-900 dark:text-white">
              <Search className="w-3.5 h-3.5 mr-1 text-indigo-500" /> Search Filter
            </h3>
            <form method="GET" action="/publications" className="relative">
              {category && <input type="hidden" name="category" value={category} />}
              {activeType && <input type="hidden" name="type" value={activeType} />}
              {activeTag && <input type="hidden" name="tag" value={activeTag} />}
              {author && <input type="hidden" name="author" value={author} />}
              {sort && <input type="hidden" name="sort" value={sort} />}
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Keywords..."
                className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
              <button type="submit" className="absolute right-2 top-2 text-slate-400 hover:text-slate-600">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* B. Formats Multi-List (Moved to top of left column) */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl shadow-sm glass-card">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center text-slate-900 dark:text-white">
              <FileText className="w-3.5 h-3.5 mr-1 text-indigo-500" /> Formats
            </h3>
            <div className="flex flex-col space-y-1 text-xs">
              <Link
                href={getHref({ type: undefined, page: '1' })}
                className={`py-1.5 px-2.5 rounded-md transition ${
                  !activeType
                    ? 'bg-indigo-50 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Formats
              </Link>
              {[
                { slug: 'judgment', name: 'Judgment Reviews' },
                { slug: 'policy', name: 'Policy Briefs' },
                { slug: 'research', name: 'Research Articles' },
                { slug: 'opinion', name: 'Essays & Opinions' },
                { slug: 'blog', name: 'Blog Posts' },
              ].map((fmt) => (
                <Link
                  key={fmt.slug}
                  href={getHref({ type: fmt.slug, page: '1' })}
                  className={`py-1.5 px-2.5 rounded-md transition truncate ${
                    activeType === fmt.slug
                      ? 'bg-indigo-50 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-semibold'
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={fmt.name}
                >
                  {fmt.name}
                </Link>
              ))}
            </div>
          </div>

          {/* C. Tags Pills */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl shadow-sm glass-card">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center text-slate-900 dark:text-white">
              <Tag className="w-3.5 h-3.5 mr-1 text-indigo-500" /> Hot Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => {
                const isTagActive = activeTag.toLowerCase() === tag.toLowerCase();
                return (
                  <Link
                    key={tag}
                    href={getHref({ tag: isTagActive ? undefined : tag, page: '1' })}
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border transition-colors ${
                      isTagActive
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {tag}
                  </Link>
                );
              })}
            </div>
          </div>

        </aside>

        {/* Center Section: Catalogue grid + Toolbar (col-span-2) */}
        <section className="lg:col-span-2 space-y-6">
          
          {/* Header toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl shadow-sm text-xs gap-3 glass-card">
            <div className="text-slate-400">
              Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredArticles.length}</span> publications found
            </div>
            
            {/* Sort options */}
            <div className="flex items-center space-x-4 ml-auto sm:ml-0 shrink-0">
              <div className="flex items-center space-x-1.5 text-slate-400">
                <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
                <span>Sort by:</span>
              </div>
              <div className="flex space-x-1 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-950 p-0.5">
                <Link
                  href={getHref({ sort: 'date' })}
                  className={`px-2.5 py-1 rounded transition-colors font-semibold ${
                    sort === 'date'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Latest
                </Link>
                <Link
                  href={getHref({ sort: 'popularity' })}
                  className={`px-2.5 py-1 rounded transition-colors font-semibold ${
                    sort === 'popularity'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Popularity
                </Link>
              </div>

              {/* Reset filter button if active */}
              {(query || category || activeType || activeTag || author) && (
                <Link
                  href={getHref({}, true)}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Clear Filters
                </Link>
              )}
            </div>
          </div>

          {/* Catalog grid list */}
          {paginatedArticles.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl glass-card">
              <AlertCircle className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-slate-200">
                {query ? (
                  <React.Fragment>No results for &ldquo;<span className="text-indigo-650 dark:text-indigo-400 font-bold">{query}</span>&rdquo;</React.Fragment>
                ) : (
                  "No publications found"
                )}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
                {query ? (
                  <React.Fragment>
                    No articles match your search for <strong className="font-bold text-slate-700 dark:text-slate-300">&ldquo;{query}&rdquo;</strong>. Try adjusting your keywords or clearing the active filters.
                  </React.Fragment>
                ) : activeTag ? (
                  <React.Fragment>
                    No articles match the tag <strong className="font-bold text-slate-700 dark:text-slate-300">#{activeTag}</strong>. Try clearing the filter.
                  </React.Fragment>
                ) : (
                  "No articles match your current active filters. Try adjusting your keywords or clearing the category selection."
                )}
              </p>
              <div className="mt-4">
                <Link
                  href={getHref({}, true)}
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-750 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white dark:text-slate-950 rounded-lg shadow-sm transition inline-block"
                >
                  Reset All Filters
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {paginatedArticles.map((art, idx) => (
                <div key={art.slug} className={`animate-slide-up stagger-${Math.min(idx + 1, 6)}`}>
                  <ArticleCard article={art} searchTerm={query || activeTag || undefined} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-1.5 pt-4 text-xs">
              {pageNum > 1 ? (
                <Link
                  href={getHref({ page: (pageNum - 1).toString() })}
                  className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition font-bold glass-card"
                >
                  Previous
                </Link>
              ) : (
                <span className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed glass-card">
                  Previous
                </span>
              )}

              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const isCurrent = p === pageNum;
                return (
                  <Link
                    key={p}
                    href={getHref({ page: p.toString() })}
                    className={`px-3 py-1.5 rounded border font-semibold ${
                      isCurrent
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 glass-card'
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}

              {pageNum < totalPages ? (
                <Link
                  href={getHref({ page: (pageNum + 1).toString() })}
                  className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition font-bold glass-card"
                >
                  Next
                </Link>
              ) : (
                <span className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed glass-card">
                  Next
                </span>
              )}
            </div>
          )}

        </section>

        {/* Right Side: Categories Sidebar (col-span-1) */}
        <aside className="space-y-6 lg:col-span-1">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl shadow-sm glass-card">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center text-slate-900 dark:text-white">
              <Landmark className="w-3.5 h-3.5 mr-1 text-indigo-500" /> Categories
            </h3>
            <div className="flex flex-col space-y-1 text-xs">
              <Link
                href={getHref({ category: undefined, page: '1' })}
                className={`py-1.5 px-2.5 rounded-md transition ${
                  !category
                    ? 'bg-indigo-50 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Categories
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={getHref({ category: cat.slug, page: '1' })}
                  className={`py-1.5 px-2.5 rounded-md transition truncate ${
                    category === cat.slug
                      ? 'bg-indigo-50 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-semibold'
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={cat.name}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
