'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Landmark, ArrowDown, CheckCircle2 } from 'lucide-react';

interface FoundersNoteOverlayProps {
  title: string;
  htmlContent: string;
}

export default function FoundersNoteOverlay({ title, htmlContent }: FoundersNoteOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const showParam = searchParams.get('show-founders-note');
    const hasAcceptedSession = sessionStorage.getItem('founders-note-accepted');

    // Show overlay if forced by URL parameter or if not already accepted in this session
    if (showParam === 'true' || !hasAcceptedSession) {
      setIsVisible(true);
      // Reset read status if forced view
      setHasRead(false);
    }
  }, [searchParams]);

  // Fallback check: in case content is short or doesn't overflow, let them skip or auto-read
  useEffect(() => {
    if (!isVisible) return;

    const checkOverflow = () => {
      const el = scrollContainerRef.current;
      if (el) {
        // If content height is less than or equal to container height, they don't need to scroll
        if (el.scrollHeight <= el.clientHeight) {
          setHasRead(true);
        }
      }
    };

    // Delay slightly to allow content to render
    const timer = setTimeout(checkOverflow, 200);
    return () => clearTimeout(timer);
  }, [isVisible]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    // Check if scrolled within 24px of the bottom
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (isAtBottom) {
      setHasRead(true);
    }
  };

  const handleContinue = () => {
    sessionStorage.setItem('founders-note-accepted', 'true');
    setIsVisible(false);

    // Clean URL query parameter if present to prevent re-opening on manual refresh
    if (searchParams.get('show-founders-note') === 'true') {
      router.replace('/');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3 shrink-0">
          <div className="p-2 bg-indigo-600 text-white rounded">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Founding Directive & Observations
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Please scroll through the Founder's Note to enter the repository.
            </p>
          </div>
        </div>

        {/* Scrollable Note Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="p-6 overflow-y-auto max-h-[60vh] leading-relaxed font-sans text-xs sm:text-sm text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-950/40"
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">
              {title}
            </h3>
            {/* Inject parsed html content */}
            <div 
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
              className="space-y-4"
            />
          </div>
        </div>

        {/* Modal Footer Control Panel */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          {/* Progress tip indicator */}
          <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center">
            {hasRead ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center font-semibold">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Note fully read. Entry unlocked.
              </span>
            ) : (
              <span className="flex items-center">
                <ArrowDown className="w-4 h-4 mr-1 animate-bounce" />
                Scroll down to read the note...
              </span>
            )}
          </div>

          {/* Continue button */}
          <button
            onClick={handleContinue}
            disabled={!hasRead}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-bold transition shadow-sm select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40
              /* Light Mode Button Styling: BLACK background */
              bg-black hover:bg-slate-900 text-white disabled:bg-slate-200 disabled:text-slate-500 
              /* Dark Mode Button Styling: LIGHT BLUE background */
              dark:bg-sky-400 dark:hover:bg-sky-300 dark:text-slate-950 dark:disabled:bg-slate-850 dark:disabled:text-slate-600`}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}
