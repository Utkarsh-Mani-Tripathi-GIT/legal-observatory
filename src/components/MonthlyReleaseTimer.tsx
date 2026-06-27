'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Bell, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface MonthlyReleaseTimerProps {
  targetHour?: number; // default 18 (6 PM)
  monthlyReviewArticle: {
    slug: string;
    title: string;
    type: string;
    readingTime: string;
    abstract?: string;
    tags: string[];
    authorDetails?: {
      name: string;
      role: string;
      avatar?: string;
    };
  };
}

function AnimatedDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center flex-1">
      <div className="relative w-full overflow-hidden rounded-xl bg-slate-800/80 border border-slate-700/60 py-2 sm:py-3 text-center backdrop-blur-sm shadow-inner">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -25, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 25, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="block font-mono text-2xl sm:text-3xl font-black text-indigo-400 tabular-nums"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1.5">
        {label}
      </span>
    </div>
  );
}

export default function MonthlyReleaseTimer({
  targetHour = 18,
  monthlyReviewArticle,
}: MonthlyReleaseTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isReleased, setIsReleased] = useState<boolean>(false);
  const [showEarlyAccess, setShowEarlyAccess] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoTimeOverride, setDemoTimeOverride] = useState<number | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(targetHour, 0, 0, 0);

      let diff = target.getTime() - now.getTime();

      if (demoTimeOverride !== null) {
        diff = demoTimeOverride;
      }

      if (diff <= 0) {
        setIsReleased(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setShowEarlyAccess(false);
        return;
      }

      setIsReleased(false);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });

      if (diff <= 5 * 60 * 1000) {
        setShowEarlyAccess(true);
      } else {
        setShowEarlyAccess(false);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetHour, demoTimeOverride]);

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribed(true);
      } else {
        setErrorMsg(data.message || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      console.error('Subscription error', err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden min-h-[380px] sm:min-h-[420px] flex">
      <AnimatePresence mode="wait">
        {isReleased ? (
          /* ── 6:00 PM SHARP: Smooth Framer-Motion Fade-In Article Card ── */
          <motion.div
            key="article-card"
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between p-5 sm:p-8 bg-white dark:bg-slate-900 border-2 border-indigo-500/40 dark:border-indigo-500/30 rounded-2xl shadow-xl hover:shadow-indigo-500/10 transition duration-300 relative group flex-grow w-full"
          >
            <div className="absolute -top-3 left-4 sm:left-6 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-md animate-bounce-once">
              <Sparkles className="w-3 h-3" /> Just Released • Vol. 1 Issue 1
            </div>

            <div>
              <div className="flex items-center space-x-3 text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-bold mb-4 mt-1">
                <span className="px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-slate-800 text-[10px]">
                  Monthly Review
                </span>
                <span>&bull;</span>
                <span>{monthlyReviewArticle.readingTime}</span>
              </div>

              <h3 className="font-serif text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <Link href={`/publications/research/${monthlyReviewArticle.slug}`}>
                  {monthlyReviewArticle.title}
                </Link>
              </h3>

              <p className="text-slate-500 dark:text-slate-400 mt-3 sm:mt-4 leading-relaxed text-xs sm:text-base line-clamp-3 sm:line-clamp-4">
                {monthlyReviewArticle.abstract}
              </p>

              <div className="flex flex-wrap gap-1 mt-4 sm:mt-6">
                {monthlyReviewArticle.tags.slice(0, 5).map((tag) => (
                  <span key={tag} className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                {monthlyReviewArticle.authorDetails?.avatar && (
                  <Link href="/bhoomija" className="shrink-0">
                    <img
                      src={monthlyReviewArticle.authorDetails.avatar}
                      alt={monthlyReviewArticle.authorDetails.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:scale-105 transition duration-200 cursor-pointer"
                    />
                  </Link>
                )}
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {monthlyReviewArticle.authorDetails?.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {monthlyReviewArticle.authorDetails?.role}
                  </p>
                </div>
              </div>

              <Link
                href={`/publications/research/${monthlyReviewArticle.slug}`}
                className="w-full sm:w-auto text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition shadow-md flex items-center justify-center gap-1.5"
              >
                Read Issue <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ) : (
          /* ── COUNTDOWN STATE: Sleek Framer-Motion Animated Digits & Access ── */
          <motion.div
            key="timer-card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative flex flex-col justify-between p-5 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-xl border border-indigo-500/30 overflow-hidden w-full"
          >
            {/* Background aesthetic glow */}
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Badge */}
            <div className="flex items-center justify-between z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Release Countdown
              </div>
            </div>

            {/* Center Content */}
            <div className="my-auto py-4 sm:py-6 text-center z-10 space-y-3 sm:space-y-4">
              <h3 className="font-serif text-xl sm:text-3xl font-extrabold tracking-tight text-white px-2">
                Monthly Legal Review • Issue 01
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed px-2">
                The inaugural issue covering Supreme Court AI Regulations, the Online Gaming Ruling, and Delimitation Battles drops at <strong className="text-indigo-300 font-bold">6:00 PM Today</strong>.
              </p>

              {/* Smooth Framer Motion Animated Clock Grid */}
              <div className="flex gap-2 sm:gap-3 max-w-[280px] sm:max-w-xs mx-auto pt-2">
                <AnimatedDigit value={timeLeft ? timeLeft.hours : 0} label="Hours" />
                <AnimatedDigit value={timeLeft ? timeLeft.minutes : 0} label="Minutes" />
                <AnimatedDigit value={timeLeft ? timeLeft.seconds : 0} label="Seconds" />
              </div>
            </div>

            {/* Bottom Option: Early Access Prompt (Shows at 5:55 PM / < 5 mins remaining) */}
            <div className="z-10 pt-3 sm:pt-4 border-t border-slate-800/80">
              <AnimatePresence mode="wait">
                {showEarlyAccess ? (
                  <motion.div
                    key="early-access-form"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.4 }}
                    className="bg-indigo-900/50 border border-indigo-500/40 p-3 sm:p-4 rounded-xl backdrop-blur-md space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                      <span className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" /> Early Access Unlocked (5:55 PM)
                      </span>
                      <span className="text-[10px] text-indigo-300">Instant email delivery at 6 PM</span>
                    </div>
                    {subscribed ? (
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold py-1">
                        <CheckCircle2 className="w-4 h-4 shrink-0" /> You&apos;re on the list! Access link will land in your inbox at 6:00 PM.
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <form onSubmit={handleSubscribe} noValidate className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="email"
                            placeholder="Enter email for instant 6 PM access..."
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errorMsg) setErrorMsg('');
                            }}
                            className={`bg-slate-950/80 border px-3 py-2 sm:py-1.5 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none flex-grow transition-colors ${
                              errorMsg ? 'border-rose-500/80 focus:border-rose-400' : 'border-slate-700 focus:border-indigo-400'
                            }`}
                          />
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-4 py-2 sm:py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition shrink-0 shadow-sm"
                          >
                            {loading ? 'Subscribing...' : 'Get Access'}
                          </button>
                        </form>
                        {errorMsg && (
                          <p className="text-[11px] text-rose-400 font-medium pl-1 animate-fade-in">
                            ⚠️ {errorMsg}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="early-access-teaser"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <p className="text-[10px] sm:text-[11px] text-slate-400 flex items-center justify-center gap-2">
                      <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded bg-slate-900 border border-yellow-500/40 text-[8px] sm:text-[9px] font-serif font-black text-yellow-400 shrink-0 shadow-sm">
                        NLO
                      </span>
                      <span>Early access signup opens automatically at 5:55 PM.</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
