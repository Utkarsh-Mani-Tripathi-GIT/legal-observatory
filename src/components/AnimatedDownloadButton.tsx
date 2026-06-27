'use client';

import React, { useState } from 'react';
import { FileText, Download, Check } from 'lucide-react';

interface AnimatedDownloadButtonProps {
  href: string;
  label: string;
  fileType?: string;
}

export default function AnimatedDownloadButton({ href, label, fileType = 'PDF' }: AnimatedDownloadButtonProps) {
  const [state, setState] = useState<'idle' | 'downloading' | 'done'>('idle');

  const handleClick = () => {
    if (state !== 'idle') return;
    setState('downloading');

    // Trigger download via hidden link
    const link = document.createElement('a');
    link.href = href;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Animate through states
    setTimeout(() => {
      setState('done');
      setTimeout(() => setState('idle'), 2200);
    }, 1200);
  };

  return (
    <button
      onClick={handleClick}
      disabled={state !== 'idle'}
      className={`
        group/dl relative w-full flex items-center justify-center px-4 py-2.5
        rounded-lg text-xs font-bold transition-all duration-500 overflow-hidden
        ${state === 'idle'
          ? 'border border-indigo-500/30 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800 text-indigo-650 dark:text-indigo-400 cursor-pointer'
          : state === 'downloading'
          ? 'border border-indigo-500 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 cursor-wait'
          : 'border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
        }
      `}
    >
      {/* Progress bar overlay */}
      {state === 'downloading' && (
        <span className="absolute inset-0 bg-indigo-100/50 dark:bg-indigo-900/20 animate-download-progress origin-left" />
      )}

      {/* Icon states */}
      <span className="relative flex items-center gap-2">
        {state === 'idle' && (
          <>
            <FileText className="w-4 h-4 transition-transform duration-200 group-hover/dl:scale-110" />
            <span>{label}</span>
            <Download className="w-3 h-3 ml-0.5 opacity-0 group-hover/dl:opacity-100 transition-all duration-200 group-hover/dl:translate-y-0.5" />
          </>
        )}
        {state === 'downloading' && (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-20" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span>Preparing {fileType}…</span>
          </>
        )}
        {state === 'done' && (
          <>
            <Check className="w-4 h-4 animate-bounce-once" />
            <span>Downloaded!</span>
          </>
        )}
      </span>
    </button>
  );
}
