import React from 'react';
import Link from 'next/link';
import { Shield, Cpu, ArrowRight } from 'lucide-react';
import AuthorLink from '../../components/AuthorLink';
import Avatar from '../../components/Avatar';

export const metadata = {
  title: 'Observatory Contributors',
  description: 'Meet the legal scholars and technology builders behind the National Legal Observatory.',
};

export default function AuthorsPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-16">
      
      {/* Page Header */}
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Observatory Contributors
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          The team powering the research, editorial standards, and digital infrastructure of the National Legal Observatory.
        </p>
      </header>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
        
        {/* Section 1: Legal / Editorial */}
        <section className="space-y-6 flex flex-col justify-between p-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-[#7d1919] dark:text-[#c94c4c]">
              <div className="p-2.5 bg-red-50 dark:bg-red-950/30 rounded-xl">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                Legal & Editorial
              </h2>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-b border-slate-100 dark:border-slate-850 pb-4">
              Directing academic inquiry, editing submissions, and ensuring all observations adhere to high constitutional scholarship.
            </p>

            {/* Bhoomija Card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-2">
              <Avatar
                src="/bhoomija-avatar.png"
                alt="Bhoomija Khanna"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-[3px] border-slate-100 dark:border-slate-800 shrink-0 shadow-sm"
              />
              <div className="space-y-2 text-center sm:text-left">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Bhoomija Khanna
                  </h3>
                  <p className="text-xs font-semibold text-[#7d1919] dark:text-[#c94c4c]">
                    Founder & Chief Editor
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Focuses on constitutional law, public policy, and civil rights. Curates the observatory&apos;s research frameworks and publications.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-850 flex justify-end">
            <Link
              href="/bhoomija"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#7d1919] hover:bg-[#5c1212] rounded-lg transition-colors shadow-sm"
            >
              View Profile & Publications <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Section 2: Technology */}
        <section className="space-y-6 flex flex-col justify-between p-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                Platform Technology
              </h2>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-b border-slate-100 dark:border-slate-850 pb-4">
              Building standard-setting automation tools, managing database infrastructure, and maintaining premium web experiences.
            </p>

            {/* Utkarsh Card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-2">
              <div
                aria-label="Utkarsh Mani Tripathi"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-slate-100 dark:border-slate-800 shrink-0 shadow-sm bg-slate-950 dark:bg-slate-950 flex items-center justify-center select-none"
              >
                <span className="text-4xl sm:text-5xl leading-none" role="img" aria-label="spider">🕷️</span>
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Utkarsh Mani Tripathi
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Full Stack Product Builder & Tech Lead
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  High-agency product builder entering 3rd year of CSE at GTB4CEC. Expert in database automation, voice production, and AI operations.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-850 flex justify-end">
            <AuthorLink
              slug="utkarsh-mani-tripathi"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-750 rounded-lg transition-colors shadow-sm"
            >
              View Profile & Publications <ArrowRight className="w-3.5 h-3.5" />
            </AuthorLink>
          </div>
        </section>

      </div>
    </div>
  );
}
