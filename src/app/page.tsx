import React from 'react';
import Link from 'next/link';
import { getArticles, getAuthors, getCategories, getArticleBySlug } from '../lib/content';
import ArticleCard from '../components/ArticleCard';

import MonthlyReleaseTimer from '../components/MonthlyReleaseTimer';
import { Landmark, Search, BookOpen, PenTool, Sparkles, Users, ArrowRight } from 'lucide-react';

export default async function Homepage() {
  const articles = (await getArticles()).filter((art) => !art.excludeFromArchive);
  const authors = await getAuthors();
  const categories = await getCategories();

  // Retrieve monthly review article details specifically for the timer widget
  const monthlyReview = await getArticleBySlug('research', 'monthly-legal-review-june-2026');

  // Pick non-monthly review articles for recent items
  const recentArticles = articles.filter((a) => a.slug !== 'monthly-legal-review-june-2026').slice(0, 3);

  // Map category slugs to icons for aesthetics
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'constitutional-law':
        return <Landmark className="w-5 h-5 text-indigo-500" />;
      case 'technology-law':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'public-policy':
        return <BookOpen className="w-5 h-5 text-amber-500" />;
      default:
        return <PenTool className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* 1. Hero Section */}
      <section className="relative text-center py-8 md:py-14 rounded-2xl bg-gradient-to-b from-indigo-50/40 via-white to-transparent dark:from-indigo-950/10 dark:via-slate-950 dark:to-transparent border-2 border-slate-200 dark:border-slate-800/30 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06),transparent)] dark:bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent)]" />
        <div className="relative max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100/60 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 uppercase tracking-widest animate-fade-in">
            Independent Legal Research
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white animate-slide-up stagger-1">
            National Legal Observatory
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-serif leading-relaxed italic max-w-2xl mx-auto">
            "The National Legal Observatory is an attempt to address an observation gap."
          </p>

          {/* Quick Navigation Pills */}
          <div className="pt-6 flex flex-wrap justify-center gap-3 animate-slide-up stagger-3">
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-sm font-medium shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="text-base">📚</span> Browse Papers
            </Link>
            <Link
              href="/publications?category=constitutional-law"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-sm font-medium shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="text-base">⚖️</span> Constitutional Law
            </Link>
            <Link
              href="/publications?category=technology-law"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-sm font-medium shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="text-base">💻</span> Tech & Policy
            </Link>
            <Link
              href="/#contributors"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-sm font-medium shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="text-base">👩‍⚖️</span> Authors
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-sm font-medium shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="text-base">✉️</span> Submit Research
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Observatory Mission Statement */}
      <section className="max-w-4xl mx-auto bg-indigo-50/20 dark:bg-slate-900/50 border-[1.5px] border-indigo-100 dark:border-slate-800 p-8 sm:p-10 rounded-2xl shadow-sm dark:shadow-xl flex flex-col md:flex-row items-center gap-6">
        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0 shadow-sm dark:shadow-none border border-indigo-100/40 dark:border-transparent">
          <Landmark className="w-8 h-8" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-serif text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Our Editorial Directive
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Constitutional law, civil litigation, criminal justice, commercial and contract law, environmental law, labour law, family law, technology and policy; these are all territories this platform covers, with the same rigour and the same commitment to primary sources.
          </p>
        </div>
      </section>

      {/* 3. Featured & Recent Publications */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-900 pb-3">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Current Publications
          </h2>
          <Link
            href="/publications"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
          >
            All Papers <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Release Timer / Monthly Review Card (Span 2) */}
          <div className="lg:col-span-2 flex">
            <MonthlyReleaseTimer
              monthlyReviewArticle={{
                slug: 'monthly-legal-review-june-2026',
                title: monthlyReview?.title || 'Monthly Legal Review — Vol. 1 | Issue 1 | June 2026',
                type: 'research',
                readingTime: monthlyReview?.readingTime || '15 min read',
                abstract: monthlyReview?.abstract || 'The inaugural Monthly Legal Review covering Supreme Court rulings, AI regulations in courts, delimitation battles, and labor law updates.',
                tags: monthlyReview?.tags || ['Monthly Review', 'Supreme Court', 'AI Regulations'],
                authorDetails: monthlyReview?.authorDetails || {
                  name: 'Bhoomija Khanna',
                  role: 'Research Director',
                  avatar: '/images/bhoomija_khanna.jpg',
                },
              }}
            />
          </div>

          {/* Right: Recent Papers List */}
          <div className="flex flex-col gap-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Recent Submissions
            </span>
            {recentArticles.map((art) => (
              <ArticleCard key={art.slug} article={art} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Research Areas Grid */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-900 pb-3">
          <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            Core Research Domains
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/publications?category=${cat.slug}`}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition duration-300 group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 group-hover:scale-110 transition-transform">
                  {getCategoryIcon(cat.slug)}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 group-hover:translate-x-1 transition" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>



      {/* 6. Contributors Section */}
      <section id="contributors" className="space-y-6 pt-4 scroll-mt-24">
        <div className="border-b border-slate-200 dark:border-slate-900 pb-3 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              Observatory Authors
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Independent researchers and legal Authors contributing analysis
            </p>
          </div>
          <Users className="w-5 h-5 text-indigo-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <div
              key={author.slug}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center space-x-4">
                {author.avatar && (
                  <Link href={author.slug === 'bhoomija-khanna' ? '/bhoomija' : `/authors/${author.slug}`} className="shrink-0">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/20 hover:border-indigo-500 hover:scale-105 transition duration-200 cursor-pointer"
                    />
                  </Link>
                )}
                <div>
                  <Link href={author.slug === 'bhoomija-khanna' ? '/bhoomija' : `/authors/${author.slug}`}>
                    <h4 className="font-serif font-bold text-slate-900 dark:text-white text-base hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer">
                      {author.name}
                    </h4>
                  </Link>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {author.role}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                {author.bio}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <Link
                  href={author.slug === 'bhoomija-khanna' ? '/bhoomija' : `/authors/${author.slug}`}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  View Profile & Publications &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
