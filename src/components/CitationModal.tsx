'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, Quote } from 'lucide-react';
import { ArticleData } from '../lib/markdown';

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
    bluebook: article.citation || `${authorName}, ${article.title}, 4 Legal Observatory Journal 112 (${year}).`,
    mla: `${lastName}, ${firstName}. "${article.title}." Legal Observatory Platform, ${formattedDate}.`,
    apa: `${lastName}, ${firstName.charAt(0)}. (${year}, ${new Date(article.date).toLocaleString('en', { month: 'long' })}). ${article.title}. Legal Observatory Journal.`,
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus modal container
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
      <div
        ref={modalRef}
        tabIndex={-1}
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden focus:outline-none animate-in fade-in zoom-in-95 duration-200"
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
          {(['bluebook', 'mla', 'apa'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCopied(false);
              }}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab === 'bluebook' ? 'Bluebook Style' : tab.toUpperCase()}
            </button>
          ))}
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
              This citation is generated automatically using standard styles. Verify against your publisher's guidelines or import directly into your Zotero/Mendelay citation managers.
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
      </div>
    </div>
  );
}
