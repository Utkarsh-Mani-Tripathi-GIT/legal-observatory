'use client';

import React, { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrolled = (window.scrollY / docHeight) * 100;
        setProgress(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2.5px] z-50 pointer-events-none bg-slate-100/10">
      <div
        className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-75 ease-out origin-left"
        style={{
          width: `${progress}%`,
          boxShadow: '0 1px 3px rgba(211, 172, 43, 0.3)',
        }}
      />
    </div>
  );
}
