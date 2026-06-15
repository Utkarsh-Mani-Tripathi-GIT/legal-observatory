'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import SearchOverlay from './SearchOverlay';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Scroll tracking to trigger visual state shifts
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener for search (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Publications', href: '/publications' },
    { name: 'Authors', href: '/#contributors' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/50 dark:border-slate-800/50 shadow-md backdrop-blur-md py-3'
            : 'bg-white dark:bg-slate-950 border-b border-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo brand */}
          <Link href="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 dark:bg-[#1a1a1a] border border-yellow-500/40 dark:border-yellow-500/30 shadow-sm transition-transform group-hover:scale-105 shrink-0">
              <span className="font-serif font-black text-sm tracking-widest text-yellow-400 ml-[0.1em]">NLO</span>
            </div>
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors group-hover:text-yellow-500 dark:group-hover:text-yellow-400">
              NATIONAL LEGAL OBSERVATORY
            </span>
          </Link>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex space-x-8 items-center shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-1 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Expanded Search Bar — opens SearchOverlay on click */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex flex-1 max-w-sm items-center gap-3 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 text-sm group"
            title="Search (Cmd+K)"
          >
            <Search className="w-4 h-4 shrink-0 group-hover:text-indigo-500 transition-colors" />
            <span className="flex-1 text-left text-[13px]">Search the observatory archives...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </button>

          {/* Utility buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Mobile search icon (only visible on small screens) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-100 dark:border-slate-950 bg-white dark:bg-slate-950 animate-in slide-in-from-top duration-200">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-slate-100 text-indigo-600 dark:bg-slate-900 dark:text-indigo-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Global Search Component */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
