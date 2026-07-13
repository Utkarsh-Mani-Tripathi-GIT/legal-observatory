'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Search, X, BookOpen, AlertCircle, FileText, Compass, Pin, Sparkles, Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface SearchResult {
  slug: string;
  type: string;
  format?: 'monthly-report' | 'post' | 'blog';
  title: string;
  date: string;
  authorName: string;
  category: string;
  excerpt?: string;
}

interface SearchScope {
  site: string;
  searchedFields: string[];
  matched: {
    publications: number;
    authorProfiles: number;
    bibliographies?: number;
    webPages?: number;
  };
  bibliographySources?: string[];
  profileSources?: string[];
  webSources?: string[];
  summary: string;
}

interface AiCitationSource {
  articleSlug: string;
  articleTitle: string;
  reference: string;
  url?: string;
  host?: string;
  kind?: 'bibliography';
  authorName?: string;
}

interface AiWebSource {
  url: string;
  host: string;
  title: string;
  description: string;
  sourceReference: string;
}

interface AiProfileSource {
  slug: string;
  name: string;
  role: string;
  bio: string;
  excerpt: string;
}

interface AiSourcePack {
  nloArticles: SearchResult[];
  profiles: AiProfileSource[];
  citations: AiCitationSource[];
  webPages: AiWebSource[];
}

interface AiAnswerBlock {
  label?: string;
  text: string;
}

function normalizeAiResponse(text: string) {
  return text
    .replace(/\r/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/^\s*(answer|response|summary)\s*:\s*/i, '')
    .replace(/\n{3,}/g, '\n\n')
  .replace(/[ \t]+\n/g, '\n')
  .trim();
}

