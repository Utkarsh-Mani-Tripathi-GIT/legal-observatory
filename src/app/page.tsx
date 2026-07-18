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
  const actionClass =
    'inline-flex items-center gap-2 border border-outline-variant bg-surface-container-lowest px-4 py-3 font-technical-ui text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant transition hover:border-oxblood hover:text-oxblood dark:border-primary/25 dark:bg-surface-container-low dark:text-on-background/70 dark:hover:border-primary dark:hover:text-primary';

  return (
    <section className="relative overflow-hidden border-b border-outline-variant/50 bg-[linear-gradient(180deg,rgba(255,249,235,0)_0%,rgba(244,238,219,0.74)_100%)] px-4 py-16 text-center dark:border-primary/15 dark:bg-[linear-gradient(180deg,rgba(15,17,21,0)_0%,rgba(21,24,30,0.9)_100%)] sm:px-8 sm:py-24">
      <div className="mx-auto flex min-h-[430px] max-w-[1120px] flex-col items-center justify-center">
        <span className="font-technical-ui text-[11px] font-bold uppercase tracking-[0.32em] text-oxblood dark:text-primary sm:text-xs">
          Independent Legal Research
        </span>

        <h1 className="mt-8 font-serif text-5xl font-bold leading-tight text-on-background dark:text-on-background sm:text-6xl lg:text-[72px]">
          National Legal Observatory
        </h1>

        <div className="mt-10 h-px w-24 bg-oxblood/25 dark:bg-primary/55" />

        <p className="mt-10 max-w-3xl font-serif text-xl italic leading-relaxed text-on-surface-variant dark:text-on-background/75 sm:text-3xl">
          {"“The National Legal Observatory is an attempt to address an observation gap.”"}
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link href="/publications" className={actionClass}>
            <BookOpen className="h-4 w-4" />
            Browse Papers
          </Link>
          <Link href="/publications?category=constitutional-law" className={actionClass}>
            <Scale className="h-4 w-4" />
            Constitutional Law
          </Link>
          <Link href="/publications?category=technology-law" className={actionClass}>
            <Laptop className="h-4 w-4" />
            Tech &amp; Policy
          </Link>
          <Link href="/authors" className={actionClass}>
            <Users className="h-4 w-4" />
            Authors
          </Link>
        </div>

        <div className="mt-4">
          <Link
            href="/contact"
            className={actionClass}
          >
            <Mail className="h-4 w-4" />
            Submit Research
          </Link>
        </div>
      </div>
    </section>
  );
}

