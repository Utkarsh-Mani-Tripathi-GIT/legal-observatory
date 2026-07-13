import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, Clock, Laptop, Landmark, Mail, Scale, Users } from 'lucide-react';
import { getArticles } from '../lib/content';
import type { ArticleData } from '../lib/markdown';
import Avatar from '../components/Avatar';

function getPublicationPath(article: Pick<ArticleData, 'type' | 'slug'>) {
  const folder =
    article.type === 'judgment'
      ? 'judgments'
      : article.type === 'policy'
      ? 'policies'
      : article.type === 'research'
      ? 'research'
      : 'opinions';

  return `/publications/${folder}/${article.slug}`;
}

function getBadgeLabel(article: ArticleData) {
  if (article.format === 'monthly-report') return 'RESEARCH';
  if (article.type === 'opinion') return 'OPINION';
  if (article.type === 'policy') return 'POLICY';
  if (article.type === 'judgment') return 'JUDGMENT';
  return 'RESEARCH';
}

function getExcerpt(article: ArticleData) {
  return (
    article.abstract ||
    article.caseSummary ||
    article.policyOverview ||
    'Primary-source legal analysis from the National Legal Observatory.'
  );
}

function HomeAvatar({
  article,
  className,
}: {
  article: ArticleData;
  className: string;
}) {
  return (
    <Avatar
      src={article.authorDetails?.avatar}
      alt={article.authorDetails?.name || 'Author'}
      className={className}
    />
  );
}

function HeroSection() {
  const pillClass =
    'inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#2a2a2a]/95 px-4 py-3 text-sm sm:text-base font-medium text-slate-200 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-amber-300/40 hover:bg-[#313131] hover:text-white';

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-[#2a2a2a] bg-[linear-gradient(180deg,#1e1e20_0%,#19191b_100%)] px-4 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.3)] sm:px-6 sm:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(241,213,106,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(88,88,133,0.12),transparent_28%)]" />
      <div className="relative mx-auto flex min-h-[470px] max-w-5xl flex-col items-center justify-center text-center sm:min-h-[520px]">
        <span className="inline-flex items-center rounded-full bg-[#5a4b1f] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.35em] text-[#f0d56a] sm:text-[11px]">
          Independent Legal Research
        </span>

        <h1 className="mt-8 font-serif text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-[72px]">
          National Legal Observatory
        </h1>

        <p className="mt-5 max-w-4xl font-serif text-lg italic leading-relaxed text-slate-400 sm:text-2xl">
          {"“The National Legal Observatory is an attempt to address an observation gap.”"}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link href="/publications" className={pillClass}>
            <BookOpen className="h-4 w-4 text-[#f0d56a]" />
            Browse Papers
          </Link>
          <Link href="/publications?category=constitutional-law" className={pillClass}>
            <Scale className="h-4 w-4 text-[#f0d56a]" />
            Constitutional Law
          </Link>
          <Link href="/publications?category=technology-law" className={pillClass}>
            <Laptop className="h-4 w-4 text-[#f0d56a]" />
            Tech &amp; Policy
          </Link>
          <Link href="/authors" className={pillClass}>
            <Users className="h-4 w-4 text-[#f0d56a]" />
            Authors
          </Link>
        </div>

        <div className="mt-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#2a2a2a]/95 px-5 py-3 text-sm sm:text-base font-medium text-slate-200 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-amber-300/40 hover:bg-[#313131] hover:text-white"
          >
            <Mail className="h-4 w-4 text-[#f0d56a]" />
            Submit Research
          </Link>
        </div>
      </div>
    </section>
  );
}

