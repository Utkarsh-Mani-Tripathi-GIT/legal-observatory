'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, Quote } from 'lucide-react';
import { ArticleData } from '../lib/markdown';
import { motion } from 'framer-motion';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: ArticleData;
}

export default function CitationModal({ isOpen, onClose, article }: CitationModalProps) {
  const [activeTab, setActiveTab] = useState<'bluebook' | 'mla' | 'apa'>('bluebook');
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Generate citation formats dynamically
  const authorName = article.authorDetails?.name || 'Jenkins, Sarah';
  
  // Format Author parts for MLA and APA
  const getAuthorParts = () => {
    const parts = authorName.split(' ');
    const lastName = parts[parts.length - 1] || '';
    const firstName = parts[0] || '';
    return { lastName, firstName };
  };

  const { lastName, firstName } = getAuthorParts();
  const year = new Date(article.date).getFullYear();
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const citations = {
    bluebook: article.citation || `${authorName}, ${article.title}, 4 National Legal Observatory Journal 112 (${year}).`,
    mla: `${lastName}, ${firstName}. "${article.title}." National Legal Observatory Platform, ${formattedDate}.`,
    apa: `${lastName}, ${firstName.charAt(0)}. (${year}, ${new Date(article.date).toLocaleString('en', { month: 'long' })}). ${article.title}. National Legal Observatory Journal.`,
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citations[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { opacity: 1, backdropFilter: 'blur(2px)' },
    exit: { opacity: 0, backdropFilter: 'blur(0px)' },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 12 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 28,
        mass: 0.85,
        delay: 0.08,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      y: 8,
      transition: { duration: 0.18, ease: 'easeInOut' as const },
    },
  };

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80"
    >
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        variants={modalVariants}
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden focus:outline-none glass-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <Quote className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
              Cite this Publication
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-6">
          {(['bluebook', 'mla', 'apa'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCopied(false);
                }}
                className={`relative py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors -mb-px outline-none ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab === 'bluebook' ? 'Bluebook Style' : tab.toUpperCase()}
                {isActive && (
                  <motion.div
                    layoutId="activeCitationTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 dark:bg-indigo-400"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Citation text box */}
        <div className="p-6 space-y-4">
          <div className="relative p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
            <p className="text-sm font-mono leading-relaxed text-slate-800 dark:text-slate-200 select-all pr-8">
              {citations[activeTab]}
            </p>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm transition"
              title="Copy citation"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-[11px] text-slate-400 leading-normal flex items-start space-x-1.5 bg-blue-50/50 dark:bg-indigo-950/20 p-2.5 rounded border border-blue-100/30 dark:border-indigo-900/30">
            <span>&bull;</span>
            <span>
              This citation is generated automatically using standard styles. Verify against your publisher&apos;s guidelines or import directly into your Zotero/Mendeley citation managers.
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
