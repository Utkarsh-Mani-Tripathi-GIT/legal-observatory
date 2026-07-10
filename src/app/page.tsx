import React from 'react';
import Link from 'next/link';
import { getArticles, getAuthors } from '../lib/content';
import ArticleCard from '../components/ArticleCard';
import UpcomingResearchTeaser from '../components/UpcomingResearchTeaser';
import AuthorLink from '../components/AuthorLink';
import { Landmark, Users, ArrowRight } from 'lucide-react';

export default async function Homepage() {
  const articles = await getArticles();
  const authors = await getAuthors();

  // Pick first article as featured, next 3 as recent
  const featuredArticle = articles[0];
  const recentArticles = articles.slice(1, 5);

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
            &ldquo;The National Legal Observatory is an attempt to address an observation gap.&rdquo;
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
              href="/authors"
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
          {/* Left: Featured Paper (Span 2) */}
          {featuredArticle && (
            <div className="lg:col-span-2 flex">
              <div className="flex flex-col bg-white dark:bg-slate-900 border-[1.5px] border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition duration-300 group flex-grow p-5">

                {/* Badge + reading time */}
                <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-widest font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-slate-800">Featured</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-slate-400 dark:text-slate-500 font-medium normal-case tracking-normal">{featuredArticle.readingTime}</span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <Link href={`/publications/${featuredArticle.type === 'judgment' ? 'judgments' : featuredArticle.type === 'policy' ? 'policies' : featuredArticle.type === 'research' ? 'research' : 'opinions'}/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h3>

                {/* Abstract */}
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-2.5 line-clamp-2">
                  {featuredArticle.abstract || featuredArticle.caseSummary || featuredArticle.policyOverview}
                </p>

                {/* Spacer */}
                <div className="flex-grow min-h-[1rem]" />

                {/* Author + Button */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                  <div className="flex items-center gap-2.5">
                    {featuredArticle.authorDetails?.avatar && (
                      <img
                        src={featuredArticle.authorDetails.avatar}
                        alt={featuredArticle.authorDetails.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                    )}
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {featuredArticle.authorDetails?.name}
                    </span>
                  </div>
                  <Link
                    href={`/publications/${featuredArticle.type === 'judgment' ? 'judgments' : featuredArticle.type === 'policy' ? 'policies' : featuredArticle.type === 'research' ? 'research' : 'opinions'}/${featuredArticle.slug}`}
                    className="px-3.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg shadow-sm transition shrink-0"
                  >
                    Read Article →
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

      {/* 4. Upcoming / Published Research */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-900 pb-3">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Research Desk
          </h2>
          <Link
            href="/publications?type=research"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
          >
            All Research <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <UpcomingResearchTeaser
          publishAt="2026-06-19T18:57:00+05:30"
          article={{
            title: "Manufacturing Consent: How Political Narratives Are Engineered in India",
            slug: "manufacturing-consent",
            category: "Research Article",
            publisher: "National Legal Observatory Research Desk",
            publication: "June 2026",
            readingTime: "22 min read",
            abstract: "This article examines the mechanisms through which political consent is manufactured in India, from historical propaganda techniques to modern algorithmic amplification. It analyses the constitutional tension between free speech and narrative manipulation, and proposes a framework for building democratic resilience.",
            href: "/publications/research/manufacturing-consent",
          }}
        />
      </section>

      {/* 5. Contributor Section */}
      <section id="contributors" className="space-y-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex p-2 bg-indigo-50 dark:bg-slate-900 rounded-full text-indigo-500 mb-2">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Editorial Team
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-normal">
            The platform is curated and maintained by the editorial and technology contributors behind the observatory.
          </p>
        </div>

        <div className="max-w-2xl mx-auto pt-4">
          {authors.map((author) => (
            <div
              key={author.slug}
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-6 bg-white dark:bg-slate-900 border-[1.5px] border-slate-200 dark:border-slate-800 rounded-xl"
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
                  <AuthorLink slug={author.slug}>
                    View Profile & Publications &rarr;
                  </AuthorLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
