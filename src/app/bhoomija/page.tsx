import React from 'react';
import Link from 'next/link';
import { getAuthorBySlug, getArticles } from '../../lib/content';
import { Landmark, Mail, Globe, BookOpen, GraduationCap, ChevronRight, FileText } from 'lucide-react';
import ArticleCard from '../../components/ArticleCard';

export const metadata = {
  title: 'Bhoomija Khanna | Founder & Research Director',
  description: 'Founder & Research Director of the National Legal Observatory. Portfolio, academic publications, and research focus.',
};

export default async function FounderPortfolioPage() {
  const author = await getAuthorBySlug('bhoomija-khanna');
  if (!author) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Author Profile Not Found</h1>
        <p className="text-sm text-slate-500 mt-2">Please run the seeder script to populate database records.</p>
      </div>
    );
  }

  // Get articles written by Bhoomija
  const allArticles = await getArticles();
  const authorArticles = allArticles.filter((art) => art.author === 'bhoomija-khanna');

  return (
    <div className="space-y-16 py-4 max-w-5xl mx-auto">
      {/* 1. Header Hero Panel */}
      <section className="relative p-8 md:p-12 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(211,172,43,0.06),transparent)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(211,172,43,0.1),transparent)]" />
        
        {/* Avatar */}
        <div className="relative group shrink-0">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-md group-hover:scale-102 transition duration-300"
          />
        </div>

        {/* Details */}
        <div className="space-y-4 flex-grow relative z-10">
          <div className="space-y-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
              Founder & Director
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              {author.name}
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Alliance University Bengaluru – 562 106, Karnataka, India
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-3xl">
            Bhoomija Khanna is a dedicated legal researcher and scholar focusing on constitutional interpretation, public policy, majoritarian political systems, and technology governance. She founded the National Legal Observatory to bridge the primary-source observation gap in Indian jurisprudence.
          </p>

          {/* Social Links */}
          <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4 text-xs">
            <a
              href="mailto:bhoomija.k2810@gmail.com"
              className="flex items-center px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <Mail className="w-4 h-4 mr-2 text-indigo-500" />
              <span>bhoomija.k2810@gmail.com</span>
            </a>
            <a
              href="https://linkedin.com/in/bhoomija-khanna-268995368"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <svg className="w-4 h-4 fill-current text-indigo-500 mr-2" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn Profile</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Grid Area: Education & Focus / Featured Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Education & Focus */}
        <div className="lg:col-span-1 space-y-8">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl space-y-6">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <GraduationCap className="w-5 h-5 mr-2 text-indigo-500" />
              Academic Credentials
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1 relative pl-5 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-indigo-500 before:rounded-full">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">B.A. LL.B. (Hons.)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Alliance University Bengaluru – 562 106, Karnataka, India</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">2024 – Present (Second-Year Student)</p>
              </div>
              <div className="space-y-1 relative pl-5 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-slate-300 dark:before:bg-slate-700 before:rounded-full">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Constitutional Focus</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Researching public liberties, caste stratification, and surveillance governance.</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <Landmark className="w-5 h-5 mr-2 text-indigo-500" />
              Observatory Vision
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              "The platform aims to examine shifts in jurisprudence and legislative frameworks without a partisan bias, making original texts and primary sources accessible to scholars, students, and citizens."
            </p>
          </div>
        </div>

        {/* Right Column: Selected Projects (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white flex items-center">
            Selected Research Projects
          </h2>
          
          <div className="space-y-4">
            {/* Project 1: Legal Observatory */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl relative group">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Active Core Initiative</span>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    The National Legal Observatory
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    An independent research platform dedicated to tracking and observing India's constitutional law, digital surveillance policies, and judicial updates with rigorous, primary-source analysis.
                  </p>
                </div>
                <Link
                  href="/?show-founders-note=true"
                  className="p-2 bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-slate-800/80 rounded-lg text-slate-400 group-hover:text-indigo-600 transition duration-300 shrink-0"
                  title="Launch Project & View Note"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Project 2: Digital Surveillance */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Academic Thesis</span>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                  Digital Surveillance & Right to Privacy Research
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  An academic inquiry examining the constitutional validity of the Digital Personal Data Protection (DPDP) Act and its impact on civil liberties and executive overreach in India.
                </p>
              </div>
            </div>

            {/* Project 3: Legal Aid */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Clinical Advocacy</span>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                  Alliance University Legal Aid Clinic
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Participating in grassroots community outreach campaigns to provide basic legal literacy, rights guidance, and constitutional education to rural populations around Bengaluru.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Publications Section */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-900 pb-2 flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-indigo-500" />
          Publications in this Repository ({authorArticles.length})
        </h2>

        {authorArticles.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl text-slate-400 text-sm">
            No papers have been seeded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authorArticles.map((art) => (
              <ArticleCard key={art.slug} article={art} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
