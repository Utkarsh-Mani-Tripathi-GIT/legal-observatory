'use client';

import React, { useState } from 'react';
import { Quote, Copy } from 'lucide-react';
import { ArticleData } from '../../../../lib/markdown';
import CitationModal from '../../../../components/CitationModal';
import { AnimatePresence } from 'framer-motion';

export default function CiteSection({ article }: { article: ArticleData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultCitation = article.citation || `${article.authorDetails?.name || 'Jenkins, Sarah'}, ${article.title}, 4 National Legal Observatory Journal 112 (${new Date(article.date).getFullYear()}).`;

  return (
    <>
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl space-y-3 glass-card">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2">
          <Quote className="w-4 h-4 text-indigo-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Citation Index
          </h4>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-2 border-slate-200 dark:border-slate-800 pl-3 pt-1">

          {defaultCitation}
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-2 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 transition flex items-center justify-center space-x-1.5"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Generate Citations</span>
        </button>
      </div>

      {/* Citation Generator Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <CitationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            article={article}
          />
        )}
      </AnimatePresence>
    </>
  );
}
