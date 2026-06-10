'use client';

import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Select all H2 and H3 elements inside the article body
    const articleContainer = document.querySelector('article.prose');
    if (!articleContainer) return;

    const headingElements = articleContainer.querySelectorAll('h2, h3');
    const headingList: HeadingItem[] = [];

    headingElements.forEach((el) => {
      const text = el.textContent || '';
      const level = parseInt(el.tagName.replace('H', ''), 10);
      
      // Auto-assign ID if missing (in case renderer missed it)
      if (!el.id) {
        el.id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/[\s_]+/g, '-');
      }

      headingList.push({
        id: el.id,
        text,
        level,
      });
    });

    setHeadings(headingList);

    // IntersectionObserver to track scroll state
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -70% 0px', // Trigger when heading is near the top of viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    headingElements.forEach((el) => observer.observe(el));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const offset = 90; // Accounting for sticky header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      
      // Set hash and active state
      window.history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-4">
      <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2">
        <List className="w-4 h-4 text-indigo-500" />
        <h4 className="text-xs font-bold uppercase tracking-wider">
          Table of Contents
        </h4>
      </div>
      <ul className="space-y-2 text-xs">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: heading.level === 3 ? '12px' : '0px' }}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleScrollTo(e, heading.id)}
              className={`block py-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all leading-normal ${
                activeId === heading.id
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-l-2 border-indigo-600 dark:border-indigo-400 pl-2 -ml-[2px]'
                  : 'text-slate-500 dark:text-slate-400 pl-2'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