function EditorialDirective() {
  return (
    <section className="mx-auto max-w-5xl border-4 border-double border-oxblood bg-surface-container-lowest/55 px-6 py-8 text-center dark:border-primary dark:bg-surface-container/80 sm:px-12 sm:py-12">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-oxblood/25 bg-oxblood/10 text-oxblood dark:border-primary/30 dark:bg-primary/10 dark:text-primary">
          <Landmark className="h-8 w-8" />
        </div>
        <div className="space-y-4">
          <h2 className="font-serif text-3xl font-bold text-on-background dark:text-on-background sm:text-5xl">
            Our Editorial Directive
          </h2>
          <p className="font-body-md text-base leading-8 text-on-surface-variant dark:text-on-background/75 sm:text-lg">
            Constitutional law, civil litigation, criminal justice, commercial and contract law, environmental law, labour law, family law, technology and policy; these are all territories this platform covers, with the same rigour and the same commitment to primary sources.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <span className="h-px w-12 bg-oxblood dark:bg-primary" />
            <span className="font-technical-ui text-[11px] font-bold uppercase tracking-[0.28em] text-oxblood dark:text-primary">
              Est. 2026
            </span>
            <span className="h-px w-12 bg-oxblood dark:bg-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedPublicationCard({ article }: { article: ArticleData }) {
  const href = getPublicationPath(article);
  const coverImage = article.coverImage || '/images/weaponization/cover.png';

  return (
    <article className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-12">
      <div className="group relative flex min-h-[430px] flex-col border border-outline-variant/45 bg-surface-container p-8 dark:border-primary/15 dark:bg-surface-container md:col-span-7 sm:p-12">
        <div className="absolute right-0 top-0 p-4">
          <span className="bg-oxblood px-3 py-1 font-technical-ui text-[11px] font-bold uppercase tracking-[0.16em] text-white dark:bg-primary dark:text-background">
            Featured Case
          </span>
        </div>

        <span className="mb-6 block font-technical-ui text-[11px] font-bold uppercase tracking-[0.22em] text-oxblood dark:text-primary">
          In-Depth Analysis
        </span>
        <h3 className="max-w-3xl font-serif text-4xl font-bold leading-tight text-on-background transition-colors group-hover:text-oxblood dark:text-on-background dark:group-hover:text-primary sm:text-5xl lg:text-[56px]">
          <Link href={href} className="focus:outline-none">
            {article.title}
          </Link>
        </h3>
        <p className="mt-6 max-w-3xl font-body-md text-base leading-8 text-on-surface-variant line-clamp-4 dark:text-on-background/70">
          {getExcerpt(article)}
        </p>

        <div className="mt-auto flex flex-col gap-5 border-t border-outline-variant/45 pt-6 dark:border-primary/15 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <HomeAvatar article={article} className="h-10 w-10 rounded-full border border-outline-variant object-cover grayscale dark:border-primary/25" />
            <div className="min-w-0">
              <p className="font-technical-ui text-xs font-bold uppercase tracking-[0.14em] text-on-background dark:text-on-background">
                {article.authorDetails?.name || 'Observatory Scholar'}
              </p>
              <p className="font-technical-ui text-[11px] text-on-surface-variant dark:text-on-background/50">
                {article.readingTime}
              </p>
            </div>
          </div>

          <Link
            href={href}
            className="inline-flex items-center gap-2 border-b border-oxblood pb-1 font-technical-ui text-[11px] font-bold uppercase tracking-[0.2em] text-oxblood transition-all hover:pb-2 dark:border-primary dark:text-primary"
          >
            Read Manuscript
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="min-h-[430px] border border-outline-variant/30 bg-surface-container-high dark:border-primary/15 dark:bg-surface-container-low md:col-span-5">
        <div
          className="h-full min-h-[430px] bg-cover bg-center grayscale contrast-125 opacity-90 transition-opacity hover:opacity-100 dark:opacity-45 dark:hover:opacity-70"
          style={{ backgroundImage: `url(${coverImage})` }}
          aria-label={article.title}
          role="img"
        />
      </div>
    </article>
  );
}

function SubmissionCard({ article }: { article: ArticleData }) {
  const href = getPublicationPath(article);

  return (
    <article className="group flex min-h-[190px] flex-col border-b-2 border-oxblood/10 bg-surface-container-low p-6 transition-colors hover:border-oxblood dark:border-primary/15 dark:bg-surface-container-low dark:hover:border-primary">
      <div className="flex items-center justify-between gap-3 font-technical-ui text-[11px] font-semibold uppercase tracking-[0.2em] text-oxblood dark:text-primary">
        <span>
          {getBadgeLabel(article)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {article.readingTime}
        </span>
      </div>

      <h4 className="mt-5 max-w-2xl font-serif text-2xl font-semibold leading-tight text-on-background transition-colors group-hover:text-oxblood dark:text-on-background dark:group-hover:text-primary">
        <Link href={href} className="focus:outline-none">
          {article.title}
        </Link>
      </h4>

      <div className="mt-auto border-t border-outline-variant/35 pt-5 dark:border-primary/15">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <HomeAvatar article={article} className="h-7 w-7 rounded-full border border-outline-variant object-cover grayscale dark:border-primary/25" />
            <p className="truncate font-technical-ui text-xs font-medium text-on-surface-variant dark:text-on-background/55">
              {article.authorDetails?.name || 'Observatory Scholar'}
            </p>
          </div>

          <Link
            href={href}
            className="inline-flex items-center gap-1 font-technical-ui text-xs font-bold uppercase tracking-[0.16em] text-oxblood transition hover:text-on-background dark:text-primary dark:hover:text-on-background"
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
    <article className="group relative overflow-hidden border border-outline-variant/40 bg-surface-container-lowest p-6 dark:border-primary/15 dark:bg-surface-container sm:p-8">
      <div className="relative flex min-h-[360px] flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 border border-emerald-600/25 bg-emerald-700/10 px-3 py-1 font-technical-ui text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-800 dark:text-emerald-300">
            Published Research
          </span>
          <span className="font-technical-ui text-[10px] font-semibold uppercase tracking-[0.24em] text-on-surface-variant dark:text-on-background/45">
            Research Article
          </span>
        </div>

        <div className="mt-10 max-w-4xl space-y-4">
          <h3 className="font-serif text-4xl font-bold leading-tight text-on-background transition-colors group-hover:text-oxblood dark:text-on-background dark:group-hover:text-primary sm:text-5xl lg:text-[60px]">
            <Link href={href} className="focus:outline-none">
              {article.title}
            </Link>
          </h3>
          <p className="max-w-3xl font-body-md text-base leading-8 text-on-surface-variant dark:text-on-background/70 sm:text-lg">
            {getExcerpt(article)}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-4 border-t border-outline-variant/35 pt-6 dark:border-primary/15 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <HomeAvatar article={article} className="h-8 w-8 rounded-full border border-outline-variant object-cover grayscale dark:border-primary/25" />
            <div>
              <p className="font-technical-ui text-xs font-semibold uppercase tracking-[0.14em] text-on-background dark:text-on-background">
                {article.authorDetails?.name || 'Observatory Scholar'}
              </p>
              <p className="font-technical-ui text-[10px] uppercase tracking-[0.24em] text-on-surface-variant dark:text-on-background/45">
                National Legal Observatory Research Desk
              </p>
            </div>
          </div>

          <Link
            href={href}
            className="inline-flex items-center gap-2 border border-oxblood bg-oxblood px-4 py-2.5 font-technical-ui text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-on-background dark:border-primary dark:bg-primary dark:text-background dark:hover:bg-tertiary-fixed"
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
    <div className="mx-auto max-w-[1120px] space-y-20 py-2 sm:py-6">
      <HeroSection />
      <EditorialDirective />

      <section className="space-y-8">
        <div className="flex items-end justify-between gap-4 border-b border-outline-variant/50 pb-4 dark:border-primary/20">
          <h1 className="font-serif text-3xl font-semibold text-on-background dark:text-on-background sm:text-4xl lg:text-5xl">
            Current Publications
          </h1>
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 font-technical-ui text-xs font-bold uppercase tracking-[0.18em] text-oxblood transition hover:text-on-background dark:text-primary dark:hover:text-on-background"
          >
            All Papers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.95fr)_minmax(360px,0.95fr)] items-start">
          {featuredArticle && <FeaturedPublicationCard article={featuredArticle} />}

          <div className="space-y-4">
            <p className="font-technical-ui text-xs font-bold uppercase tracking-[0.28em] text-on-surface-variant dark:text-on-background/45">
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

      <section className="space-y-8">
        <div className="flex items-end justify-between gap-4 border-b border-outline-variant/50 pb-4 dark:border-primary/20">
          <h2 className="font-serif text-3xl font-semibold text-on-background dark:text-on-background sm:text-4xl lg:text-5xl">
            Research Desk
          </h2>
          <Link
            href="/publications?type=research"
            className="inline-flex items-center gap-2 font-technical-ui text-xs font-bold uppercase tracking-[0.18em] text-oxblood transition hover:text-on-background dark:text-primary dark:hover:text-on-background"
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
