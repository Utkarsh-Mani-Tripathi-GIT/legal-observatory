'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PillNavProps {
  sections: { id: string; label: string }[];
}

export default function PillNav({ sections }: PillNavProps) {
  const [active, setActive] = useState(sections[0].id);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show nav after scrolling down a bit
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Update active section based on scroll position
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const current = sectionElements.findIndex(el => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        // If the top of the section is near the top of the viewport
        return rect.top <= 250 && rect.bottom >= 250;
      });

      if (current !== -1) {
        setActive(sections[current].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-28 left-1/2 -translate-x-1/2 z-[100] flex p-1.5 bg-[#f5f0eb]/80 backdrop-blur-md rounded-full border border-[rgba(125,25,25,0.15)] shadow-xl cursor-target"
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                const el = document.getElementById(s.id);
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors ${
                active === s.id ? 'text-[#efebe8]' : 'text-[#7d1919] hover:bg-[rgba(125,25,25,0.06)]'
              }`}
            >
              {active === s.id && (
                <motion.div
                  layoutId="pill-active"
                  className="absolute inset-0 bg-[#7d1919] rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              {s.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
