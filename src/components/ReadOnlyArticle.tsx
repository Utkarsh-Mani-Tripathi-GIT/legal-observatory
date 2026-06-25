'use client';

import React from 'react';

interface ReadOnlyArticleProps {
  slug: string;
  children: React.ReactNode;
}

const READ_ONLY_SLUG = 'propaganda-patriarchy-democracy';

export default function ReadOnlyArticle({ slug, children }: ReadOnlyArticleProps) {
  const isProtected = slug === READ_ONLY_SLUG;

  const handleCopy = (event: React.ClipboardEvent<HTMLDivElement>) => {
    if (isProtected) {
      event.preventDefault();
    }
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isProtected) {
      event.preventDefault();
    }
  };

  return (
    <div
      className={isProtected ? 'relative' : undefined}
      onCopy={handleCopy}
      onCut={handleCopy}
      onContextMenu={handleContextMenu}
      style={
        isProtected
          ? {
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              userSelect: 'none',
            }
          : undefined
      }
    >
      {children}
      {isProtected && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(211,172,43,0.1) 1px, transparent 1px), linear-gradient(225deg, rgba(211,172,43,0.1) 1px, transparent 1px), radial-gradient(circle, rgba(211,172,43,0.03) 1px, transparent 20px)',
            backgroundSize: '18px 18px, 18px 18px, 120px 120px',
            opacity: 0.85,
            mixBlendMode: 'multiply',
          }}
        />
      )}
      {isProtected && (
        <div
          className="pointer-events-none absolute inset-0 flex flex-wrap items-center justify-center opacity-20"
          style={{ zIndex: 1 }}
        >
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={index}
              className="text-[10px] font-bold tracking-[0.26em] text-slate-900 dark:text-slate-100"
              style={{
                transform: `rotate(-45deg) translate(${(index % 6) * 40}px, ${(Math.floor(index / 6) - 2) * 40}px)`,
                whiteSpace: 'nowrap',
              }}
            >
              BHOOMIJA PORTFOLIO ONLY
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
