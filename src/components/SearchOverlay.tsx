'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Search, X, BookOpen, AlertCircle, FileText, Compass, Pin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  slug: string;
  type: string;
  title: string;
  date: string;
  authorName: string;
  category: string;
}

export default function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
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

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setSelectedIndex(-1);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  const getArticleUrl = (result: SearchResult, withHighlight = false) => {
    const typeMapping: Record<string, string> = {
      judgment: 'judgments',
      policy: 'policies',
      research: 'research',
      opinion: 'opinions',
    };
    const folder = typeMapping[result.type] || 'research';
    const base = `/publications/${folder}/${result.slug}`;
    return withHighlight && query.trim() ? `${base}?highlight=${encodeURIComponent(query.trim())}` : base;
  };

  const handleSelect = (result: SearchResult) => {
    router.push(getArticleUrl(result));
    onClose();
    setQuery('');
  };

  const handleJumpToMention = (e: React.MouseEvent, result: SearchResult) => {
    e.stopPropagation();
    router.push(getArticleUrl(result, true));
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base"
            placeholder="Search judgments, policies, research, tags, authors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[28rem] overflow-y-auto p-2">
          {isLoading && (
            <div className="flex items-center justify-center py-8 text-slate-400 space-x-2">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Searching the observatory archive...</span>
            </div>
          )}

          {!isLoading && query.trim().length > 0 && results.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No publications match your query.</p>
              <p className="text-xs mt-1">Try searching constitutional law, privacy, or climate change.</p>
            </div>
          )}

          {!isLoading && query.trim().length === 0 && (
            <div className="py-4 px-3 text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider block mb-2 text-slate-500">Quick Searches</span>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <button onClick={() => setQuery('Constitutional')} className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition">
                  <Compass className="w-4 h-4 text-indigo-500 mr-2" /> Constitutional Law
                </button>
                <button onClick={() => setQuery('Surveillance')} className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition">
                  <FileText className="w-4 h-4 text-indigo-500 mr-2" /> Surveillance
                </button>
                <button onClick={() => setQuery('Climate')} className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition">
                  <BookOpen className="w-4 h-4 text-indigo-500 mr-2" /> Climate Litigation
                </button>
                <button onClick={() => setQuery('Digital Services')} className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition">
                  <FileText className="w-4 h-4 text-indigo-500 mr-2" /> Platform Regulations
                </button>
              </div>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Publications found ({results.length})
              </div>
              {results.map((result, idx) => (
                <div
                  key={result.slug}
                  className={`rounded-lg transition duration-150 ${
                    idx === selectedIndex
                      ? 'bg-indigo-50 dark:bg-slate-800/80 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {/* Main article row */}
                  <button
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center justify-between p-3 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400">
                        {result.type} &bull; {result.category}
                      </span>
                      <h4 className={`text-sm font-semibold truncate leading-snug mt-0.5 ${
                        idx === selectedIndex ? 'text-indigo-950 dark:text-white' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {result.title}
                      </h4>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        By {result.authorName} &bull; {new Date(result.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <BookOpen className="w-4 h-4 text-slate-400 opacity-60 ml-3 shrink-0" />
                  </button>

                  {/* Jump to mention button — only shows when there's a search query */}
                  {query.trim().length >= 2 && (
                    <div className="px-3 pb-2.5">
                      <button
                        onClick={(e) => handleJumpToMention(e, result)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold
                          bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400
                          border border-amber-200/60 dark:border-amber-700/30
                          hover:bg-amber-100 dark:hover:bg-amber-900/40
                          transition-all duration-150 group"
                        title={`Jump to first mention of "${query}" in this article`}
                      >
                        <Pin className="w-3 h-3 group-hover:scale-110 transition-transform" />
                        Jump to &ldquo;{query.trim().length > 20 ? query.trim().slice(0, 20) + '…' : query.trim()}&rdquo; in article →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex justify-between text-xs text-slate-400">
          <span>Use <kbd className="px-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded">↑↓</kbd> to navigate</span>
          <span>Press <kbd className="px-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
