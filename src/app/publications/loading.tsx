import React from 'react';

export default function PublicationsLoading() {
  return (
    <div className="space-y-10 py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="space-y-3 max-w-lg">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg animate-skeleton" />
        <div className="h-1.5 w-16 bg-indigo-200 dark:bg-slate-800 rounded-full" />
        <div className="h-4 w-full bg-slate-150 dark:bg-slate-800/60 rounded-md animate-skeleton" />
      </div>

      {/* Main Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start pt-6">
        
        {/* Left Sidebar Skeleton: Formats & Hot Tags */}
        <aside className="space-y-6 lg:col-span-1">
          {/* Formats card */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl space-y-4 shadow-sm glass-card">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-skeleton" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-3.5 w-full bg-slate-150 dark:bg-slate-850 rounded animate-skeleton" />
              ))}
            </div>
          </div>

          {/* Hot Tags card */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl space-y-4 shadow-sm glass-card">
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-skeleton" />
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-5 w-12 bg-slate-150 dark:bg-slate-850 rounded-full animate-skeleton" />
              ))}
            </div>
          </div>
        </aside>

        {/* Center Catalogue Grid Skeleton (col-span-2) */}
        <section className="lg:col-span-2 space-y-6">
          {/* Toolbar */}
          <div className="h-12 w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl shadow-sm animate-skeleton glass-card" />

          {/* Article List Skeletons */}
          <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl shadow-sm space-y-6 glass-card"
              >
                {/* Meta details */}
                <div className="flex justify-between items-center">
                  <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-skeleton" />
                  <div className="h-4 w-12 bg-slate-150 dark:bg-slate-850 rounded animate-skeleton" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <div className="h-5 w-full bg-slate-200 dark:bg-slate-850 rounded animate-skeleton" />
                  <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-850 rounded animate-skeleton" />
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <div className="h-3 w-full bg-slate-150 dark:bg-slate-850 rounded animate-skeleton" />
                  <div className="h-3 w-full bg-slate-150 dark:bg-slate-850 rounded animate-skeleton" />
                </div>

                {/* Footer details */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-850 animate-skeleton" />
                    <div className="h-4 w-20 bg-slate-150 dark:bg-slate-850 rounded animate-skeleton" />
                  </div>
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-850 rounded animate-skeleton" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Sidebar Skeleton: Categories */}
        <aside className="space-y-6 lg:col-span-1">
          {/* Categories card */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl space-y-4 shadow-sm glass-card">
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-skeleton" />
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-3.5 w-full bg-slate-150 dark:bg-slate-850 rounded animate-skeleton" />
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