function EditorialDirective() {
  return (
    <section className="mx-auto max-w-5xl rounded-[24px] border border-slate-800 bg-[#1f1f1f] px-5 py-7 shadow-[0_14px_40px_rgba(0,0,0,0.28)] sm:px-8 sm:py-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#2a2a2a] text-[#f0d56a]">
          <Landmark className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
            Our Editorial Directive
          </h2>
          <p className="max-w-4xl text-sm leading-relaxed text-slate-400 sm:text-base sm:leading-7">
            Constitutional law, civil litigation, criminal justice, commercial and contract law, environmental law, labour law, family law, technology and policy; these are all territories this platform covers, with the same rigour and the same commitment to primary sources.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeaturedPublicationCard({ article }: { article: ArticleData }) {
  const href = getPublicationPath(article);

  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/6 bg-[#242424] p-5 sm:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(211,172,43,0.08),transparent_30%)]" />
      <div className="relative flex min-h-[520px] flex-col">
        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
          <span className="rounded-full bg-slate-800 px-3 py-1 text-amber-300">FEATURED</span>
          <span>{article.readingTime}</span>
        </div>

        <div className="mt-8 max-w-4xl space-y-4">
          <h3 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[0.95] tracking-tight text-white group-hover:text-amber-200 transition-colors">
            <Link href={href} className="focus:outline-none">
              {article.title}
            </Link>
          </h3>
          <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-slate-300">
            {getExcerpt(article)}
          </p>
        </div>

        <div className="flex-1" />

        <div className="mt-8 flex flex-col gap-4 border-t border-white/6 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <HomeAvatar article={article} className="h-10 w-10 rounded-full border border-white/10 object-cover" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-200">
                {article.authorDetails?.name || 'Observatory Scholar'}
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                National Legal Observatory
              </p>
            </div>
          </div>

          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 hover:-translate-y-0.5"
          >
            Read Article
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function SubmissionCard({ article }: { article: ArticleData }) {
  const href = getPublicationPath(article);

  return (
    <article className="group flex min-h-[170px] flex-col overflow-hidden rounded-[22px] border border-white/6 bg-[#242424] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400">
        <span className="rounded-full bg-slate-800 px-3 py-1 text-amber-300">
          {getBadgeLabel(article)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {article.readingTime}
        </span>
      </div>

      <h4 className="mt-5 max-w-2xl font-serif text-2xl sm:text-[28px] leading-tight font-bold tracking-tight text-white group-hover:text-amber-200 transition-colors">
        <Link href={href} className="focus:outline-none">
          {article.title}
        </Link>
      </h4>

      <div className="mt-auto border-t border-white/6 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <HomeAvatar article={article} className="h-6 w-6 rounded-full border border-white/10 object-cover" />
            <p className="truncate text-sm font-medium text-slate-400">
              {article.authorDetails?.name || 'Observatory Scholar'}
            </p>
          </div>

          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-semibold text-amber-300 transition hover:text-amber-200"
          >
            Read
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function ResearchDeskCard({ article }: { article: ArticleData }) {
  const href = getPublicationPath(article);

  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/6 bg-[#242424] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(211,172,43,0.05),transparent_35%)]" />
      <div className="relative flex min-h-[380px] flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.34em] text-emerald-300">
            Published Research
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-500">
            Research Article
          </span>
        </div>

        <div className="mt-10 max-w-4xl space-y-4">
          <h3 className="font-serif text-4xl sm:text-5xl lg:text-[60px] font-bold leading-[0.94] tracking-tight text-white group-hover:text-emerald-200 transition-colors">
            <Link href={href} className="focus:outline-none">
              {article.title}
            </Link>
          </h3>
          <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-slate-300">
            {getExcerpt(article)}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-4 border-t border-white/6 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <HomeAvatar article={article} className="h-8 w-8 rounded-full border border-white/10 object-cover" />
            <div>
              <p className="text-sm font-semibold text-slate-200">
                {article.authorDetails?.name || 'Observatory Scholar'}
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                National Legal Observatory Research Desk
              </p>
            </div>
          </div>

          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/15"
          >
            Read Article
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function Homepage() {
  const articles = await getArticles();
  const articleBySlug = new Map(articles.map((article) => [article.slug, article]));

  const featuredArticle =
    articleBySlug.get('the-weaponization-of-human-rights') ?? articles[0] ?? null;
  const monthlyReviewArticle = articleBySlug.get('monthly-legal-review-june-2026') ?? null;
  const manufacturingConsentArticle = articleBySlug.get('manufacturing-consent') ?? null;
  const foundingEditorialArticle = articleBySlug.get('founding-editorial') ?? null;
  const researchDeskArticle =
    manufacturingConsentArticle ?? articles.find((article) => article.type === 'research') ?? featuredArticle;

  const recentArticles = [
    monthlyReviewArticle,
    manufacturingConsentArticle,
    foundingEditorialArticle,
  ].filter(Boolean) as ArticleData[];

  return (
    <div className="space-y-12 py-4 sm:py-6">
      <HeroSection />
      <EditorialDirective />

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[3.35rem] font-bold tracking-tight text-slate-900 dark:text-white">
            Current Publications
          </h1>
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 transition hover:text-indigo-500 dark:hover:text-indigo-300"
          >
            All Papers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.95fr)_minmax(360px,0.95fr)] items-start">
          {featuredArticle && <FeaturedPublicationCard article={featuredArticle} />}

          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-slate-500 dark:text-slate-500">
              Recent Submissions
            </p>
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <SubmissionCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[3.35rem] font-bold tracking-tight text-slate-900 dark:text-white">
            Research Desk
          </h2>
          <Link
            href="/publications?type=research"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 transition hover:text-indigo-500 dark:hover:text-indigo-300"
          >
            All Research
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {researchDeskArticle && <ResearchDeskCard article={researchDeskArticle} />}
      </section>
    </div>
  );
}
