'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, FileText, Users, Info, Mail } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '/', icon: Home, color: 'text-indigo-600 dark:text-indigo-400' },
  { id: 'publications', label: 'Publications', href: '/publications', icon: FileText, color: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'authors', label: 'Contributors', href: '/authors', icon: Users, color: 'text-violet-600 dark:text-violet-400' },
  { id: 'about', label: 'About', href: '/about', icon: Info, color: 'text-sky-600 dark:text-sky-400' },
  { id: 'contact', label: 'Contact', href: '/contact', icon: Mail, color: 'text-rose-600 dark:text-rose-400' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [jumping, setJumping] = useState<string | null>(null);
  const [active, setActive] = useState<string>('home');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Determine active route based on pathname
    const currentItem = NAV_ITEMS.find((item) => {
      if (item.href === '/') return pathname === '/';
      return pathname.startsWith(item.href);
    });
    if (currentItem && !jumping) {
      setActive(currentItem.id);
    }
  }, [pathname, jumping]);

  useEffect(() => {
    // Hide nav on scroll down, show on scroll up
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleTabClick = (item: typeof NAV_ITEMS[0]) => {
    if (active === item.id) {
      // scroll to top if already active
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setJumping(item.id);
    // Prefetch and push manually so we can handle the animation timing smoothly
    router.push(item.href);
  };

  const activeItem = NAV_ITEMS.find((it) => it.id === active);
  
  // Create a very subtle tinted background for the nav based on active tab
  const getTint = (id: string) => {
    switch(id) {
      case 'home': return 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-200/50 dark:border-indigo-800/50';
      case 'publications': return 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200/50 dark:border-emerald-800/50';
      case 'authors': return 'bg-violet-50/90 dark:bg-violet-950/40 border-violet-200/50 dark:border-violet-800/50';
      case 'about': return 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-200/50 dark:border-sky-800/50';
      case 'contact': return 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200/50 dark:border-rose-800/50';
      default: return 'bg-white/90 dark:bg-slate-950/90 border-slate-200/50 dark:border-slate-800/50';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="md:hidden fixed bottom-6 left-6 right-6 z-50 pointer-events-none"
        >
          <motion.nav 
            className={`pointer-events-auto mx-auto max-w-[360px] flex items-center justify-around px-2 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border transition-colors duration-500 ${getTint(active)}`}
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              const isJumping = jumping === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item)}
                  className="relative flex-1 flex flex-col items-center justify-center p-2.5 rounded-xl tap-highlight-transparent focus:outline-none"
                >
                  <motion.span
                    animate={isJumping 
                      ? { y: [0, -32, 0], rotate: [0, 360], scale: [1, 1.2, 1] } 
                      : {}}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    onAnimationComplete={() => {
                      if (isJumping) {
                        setJumping(null);
                        setActive(item.id);
                      }
                    }}
                    className="relative z-10"
                  >
                    <Icon 
                      className={`w-[22px] h-[22px] transition-colors duration-300 ${
                        isActive || isJumping 
                          ? item.color 
                          : 'text-slate-400 dark:text-slate-500'
                      }`} 
                      strokeWidth={isActive || isJumping ? 2.5 : 2}
                    />
                  </motion.span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="mobile-nav-pill"
                      className="absolute inset-0 rounded-xl bg-white/70 dark:bg-white/10 shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
