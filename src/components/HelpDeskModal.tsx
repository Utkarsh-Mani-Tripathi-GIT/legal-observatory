'use client';

import React, { useEffect, useRef } from 'react';
import { X, Scale, Wrench } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const NLO_EMAIL = 'nationallegalobservatory@gmail.com';
const TECH_EMAIL = 'utkarshisbest69@gmail.com';

interface HelpDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Context — passed in when opened from an article page
  articleTitle?: string;
  articleAuthorEmail?: string;
  articleAuthorName?: string;
}

export default function HelpDeskModal({
  isOpen,
  onClose,
  articleTitle,
  articleAuthorEmail,
  articleAuthorName,
}: HelpDeskModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const articleContext = articleTitle
    ? `Re: "${articleTitle}"`
    : 'General Enquiry';

  // Legal query → NLO + article author (if available)
  const legalTo = articleAuthorEmail
    ? `${NLO_EMAIL},${articleAuthorEmail}`
    : NLO_EMAIL;

  const legalSubject = encodeURIComponent(
    `[Legal Enquiry] ${articleContext} | National Legal Observatory`
  );
  const legalBody = encodeURIComponent(
    `Dear ${articleAuthorName ? articleAuthorName + ' and the ' : ''}NLO Editorial Team,\n\n` +
    `I am writing regarding: ${articleContext}\n\n` +
    `[Please describe your legal query here]\n\n` +
    `---\nThis message was sent via the NLO Help Desk.`
  );

  // Technical query → Tech lead + NLO
  const techTo = `${TECH_EMAIL},${NLO_EMAIL}`;
  const techSubject = encodeURIComponent(
    `[Technical Support] ${articleContext} | National Legal Observatory`
  );
  const techBody = encodeURIComponent(
    `Dear NLO Technical Team,\n\n` +
    `I am writing regarding a technical issue on: ${articleContext}\n\n` +
    `[Please describe the issue here]\n\n` +
    `---\nThis message was sent via the NLO Help Desk.`
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            initial={{ scale: 0.95, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 12, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="font-serif text-base font-bold text-slate-900 dark:text-white">
                  Help Desk
                </h2>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  How can we help you?
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Article context badge */}
            {articleTitle && (
              <div className="px-5 pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Regarding
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-snug line-clamp-2">
                  {articleTitle}
                </p>
              </div>
            )}

            {/* Options */}
            <div className="p-5 space-y-3">
              {/* Legal Query */}
              <a
                href={`mailto:${legalTo}?subject=${legalSubject}&body=${legalBody}`}
                className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition group"
              >
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Legal Query
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    Questions about article content, citations, or legal matters.
                    {articleAuthorName
                      ? ` Goes to ${articleAuthorName} & NLO Editorial.`
                      : ' Goes to NLO Editorial.'}
                  </p>
                </div>
              </a>

              {/* Technical Support */}
              <a
                href={`mailto:${techTo}?subject=${techSubject}&body=${techBody}`}
                className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition group"
              >
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 shrink-0 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 transition">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Technical Support
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    Website issues, broken links, or platform problems.
                    Goes to NLO Tech & Editorial.
                  </p>
                </div>
              </a>
            </div>

            {/* Footer note */}
            <div className="px-5 pb-4">
              <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center leading-relaxed">
                Your email client will open with recipients, subject &amp; body pre-filled.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
