'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BookOpen, ArrowUpRight, Calendar, User } from 'lucide-react';

interface PublishedArticle {
  title: string;
  slug: string;
  category: string;
  publisher: string;
  publication: string;
  readingTime: string;
  abstract: string;
  href: string;
}

interface UpcomingResearchTeaserProps {
  /** ISO timestamp string for publication time */
  publishAt: string;
  /** Published article metadata to show after countdown ends */
  article: PublishedArticle;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function CountdownDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50 px-3 py-2 min-w-[52px]">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="block text-center font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500 mt-1.5">
        {label}
      </span>
    </div>
  );
}

export default function UpcomingResearchTeaser({ publishAt, article }: UpcomingResearchTeaserProps) {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const diff = new Date(publishAt).getTime() - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, total: 0 };
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      total: diff,
    };
  }, [publishAt]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    // Check immediately
    const initial = calculateTimeLeft();
    setTimeLeft(initial);
    if (initial.total <= 0) {
      setIsPublished(true);
      return;
    }

    const timer = setInterval(() => {
      const tl = calculateTimeLeft();
      setTimeLeft(tl);
      if (tl.total <= 0) {
        setIsPublished(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <AnimatePresence mode="wait">
      {!isPublished ? (
        /* ── Teaser Card ─────────────────────────────────────── */
        <motion.div
          key="teaser"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="relative p-8 rounded-2xl border-[1.5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden group"
        >
          {/* Subtle ambient glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-100/40 dark:bg-indigo-950/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-amber-50/30 dark:bg-amber-950/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative space-y-6">
            {/* Label */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-700/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse-dot" />
                Upcoming Research
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Something is Cooking…
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                Our next research publication is almost ready.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed max-w-md">
                A new National Legal Observatory research article will be published shortly.
              </p>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-3">
              <CountdownDigit value={timeLeft.hours} label="Hours" />
              <span className="text-xl font-bold text-slate-300 dark:text-slate-600 -mt-5">:</span>
              <CountdownDigit value={timeLeft.minutes} label="Minutes" />
              <span className="text-xl font-bold text-slate-300 dark:text-slate-600 -mt-5">:</span>
              <CountdownDigit value={timeLeft.seconds} label="Seconds" />
            </div>

            {/* Meta footer */}
            <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> June 2026
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Research Article
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" /> NLO Research Desk
              </span>
            </div>
          </div>
        </motion.div>
      ) : (
        /* ── Published Article Card ──────────────────────────── */
        <motion.div
          key="published"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative p-8 rounded-2xl border-[1.5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="space-y-5">
            {/* Labels */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-700/30">
                Published Research
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              <Link href={article.href} className="focus:outline-none">
                {article.title}
              </Link>
            </h3>

            {/* Abstract */}
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
              {article.abstract}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" /> {article.publisher}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {article.publication}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {article.readingTime}
                </span>
              </div>

              <Link
                href={article.href}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-0.5 group-hover:underline"
              >
                Read Research Article <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
