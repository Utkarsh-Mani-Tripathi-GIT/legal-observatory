import React from 'react';
import Link from 'next/link';
import { ArticleData } from '../lib/markdown';
import { Calendar, Clock, User, ArrowUpRight, Pin } from 'lucide-react';
import AuthorLink from './AuthorLink';

export default function ArticleCard({ article, searchTerm }: { article: ArticleData; searchTerm?: string }) {
  // Map internal database folders to correct URL routes
  const typeMapping: Record<string, string> = {
    judgment: 'judgments',
    policy: 'policies',
    research: 'research',
    opinion: 'opinions',
  };

  const folder = typeMapping[article.type] || 'research';
  const articleUrl = `/publications/${folder}/${article.slug}`;
  
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="group relative flex flex-col justify-between p-6 glass-card border border-slate-200/60 dark:border-slate-800/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between text-xs mb-3 text-slate-400 dark:text-slate-500">
          <span className="px-2.5 py-0.5 rounded-full font-semibold bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 uppercase tracking-wider text-[10px]">
            {article.type}
          </span>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readingTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 
          className="font-serif text-lg sm:text-xl font-bold leading-snug text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
          style={{ viewTransitionName: `article-title-${article.slug}` } as React.CSSProperties}
        >
          <Link href={articleUrl} className="focus:outline-none">
            {article.title}
          </Link>
        </h3>

        {/* Abstract / Summary */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
          {article.abstract || article.caseSummary || article.policyOverview || 'Click to read full legal publication, including case summaries, legislative objectives, references, and citations.'}
        </p>

        {/* Categories / Tags badges */}
        <div className="flex flex-wrap gap-1 mt-4">
          {article.categories.map((cat) => (
            <span key={cat} className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded">
              #{cat.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>

        {/* Footer Info Row */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs">
            {article.authorDetails?.avatar ? (
              <img
                src={article.authorDetails.avatar}
                alt={article.authorDetails.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
            <AuthorLink
              slug={article.author}
              className="font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-650 dark:hover:text-indigo-400 hover:underline"
            >
              {article.authorDetails?.name || 'Observatory Editor'}
            </AuthorLink>
            <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          </div>

          <Link
            href={articleUrl}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center group-hover:underline"
          >
            Read Paper <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Jump to mention button — only shows when search/tag filter is active */}
        {searchTerm && searchTerm.trim().length >= 2 && (
          <Link
            href={`${articleUrl}?highlight=${encodeURIComponent(searchTerm.trim())}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold
              bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400
              border border-amber-200/60 dark:border-amber-700/30
              hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all duration-150 group/jump"
            title={`Jump to first mention of "${searchTerm}" in this article`}
          >
            <Pin className="w-3 h-3 group-hover/jump:scale-110 transition-transform" />
            Jump to &ldquo;{searchTerm.trim().length > 22 ? searchTerm.trim().slice(0, 22) + '…' : searchTerm.trim()}&rdquo; →
          </Link>
        )}
      </div>
    </article>
  );
}