function parseAiResponseBlocks(text: string): AiAnswerBlock[] {
  const lines = normalizeAiResponse(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: AiAnswerBlock[] = [];
  let currentBlock: AiAnswerBlock | null = null;

  for (const line of lines) {
    const match = line.match(/^(NLO|PROFILE|BIB|CITATION|WEB|NOTE)\s*[:\-–]\s*(.+)$/i);
    if (match?.[2]) {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      currentBlock = {
        label: match[1]?.toUpperCase(),
        text: match[2].trim(),
      };
      continue;
    }

    if (!currentBlock) {
      currentBlock = { text: line };
    } else {
      currentBlock.text = `${currentBlock.text} ${line}`.trim();
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks;
}

function getAnswerBlockTone(label?: string) {
  switch (label) {
    case 'NLO':
      return 'border-amber-200/70 dark:border-amber-700/30 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200';
    case 'PROFILE':
      return 'border-violet-200/70 dark:border-violet-800/30 bg-violet-50/50 dark:bg-violet-950/20 text-violet-800 dark:text-violet-200';
    case 'BIB':
    case 'CITATION':
      return 'border-sky-200/70 dark:border-sky-800/30 bg-sky-50/50 dark:bg-sky-950/20 text-sky-800 dark:text-sky-200';
    case 'WEB':
      return 'border-emerald-200/70 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-200';
    case 'NOTE':
      return 'border-slate-200/70 dark:border-slate-700/30 bg-slate-50/70 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300';
    default:
      return 'border-slate-200/70 dark:border-slate-700/30 bg-white/60 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300';
  }
}

function formatSearchResultDate(result: SearchResult): string {
  const date = new Date(result.date);
  if (Number.isNaN(date.getTime())) {
    return result.date;
  }

  const monthYearOnly =
    result.format === 'monthly-report' || result.slug === 'founding-editorial';

  return date.toLocaleDateString('en-US', monthYearOnly
    ? {
        year: 'numeric',
        month: 'long',
      }
    : {
        year: 'numeric',
        month: 'short',
      day: 'numeric',
      });
}

function formatCompactList(items: string[] = [], limit = 3) {
  return items.slice(0, limit).join(' · ');
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
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiScope, setAiScope] = useState<SearchScope | null>(null);
  const [aiSources, setAiSources] = useState<AiSourcePack | null>(null);
  const [showSources, setShowSources] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiRateLimitSeconds, setAiRateLimitSeconds] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isAiMode, setIsAiMode] = useState(false);
  const latestQueryRef = useRef('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (aiRateLimitSeconds > 0) {
      timer = setInterval(() => {
        setAiRateLimitSeconds((prev) => {
          if (prev <= 1) {
             setErrorMsg(null);
             return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [aiRateLimitSeconds]);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isBhoomijaPage = pathname === '/bhoomija';
  
  // Theme styling overrides
  const iconColor = isBhoomijaPage ? 'text-[#7d1919]' : 'text-indigo-500';
  const categoryTextColor = isBhoomijaPage ? 'text-[#7d1919]' : 'text-indigo-600 dark:text-indigo-400';
  const highlightBorder = isBhoomijaPage ? 'border-[#7d1919]' : 'border-indigo-600';
  const activeBg = isBhoomijaPage ? 'bg-[#f5f0eb]' : 'bg-indigo-50 dark:bg-slate-800/80';
  const highlightText = isBhoomijaPage ? 'text-[#5c1212]' : 'text-indigo-950 dark:text-white';
  const spinnerBorder = isBhoomijaPage ? 'border-[#7d1919]' : 'border-indigo-600';
  const backdropBg = isBhoomijaPage ? 'bg-slate-900/60 dark:bg-black/80' : 'bg-slate-900/60 dark:bg-black/80';
  const modalBg = isBhoomijaPage ? 'bg-[#f5f0eb]' : 'bg-white dark:bg-slate-900';
  const modalBorder = isBhoomijaPage ? 'border-[#7d1919]/30' : 'border-slate-200 dark:border-slate-800';
  const inputBorder = isBhoomijaPage ? 'border-[#7d1919]/20' : 'border-slate-100 dark:border-slate-800';
  const inputText = isBhoomijaPage ? 'text-[#5c1212] placeholder-[#7d1919]/50' : 'text-slate-900 dark:text-white placeholder-slate-400';
  const closeBtnHover = isBhoomijaPage ? 'hover:bg-[#7d1919]/10 hover:text-[#7d1919]' : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600';
  const quickSearchBg = isBhoomijaPage ? 'hover:bg-[#7d1919]/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800';
  const quickSearchText = isBhoomijaPage ? 'text-[#7d1919]' : 'text-slate-400';
  const resultHover = isBhoomijaPage ? 'hover:bg-[#7d1919]/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50';
  const footerBg = isBhoomijaPage ? 'bg-[#efebe8]' : 'bg-slate-50 dark:bg-slate-800/30';
  const footerText = isBhoomijaPage ? 'text-[#7d1919]/70' : 'text-slate-400';
  const kbdBorder = isBhoomijaPage ? 'border-[#7d1919]/30 bg-[#f5f0eb]' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800';

  const performSearch = async (
    searchQuery: string,
    includeAi: boolean,
    signal?: AbortSignal
  ) => {
    if (includeAi) {
      setIsAiLoading(true);
    } else {
      setIsLoading(true);
    }

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}${includeAi ? '&ai=1' : ''}`,
        signal ? { signal } : undefined
      );
      const data = await res.json().catch(() => ({}));

      if (includeAi) {
        if (res.ok) {
          if (latestQueryRef.current !== searchQuery) {
            return;
          }
          setResults(data.results || []);
          setAiResponse(data.aiResponse || null);
          setAiScope(data.scope || null);
          setAiSources(data.sources || null);
          setShowSources(false);
          setErrorMsg(data.aiError || null);
          setSelectedIndex(-1);
        } else if (res.status === 429) {
          setErrorMsg(data.error || 'AI search limit reached.');
          setAiResponse(null);
          setAiScope(data.scope || null);
          setAiSources(data.sources || null);
          setShowSources(false);
          if (data.remaining) {
            setAiRateLimitSeconds(data.remaining);
          }
        } else {
          setErrorMsg(data.aiError || data.error || 'AI search failed.');
          setAiResponse(null);
          setAiScope(data.scope || null);
          setAiSources(data.sources || null);
          setShowSources(false);
        }
        return;
      }

      if (res.ok) {
        if (latestQueryRef.current !== searchQuery) {
          return;
        }
        setResults(data.results || []);
        setSelectedIndex(-1);
        setAiScope(null);
        setAiSources(null);
        setShowSources(false);
        setErrorMsg(null);
      } else {
        setResults([]);
        setAiResponse(null);
        setAiScope(null);
        setAiSources(null);
        setShowSources(false);
        setErrorMsg(data.error || 'An error occurred during search.');
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }

      console.error('Search error:', err);
      setErrorMsg(includeAi ? 'Failed to connect to the AI search service.' : 'Failed to connect to the search service.');
    } finally {
      if (includeAi) {
        setIsAiLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  };

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

  useEffect(() => {
    const trimmedQuery = query.trim();
    latestQueryRef.current = trimmedQuery;
    const controller = new AbortController();

    if (trimmedQuery.length < 2) {
      const clearTimer = window.setTimeout(() => {
        setResults([]);
        setAiResponse(null);
        setAiScope(null);
        setAiSources(null);
        setShowSources(false);
        setErrorMsg(null);
        setSelectedIndex(-1);
        setIsLoading(false);
      }, 0);

      return () => {
        clearTimeout(clearTimer);
        controller.abort();
      };
    }

    const delayDebounce = window.setTimeout(() => {
      if (!isAiMode) {
        setAiResponse(null);
        setAiScope(null);
        setAiSources(null);
        setShowSources(false);
      }
      setSelectedIndex(-1);
      void performSearch(trimmedQuery, isAiMode, controller.signal);
    }, isAiMode ? 750 : 250);

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [query, isAiMode]);

  const toggleAiMode = async () => {
    if (isAiLoading || aiRateLimitSeconds > 0) return;
    const newMode = !isAiMode;
    setIsAiMode(newMode);
    
    const trimmedQuery = query.trim();
    latestQueryRef.current = trimmedQuery;

    if (newMode && trimmedQuery.length >= 2) {
      setAiScope(null);
      setAiSources(null);
      setShowSources(false);
      await performSearch(trimmedQuery, true);
    } else if (!newMode && trimmedQuery.length >= 2) {
      setAiResponse(null);
      setAiScope(null);
      setAiSources(null);
      setShowSources(false);
      await performSearch(trimmedQuery, false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      void toggleAiMode();
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

  const visibleResults = query.trim().length < 2 ? [] : results;

  const handleSelect = (result: SearchResult) => {
    router.push(getArticleUrl(result));
    onClose();
    setQuery('');
    setAiResponse(null);
    setAiScope(null);
    setAiSources(null);
    setShowSources(false);
    setErrorMsg(null);
  };

  const handleJumpToMention = (e: React.MouseEvent, result: SearchResult) => {
    e.stopPropagation();
    router.push(getArticleUrl(result, true));
    onClose();
    setQuery('');
    setAiResponse(null);
    setAiScope(null);
    setAiSources(null);
    setShowSources(false);
    setErrorMsg(null);
  };

  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { opacity: 1, backdropFilter: 'blur(2px)' },
    exit: { opacity: 0, backdropFilter: 'blur(0px)' },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.985 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 380,
        damping: 30,
        mass: 0.8,
      },
    },
    exit: {
      opacity: 0,
      y: -12,
      scale: 0.99,
      transition: { duration: 0.18, ease: 'easeInOut' as const },
    },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 350, damping: 25 },
    },
  };

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 ${backdropBg}`}
    >
      <motion.div
        variants={modalVariants}
        className={`w-full max-w-2xl ${modalBg} border ${modalBorder} rounded-xl shadow-2xl overflow-hidden glass-panel`}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className={`flex items-center px-4 py-3 border-b ${inputBorder}`}>
          <Search className={`w-5 h-5 ${isBhoomijaPage ? 'text-[#7d1919]/60' : 'text-slate-400'} mr-3 shrink-0`} />
          <input
            ref={inputRef}
            type="text"
            className={`w-full bg-transparent ${inputText} focus:outline-none text-base`}
            placeholder={isBhoomijaPage ? "Search Bhoomija's publications, drafts, and research..." : "Search judgments, policies, research, tags, authors..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="ml-3 flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] hidden sm:inline-flex font-medium items-center gap-1 transition-colors ${
                isAiMode
                  ? isBhoomijaPage ? 'text-[#7d1919]' : 'text-emerald-500 dark:text-emerald-400'
                  : 'text-slate-400'
              }`}>
                {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                AI Search
              </span>
              <span className={`text-[11px] sm:hidden inline-flex font-medium items-center gap-1 transition-colors ${
                isAiMode
                  ? isBhoomijaPage ? 'text-[#7d1919]' : 'text-emerald-500 dark:text-emerald-400'
                  : 'text-slate-400'
              }`}>
                {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                AI
              </span>
              
              <button
                onClick={() => void toggleAiMode()}
                disabled={isAiLoading || aiRateLimitSeconds > 0}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                  isAiMode 
                    ? isBhoomijaPage ? 'bg-[#7d1919]' : 'bg-[#34c759]'
                    : 'bg-[#e5e5ea] dark:bg-[#39393d]'
                }`}
                title="Toggle AI Search Mode (Ctrl/Cmd+Enter)"
              >
                <span className="sr-only">Toggle AI Search</span>
                
                {/* ON icon (vertical line) */}
                <span className={`absolute left-[6px] flex h-full items-center justify-center transition-opacity duration-200 ${isAiMode ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="h-2 w-[1.5px] rounded-sm bg-white" />
                </span>

                {/* OFF icon (circle outline) */}
                <span className={`absolute right-[5px] flex h-full items-center justify-center transition-opacity duration-200 ${isAiMode ? 'opacity-0' : 'opacity-100'}`}>
                  <div className="h-[9px] w-[9px] rounded-full border-[1.5px] border-[#8e8e93] dark:border-[#98989d]" />
                </span>

                {/* Thumb */}
                <span className={`pointer-events-none inline-flex h-4 w-4 transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] ring-0 transition duration-200 ease-in-out ${isAiMode ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
              </button>
            </div>
            {aiRateLimitSeconds > 0 && (
              <span className="text-[11px] font-medium text-red-500 whitespace-nowrap animate-pulse">
                Wait {aiRateLimitSeconds}s
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-md transition ${closeBtnHover}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[28rem] overflow-y-auto p-2">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-8 text-slate-400 space-x-2"
            >
              <div className={`w-5 h-5 border-2 ${spinnerBorder} border-t-transparent rounded-full animate-spin`}></div>
              <span className="text-sm font-medium">Searching the observatory archive...</span>
            </motion.div>
          )}

          {!isLoading && query.trim().length > 0 && results.length === 0 && !errorMsg && !aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 text-slate-400"
            >
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No site pages, profiles, or verified bibliography match your query.</p>
              <p className="text-xs mt-1">Try searching constitutional law, privacy, climate change, or an article title.</p>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 mb-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium mx-2"
            >
              <AlertCircle className="w-5 h-5 inline mr-2" />
              {errorMsg}
            </motion.div>
          )}

          {aiResponse && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-4 mb-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl mx-2"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                    Answer
                  </span>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    Priority: site content · profiles · verified bibliography · web previews
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {parseAiResponseBlocks(aiResponse).map((block, index) => (
                  <div
                    key={`${block.label || 'answer'}-${index}`}
                    className={`rounded-xl border px-3 py-3 ${getAnswerBlockTone(block.label)}`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                        block.label === 'NLO'
                          ? 'border-amber-300/60 bg-amber-100/80 text-amber-800 dark:border-amber-700/40 dark:bg-amber-950/50 dark:text-amber-200'
                          : block.label === 'PROFILE'
                            ? 'border-violet-300/60 bg-violet-100/80 text-violet-800 dark:border-violet-700/40 dark:bg-violet-950/50 dark:text-violet-200'
                            : block.label === 'BIB' || block.label === 'CITATION'
                            ? 'border-sky-300/60 bg-sky-100/80 text-sky-800 dark:border-sky-700/40 dark:bg-sky-950/50 dark:text-sky-200'
                            : block.label === 'WEB'
                              ? 'border-emerald-300/60 bg-emerald-100/80 text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-950/50 dark:text-emerald-200'
                              : block.label === 'NOTE'
                                ? 'border-slate-300/60 bg-slate-100/80 text-slate-700 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300'
                                : 'border-slate-300/60 bg-white/80 text-slate-700 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300'
                      }`}>
                        {block.label || 'Answer'}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {block.text}
                    </p>
                  </div>
                ))}
              </div>

              {aiScope && aiSources && (
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/50 dark:bg-slate-950/20 px-3 py-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                        Scope used
                      </p>
                      <button
                        onClick={() => setShowSources((prev) => !prev)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] transition ${
                          isBhoomijaPage
                            ? 'border-[#7d1919]/20 bg-[#f5f0eb] text-[#7d1919] hover:bg-[#7d1919]/10'
                            : 'border-amber-200/60 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-700/30 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-900/40'
                        }`}
                      >
                        {showSources ? 'Hide Details' : 'Show Details'}
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {aiScope.site}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      {aiScope.summary}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      Searched: {aiScope.searchedFields.join(' · ')}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      Profiles: {formatCompactList(aiScope.profileSources) || 'none'}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      Bibliography: {formatCompactList(aiScope.bibliographySources) || 'none'}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      Web: {formatCompactList(aiScope.webSources) || 'none'}
                    </p>
                    <div className="space-y-2">
                      {aiSources.profiles.slice(0, 2).map((profile) => (
                        <div key={`visible-profile-${profile.slug}`} className="rounded-lg border border-violet-200/70 dark:border-violet-700/30 bg-violet-50/60 dark:bg-violet-950/20 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-700 dark:text-violet-300">
                            Profile
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {profile.name}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                            {profile.role}
                          </p>
                        </div>
                      ))}
                      {aiSources.nloArticles.slice(0, 2).map((article) => (
                        <div key={`visible-nlo-${article.slug}-${article.date}`} className="rounded-lg border border-amber-200/70 dark:border-amber-700/30 bg-amber-50/60 dark:bg-amber-950/20 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">
                            NLO
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {article.title}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                            {article.authorName} · {article.category} · {formatSearchResultDate(article)}
                          </p>
                        </div>
                      ))}
                      {aiSources.citations.slice(0, 2).map((citation) => (
                        <div key={`visible-citation-${citation.articleSlug}-${citation.reference}`} className="rounded-lg border border-sky-200/70 dark:border-sky-700/30 bg-sky-50/60 dark:bg-sky-950/20 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
                            BIB
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {citation.articleTitle}
                          </p>
                          <p className="mt-1 text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">
                            {citation.reference}
                          </p>
                        </div>
                      ))}
                      {aiSources.webPages.slice(0, 2).map((page) => (
                        <div key={`visible-web-${page.url}-${page.sourceReference}`} className="rounded-lg border border-emerald-200/70 dark:border-emerald-700/30 bg-emerald-50/60 dark:bg-emerald-950/20 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
                            Web
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {page.title}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                            {page.host}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {showSources && (
                    <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/50 dark:bg-slate-950/20 px-3 py-3 space-y-4">
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                          Scope Details
                        </p>
                        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                          Matches: {aiScope.matched.publications} publication{aiScope.matched.publications === 1 ? '' : 's'}, {aiScope.matched.authorProfiles} author profile{aiScope.matched.authorProfiles === 1 ? '' : 's'}
                          {typeof aiScope.matched.bibliographies === 'number' && (
                            <>
                              , {aiScope.matched.bibliographies} verified bibliography entr{aiScope.matched.bibliographies === 1 ? 'y' : 'ies'}
                            </>
                          )}
                          {typeof aiScope.matched.webPages === 'number' && (
                            <>
                              , {aiScope.matched.webPages} cited page{aiScope.matched.webPages === 1 ? '' : 's'}
                            </>
                          )}
                        </p>
                      </div>

                      {aiSources.profiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">
                            Profiles
                          </p>
                          <div className="space-y-2">
                            {aiSources.profiles.map((profile) => (
                              <div key={profile.slug} className="rounded-lg border border-violet-200/70 dark:border-violet-700/30 bg-violet-50/60 dark:bg-violet-950/20 px-3 py-2">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                  {profile.name}
                                </p>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                  {profile.role}
                                </p>
                                <p className="mt-2 text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">
                                  {profile.excerpt || profile.bio || 'No bio available.'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {aiSources.nloArticles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-300">
                            NLO
                          </p>
                          <div className="space-y-2">
                            {aiSources.nloArticles.map((article) => (
                              <div key={`${article.slug}-${article.date}`} className="rounded-lg border border-amber-200/70 dark:border-amber-700/30 bg-amber-50/60 dark:bg-amber-950/20 px-3 py-2">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                  {article.title}
                                </p>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                  {article.authorName} · {article.category} · {formatSearchResultDate(article)}
                                </p>
                                <p className="mt-2 text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">
                                  {article.excerpt || 'No excerpt available.'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {aiSources.citations.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">
                            Verified Bibliography
                          </p>
                          <div className="space-y-2">
                            {aiSources.citations.map((citation) => (
                              <div key={`${citation.articleSlug}-${citation.reference}`} className="rounded-lg border border-sky-200/70 dark:border-sky-700/30 bg-sky-50/60 dark:bg-sky-950/20 px-3 py-2">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                  {citation.articleTitle}
                                </p>
                                <p className="mt-1 text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">
                                  {citation.reference}
                                </p>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                  {citation.kind || 'bibliography'}{citation.authorName ? ` · ${citation.authorName}` : ''}{citation.host ? ` · ${citation.host}` : ''}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {aiSources.webPages.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">
                            Web Results
                          </p>
                          <div className="space-y-2">
                            {aiSources.webPages.map((page) => (
                              <div key={`${page.url}-${page.sourceReference}`} className="rounded-lg border border-emerald-200/70 dark:border-emerald-700/30 bg-emerald-50/60 dark:bg-emerald-950/20 px-3 py-2">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                  {page.title}
                                </p>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                  {page.host}
                                </p>
                                <p className="mt-2 text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">
                                  {page.description}
                                </p>
                                <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                  Source: {page.sourceReference}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {!isLoading && query.trim().length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`py-4 px-3 ${quickSearchText}`}
            >
              <span className={`text-xs font-semibold uppercase tracking-wider block mb-2 ${isBhoomijaPage ? 'text-[#7d1919]/80' : 'text-slate-500'}`}>Quick Searches</span>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {isBhoomijaPage ? (
                  <>
                    <button onClick={() => setQuery('Founding')} className={`flex items-center p-2 rounded-lg ${quickSearchBg} text-left transition-colors duration-150`}>
                      <Compass className={`w-4 h-4 ${iconColor} mr-2`} /> Founding Note
                    </button>
                    <button onClick={() => setQuery('Consent')} className={`flex items-center p-2 rounded-lg ${quickSearchBg} text-left transition-colors duration-150`}>
                      <FileText className={`w-4 h-4 ${iconColor} mr-2`} /> Manufacturing Consent
                    </button>
                    <button onClick={() => setQuery('Drafting')} className={`flex items-center p-2 rounded-lg ${quickSearchBg} text-left transition-colors duration-150`}>
                      <BookOpen className={`w-4 h-4 ${iconColor} mr-2`} /> Drafting Portfolio
                    </button>
                    <button onClick={() => setQuery('Constitutional')} className={`flex items-center p-2 rounded-lg ${quickSearchBg} text-left transition-colors duration-150`}>
                      <FileText className={`w-4 h-4 ${iconColor} mr-2`} /> Constitutional Law
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setQuery('Constitutional')} className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors duration-150">
                      <Compass className="w-4 h-4 text-indigo-500 mr-2" /> Constitutional Law
                    </button>
                    <button onClick={() => setQuery('Surveillance')} className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors duration-150">
                      <FileText className="w-4 h-4 text-indigo-500 mr-2" /> Surveillance
                    </button>
                    <button onClick={() => setQuery('Climate')} className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors duration-150">
                      <BookOpen className="w-4 h-4 text-indigo-500 mr-2" /> Climate Litigation
                    </button>
                    <button onClick={() => setQuery('Digital Services')} className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors duration-150">
                      <FileText className="w-4 h-4 text-indigo-500 mr-2" /> Platform Regulations
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {!isLoading && visibleResults.length > 0 && (
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="space-y-1"
            >
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Publications found ({isBhoomijaPage ? visibleResults.filter(r => r.authorName.toLowerCase().includes('bhoomija')).length : visibleResults.length})
              </div>
              {(isBhoomijaPage ? visibleResults.filter(r => r.authorName.toLowerCase().includes('bhoomija')) : visibleResults).map((result, idx) => (
                <motion.div
                  key={result.slug}
                  variants={itemVariants}
                  className={`rounded-lg transition duration-150 ${
                    idx === selectedIndex
                      ? `${activeBg} border-l-4 ${highlightBorder}`
                      : resultHover
                  }`}
                >
                  {/* Main article row */}
                  <button
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center justify-between p-4 sm:p-3 text-left min-h-[60px]"
                  >
                    <div className="min-w-0 flex-1">
                      <span className={`text-xs uppercase tracking-wider font-semibold ${categoryTextColor}`}>
                        {result.type} &bull; {result.category}
                      </span>
                      <h4 className={`text-[15px] sm:text-sm font-semibold truncate leading-snug mt-1 sm:mt-0.5 ${
                        idx === selectedIndex ? highlightText : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {result.title}
                      </h4>
                      <span className="text-[13px] sm:text-xs text-slate-500 dark:text-slate-500 mt-1 sm:mt-0 block sm:inline">
                        By {result.authorName} &bull; {formatSearchResultDate(result)}
                      </span>
                    </div>
                    <BookOpen className="w-5 h-5 sm:w-4 sm:h-4 text-slate-400 opacity-60 ml-3 shrink-0" />
                  </button>

                  {/* Jump to mention button — only shows when there's a search query */}
                  {query.trim().length >= 2 && (
                    <div className="px-4 sm:px-3 pb-3 sm:pb-2.5">
                      <button
                        onClick={(e) => handleJumpToMention(e, result)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-2.5 sm:py-1 rounded-md text-xs sm:text-[11px] font-semibold
                          bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400
                          border border-amber-200/60 dark:border-amber-700/30
                          hover:bg-amber-100 dark:hover:bg-amber-900/40
                          transition-all duration-150 group min-h-[44px] sm:min-h-0"
                        title={`Jump to first mention of "${query}" in this article`}
                      >
                        <Pin className="w-3 h-3 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform" />
                        Jump to &ldquo;{query.trim().length > 20 ? query.trim().slice(0, 20) + '…' : query.trim()}&rdquo; in article →
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-4 py-2 border-t ${inputBorder} ${footerBg} flex justify-between text-xs ${footerText}`}>
          <span>Use <kbd className={`px-1 border ${kbdBorder} rounded`}>↑↓</kbd> to navigate</span>
          <span>Press <kbd className={`px-1 border ${kbdBorder} rounded`}>Esc</kbd> to close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
