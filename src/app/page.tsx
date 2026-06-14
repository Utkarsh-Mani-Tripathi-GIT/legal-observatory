import React from 'react';
import Link from 'next/link';
import { getArticles, getAuthors, getCategories } from '../lib/content';
import ArticleCard from '../components/ArticleCard';
import { Landmark, Search, BookOpen, PenTool, Sparkles, Users, ArrowRight } from 'lucide-react';

export default async function Homepage() {
  const articles = await getArticles();
  const authors = await getAuthors();
  const categories = await getCategories();

  // Pick first article as featured, next 3 as recent
  const featuredArticle = articles[0];
  const recentArticles = articles.slice(1, 4);

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
      <section className="relative text-center py-8 md:py-14 rounded-2xl bg-gradient-to-b from-indigo-50/40 via-white to-transparent dark:from-indigo-950/10 dark:via-slate-950 dark:to-transparent border border-slate-200/40 dark:border-slate-800/20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06),transparent)] dark:bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent)]" />
        <div className="relative max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100/60 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 uppercase tracking-widest animate-fade-in">
            National Legal Observatory
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white animate-slide-up stagger-1">
            Independent Legal Research
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
            <a
              href="https://utkarshmanitripathi.vercel.app/resume/OVERALL/full-resume.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-400 text-sm font-semibold shadow-sm hover:shadow-md hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="text-base">⚡</span> The Tech Guy
            </a>
          </div>
        </div>
      </section>

      {/* 2. Observatory Mission Statement */}
      <section className="max-w-4xl mx-auto bg-indigo-50/20 dark:bg-slate-900/50 border border-indigo-100/70 dark:border-slate-800 p-8 sm:p-10 rounded-2xl shadow-sm dark:shadow-xl flex flex-col md:flex-row items-center gap-6">
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
          {/* Left: Featured Paper (Span 2) */}
          {featuredArticle && (
            <div className="lg:col-span-2 flex">
              <div className="flex flex-col justify-between p-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition duration-300 relative group flex-grow">
                <div>
                  <div className="flex items-center space-x-3 text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-bold mb-4">
                    <span className="px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-slate-800 text-[10px]">
                      Featured {featuredArticle.type}
                    </span>
                    <span>&bull;</span>
                    <span>{featuredArticle.readingTime}</span>
                  </div>
                  
                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <Link href={`/publications/${featuredArticle.type === 'judgment' ? 'judgments' : featuredArticle.type === 'policy' ? 'policies' : featuredArticle.type === 'research' ? 'research' : 'opinions'}/${featuredArticle.slug}`}>
                      {featuredArticle.title}
                    </Link>
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed text-sm sm:text-base line-clamp-4">
                    {featuredArticle.abstract || featuredArticle.caseSummary || featuredArticle.policyOverview}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-6">
                    {featuredArticle.tags.map((tag) => (
                      <span key={tag} className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    {featuredArticle.authorDetails?.avatar && (
                      <img
                        src={featuredArticle.authorDetails.avatar}
                        alt={featuredArticle.authorDetails.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {featuredArticle.authorDetails?.name}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {featuredArticle.authorDetails?.role}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/publications/${featuredArticle.type === 'judgment' ? 'judgments' : featuredArticle.type === 'policy' ? 'policies' : featuredArticle.type === 'research' ? 'research' : 'opinions'}/${featuredArticle.slug}`}
                    className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-750 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white dark:text-slate-950 rounded-lg shadow-sm transition"
                  >
                    Read Full Paper
                  </Link>
                </div>
              </div>
            </div>
          )}

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

      {/* 5. Contributor Section */}
      <section id="contributors" className="space-y-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex p-2 bg-indigo-50 dark:bg-slate-900 rounded-full text-indigo-500 mb-2">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Founder & Editor
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-normal">
            The platform is curated and led by its founder, Bhoomija Khanna.
          </p>
        </div>

        <div className="max-w-2xl mx-auto pt-4">
          {authors.map((author) => (
            <div
              key={author.slug}
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl"
            >
              <img
                src={author.avatar}
                alt={author.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800 shrink-0"
              />
              <div className="space-y-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {author.name}
                  </h4>
                  <p className="text-xs text-indigo-650 dark:text-indigo-400 font-semibold">
                    {author.role}
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {author.bio}
                </p>
                <div className="pt-1 flex justify-center sm:justify-start gap-3 text-xs font-semibold text-indigo-650 dark:text-indigo-400 hover:underline">
                  <Link href={author.slug === 'bhoomija-khanna' ? '/bhoomija' : `/authors/${author.slug}`}>
                    View Profile & Publications &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
