'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import SearchOverlay from './SearchOverlay';
import { motion, AnimatePresence } from 'framer-motion';

// Pink Flower and Pink Bow components for decorative menu toggle
const ThemeFlower = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="6.5" r="3.2" fill="#c97a7a" />
    <circle cx="12" cy="17.5" r="3.2" fill="#c97a7a" />
    <circle cx="6.5" cy="12" r="3.2" fill="#c97a7a" />
    <circle cx="17.5" cy="12" r="3.2" fill="#c97a7a" />
    <circle cx="8.1" cy="8.1" r="3.2" fill="#c97a7a" />
    <circle cx="15.9" cy="15.9" r="3.2" fill="#c97a7a" />
    <circle cx="8.1" cy="15.9" r="3.2" fill="#c97a7a" />
    <circle cx="15.9" cy="8.1" r="3.2" fill="#c97a7a" />
    <circle cx="12" cy="12" r="4.2" fill="#7d1919" />
    <circle cx="12" cy="12" r="1.8" fill="#fff5f5" />
  </svg>
);

const PinkBow = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 12C9 8 4.5 8.5 4.5 12C4.5 15.5 9 16 12 12Z" 
      fill="#f472b6" 
      stroke="#db2777" 
      strokeWidth="1.5"
    />
    <path 
      d="M10 12C8.5 10.5 6.5 10.75 6.5 12C6.5 13.25 8.5 13.5 10 12Z" 
      fill="#fdf2f8" 
    />
    <path 
      d="M12 12C15 8 19.5 8.5 19.5 12C19.5 15.5 15 16 12 12Z" 
      fill="#f472b6" 
      stroke="#db2777" 
      strokeWidth="1.5"
    />
    <path 
      d="M14 12C15.5 10.5 17.5 10.75 17.5 12C17.5 13.25 15.5 13.5 14 12Z" 
      fill="#fdf2f8" 
    />
    <path 
      d="M11 13C9.5 15.5 8 18.5 8.5 21C8.5 21 10 20 11.5 18C12 17.3 12.3 16 12 13Z" 
      fill="#db2777" 
    />
    <path 
      d="M13 13C14.5 15.5 16 18.5 15.5 21C15.5 21 14 20 12.5 18C12 17.3 11.7 16 12 13Z" 
      fill="#db2777" 
    />
    <rect x="10.5" y="10.5" width="3" height="3" rx="1.5" fill="#db2777" />
    <circle cx="12" cy="12" r="1" fill="#fdf2f8" />
  </svg>
);

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [jumping, setJumping] = useState<string | null>(null);
  
  const pathname = usePathname();
  const router = useRouter();
  const { toggleTheme } = useTheme();

  // Scroll tracking to trigger visual state shifts & auto-close menu
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      setIsProfileMenuOpen(false);
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
    { name: 'Contributors', href: '/authors' },
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
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo brand */}
          <Link
            href="/"
            className="flex items-center space-x-2.5 group shrink-0"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 dark:bg-[#1a1a1a] border border-yellow-500/40 dark:border-yellow-500/30 shadow-sm transition-transform group-hover:scale-105 shrink-0">
              <span className="font-serif font-black text-sm tracking-widest text-yellow-400 ml-[0.1em]">NLO</span>
            </div>
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors group-hover:text-yellow-500 dark:group-hover:text-yellow-400">
              NATIONAL LEGAL OBSERVATORY
            </span>
          </Link>


          {/* Desktop Navigation links */}
          <nav className="hidden md:flex space-x-1 items-center shrink-0">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const isJumping = jumping === link.name;
              
              return (
                <button
                  key={link.name}
                  onClick={(e) => {
                    e.preventDefault();
                    if (active) return;
                    setJumping(link.name);
                    router.push(link.href);
                  }}
                  className={`relative px-4 py-2 text-sm transition-colors rounded-full focus:outline-none ${
                    active || isJumping
                      ? 'text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <motion.span
                    animate={isJumping 
                      ? { y: [0, -12, 0], scale: [1, 1.1, 1] } 
                      : {}}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    onAnimationComplete={() => {
                      if (isJumping) setJumping(null);
                    }}
                    className="relative z-10 block"
                  >
                    {link.name}
                  </motion.span>
                  
                  {active && (
                    <motion.div 
                      layoutId="desktop-nav-pill"
                      className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Expanded Search Bar — opens SearchOverlay on click */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex flex-1 max-w-md items-center gap-3 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 text-sm group"
            title="Search or ask AI (Cmd+K)"
          >
            <Search className="w-4 h-4 shrink-0 group-hover:text-indigo-500 transition-colors" />
            <span className="flex-1 text-left text-[13px]">
              {pathname === '/bhoomija' ? 'Search about Bhoomija...' : 'Search the observatory archives...'}
            </span>
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
              title="Search or ask AI"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Light/Dark Toggle or Profile Nav Menu */}
            {pathname !== '/bhoomija' ? (
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                title="Toggle theme"
                aria-label="Toggle theme"
              >
                <Sun className="hidden w-5 h-5 dark:block" />
                <Moon className="w-5 h-5 dark:hidden" />
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors duration-200"
                  title="Profile Sections"
                >
                  <div className="w-16 h-16 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isProfileMenuOpen ? 'bow' : 'flower'}
                        initial={{ rotate: -180, scale: 0.7, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 180, scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                      >
                        {isProfileMenuOpen ? <PinkBow className="w-12 h-12" /> : <ThemeFlower className="w-12 h-12" />}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-2 z-50 overflow-hidden"
                    >
                      {[
                        { id: 'hero', label: 'Home' },
                        { id: 'about', label: 'About' },
                        { id: 'skills', label: 'Skills' },
                        { id: 'experience', label: 'Experience' },
                        { id: 'publications', label: 'Publications' }
                      ].map(section => (
                        <button
                          key={section.id}
                          onClick={() => {
                            if (section.id === 'skills') {
                              window.dispatchEvent(new Event('open-skills'));
                            }
                            const el = document.getElementById(section.id);
                            if (el) {
                              const y = el.getBoundingClientRect().top + window.scrollY - 100;
                              window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#7d1919] dark:hover:text-[#c97a7a] transition-colors"
                        >
                          {section.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* Global Search Component */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
