import React from 'react';
import Link from 'next/link';
import { getAuthorBySlug, getArticles } from '../../lib/content';
import { Landmark, Mail, BookOpen, GraduationCap, ChevronRight, FileText, FileCheck, Award, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import ArticleCard from '../../components/ArticleCard';

export const metadata = {
  title: 'Bhoomija Khanna | Founder & Research Director',
  description: 'Academic portfolio, legal drafting credentials, and research projects of Bhoomija Khanna.',
};

export default async function FounderPortfolioPage() {
  const author = await getAuthorBySlug('bhoomija-khanna');
  if (!author) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Author Profile Not Found</h1>
        <p className="text-sm text-slate-500 mt-2">Please verify that content files are correctly placed.</p>
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(211,172,43,0.05),transparent)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(211,172,43,0.08),transparent)]" />
        
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-slate-850 text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
              National Legal Observatory Founder & Research Director
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {author.name}
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 font-serif">
              Alliance University Bengaluru – 562 106, Karnataka, India
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4 text-xs font-semibold">
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
            <a
              href="/Bhoomija_Khanna_CV.docx"
              download
              className="flex items-center px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <FileText className="w-4 h-4 mr-2 text-indigo-500" />
              <span>Download CV (DOCX)</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Professional Summary Section */}
      <section className="p-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400">
          Professional Summary
        </h2>
        <p className="font-serif text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed pl-4 border-l-2 border-indigo-500 dark:border-indigo-450 italic">
          Second-year B.A. LL.B. (Hons.) student at Alliance University with a strong interest in corporate transactional law, contract law, and commercial dispute resolution. Skilled in legal research, contract drafting and analysis, and written advocacy through academic legal projects, an independent drafting portfolio of 15 documents, and moot court participation. Seeking internship opportunities at corporate law firms to develop transactional and advisory skills across M&amp;A, commercial contracts, and regulatory practice.
        </p>
      </section>

      {/* 3. Main Two-Column CV Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side Column: Education, Certifications, Skills, Achievements */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* A. Education Section */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl space-y-6">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <GraduationCap className="w-5 h-5 mr-2 text-indigo-500" />
              Education
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-1 relative pl-5 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-indigo-500 before:rounded-full">
                <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">Alliance University, Bangalore</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">B.A. LL.B. (Hons.)</p>
                <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-450">2025 – Present</p>
              </div>
              <div className="space-y-1 relative pl-5 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-slate-300 dark:before:bg-slate-700 before:rounded-full">
                <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">The British Co-Ed High School, Patiala</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">ISC (Humanities)</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Graduated 2025  |  Score: 96.25%</p>
              </div>
            </div>
          </div>

          {/* B. Skills Section */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl space-y-6">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <Shield className="w-5 h-5 mr-2 text-indigo-500" />
              Skills
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Legal Skills</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Legal Research, Contract Drafting &amp; Analysis, Commercial Contract Review, Pleading Drafting, Legal Writing, Mooting</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Transactional Skills</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">NDA Drafting, Employment Agreements, Indemnity Agreements, IP Notices</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Procedural Knowledge</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">CPC, BNSS 2023, Trade Marks Act 1999, DV Act 2005</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Languages</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">English, Hindi, Punjabi</p>
              </div>
            </div>
          </div>

          {/* C. Certifications */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <FileCheck className="w-5 h-5 mr-2 text-indigo-500" />
              Certifications
            </h3>
            <ul className="space-y-3 text-xs text-slate-650 dark:text-slate-400">
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-500 shrink-0 mt-0.5" />
                <span><strong>Corporate &amp; Commercial Law I: Contracts &amp; Employment Law</strong> – Univ. of Illinois Urbana-Champaign</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-500 shrink-0 mt-0.5" />
                <span><strong>Moral Foundations of Politics</strong> – Yale University</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-500 shrink-0 mt-0.5" />
                <span><strong>Social Norms, Social Change I</strong> – UNICEF</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-500 shrink-0 mt-0.5" />
                <span><strong>Introduction to Cybersecurity Tools &amp; Cyberattacks</strong> – IBM</span>
              </li>
            </ul>
          </div>

          {/* D. Leadership & Achievements */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <Award className="w-5 h-5 mr-2 text-indigo-500" />
              Leadership &amp; Achievements
            </h3>
            <ul className="space-y-3 text-xs text-slate-650 dark:text-slate-400 list-disc pl-4">
              <li>Hosted and facilitated a speaker session at Alliance University featuring a GCC industry expert and business leader.</li>
              <li>Silver Standard Award Recipient, The Duke of Edinburgh’s International Award (IAYP).</li>
              <li>State-level hockey player.</li>
              <li>Trained swimmer.</li>
            </ul>
          </div>

        </div>

        {/* Right Side Column: Projects & Academic Records */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* A. Projects Section (ONLY NLO) */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              Projects
            </h2>
            
            {/* Project: Legal Observatory */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl relative group shadow-sm hover:shadow transition duration-300">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Active Core Initiative</span>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    The National Legal Observatory
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    An independent research platform dedicated to tracking and observing India's constitutional law, digital surveillance policies, and judicial updates with rigorous, primary-source analysis.
                  </p>
                </div>
                <Link
                  href="/?show-founders-note=true"
                  className="p-2.5 bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-slate-800/80 rounded-lg text-slate-400 group-hover:text-indigo-600 transition duration-300 shrink-0"
                  title="Launch Project & View Note"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* B. Legal Research & Projects Details */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl space-y-6">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
              Legal Research &amp; Projects
            </h3>
            
            <div className="space-y-6 text-xs sm:text-sm">
              {/* i. Drafting Portfolio */}
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-bold text-slate-850 dark:text-slate-200">Independent Legal Drafting Portfolio</h4>
                  <a
                    href="mailto:bhoomija.k2810@gmail.com?subject=Request%20for%20Legal%20Drafting%20Portfolio"
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-455 hover:underline"
                  >
                    Request Drafting Portfolio &rarr;
                  </a>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-normal text-xs">
                  Independently drafted a portfolio of 15 legal documents across corporate transactional, civil litigation, criminal and family law practice areas:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1 leading-normal">
                  <li><strong>Corporate &amp; Transactional:</strong> Non-Disclosure Agreement, Employment Agreement, Real Estate Indemnity Agreement (Karnataka law), Cease &amp; Desist Notice (IP/Trademark Infringement — Trade Marks Act, 1999)</li>
                  <li><strong>Civil Litigation:</strong> Plaint for Recovery of Money, Interim Injunction Application (O.XXXIX R.1&amp;2 CPC), Affidavit of Evidence (O.XVIII R.4 CPC), Reply to Legal Notice, Vakalatnama</li>
                  <li><strong>Criminal:</strong> Regular Bail Application (S.483 BNSS, 2023), Anticipatory Bail Application (S.482 BNSS, 2023)</li>
                  <li><strong>Family Law / DV:</strong> Complaint under S.12/18/19/22, Protection of Women from Domestic Violence Act, 2005; Written Statement with Reply to O.XXXIX Application</li>
                </ul>
              </div>

              {/* ii. Indemnity Agreement Project */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Indemnity Agreement Drafting Project</h4>
                <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-normal">
                  <li>Drafted a comprehensive Real Estate Indemnity Agreement governed by Karnataka law, covering allocation of liability, indemnification obligations, breach consequences, and contractual remedies.</li>
                  <li>Applied principles of contractual risk allocation, limitation of liability clauses, and commercial drafting conventions with reference to the Transfer of Property Act, 1882 and Karnataka Stamp Act, 1957.</li>
                  <li>Analysed standard indemnity frameworks used in commercial transactions to ensure alignment with industry drafting practices.</li>
                  <li>Demonstrated understanding of how indemnity provisions interact with representations, warranties, and dispute resolution clauses.</li>
                </ul>
              </div>

              {/* iii. Research Paper */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-bold text-slate-850 dark:text-slate-200">Research Paper: Gender, Propaganda, and Patriarchal Power in Indian Politics</h4>
                  <div className="flex items-center space-x-3 shrink-0 text-xs font-bold">
                    <a
                      href="/Gender_Propaganda_Patriarchal_Power_Research_Paper.docx"
                      download
                      className="text-indigo-600 dark:text-indigo-455 hover:underline flex items-center"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1" /> Download DOCX
                    </a>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <Link
                      href="/publications/research/propaganda-patriarchy-democracy"
                      className="text-indigo-600 dark:text-indigo-455 hover:underline"
                    >
                      Read Online &rarr;
                    </Link>
                  </div>
                </div>
                <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1 leading-normal">
                  <li>Conducted socio-legal research using critical discourse analysis methodology.</li>
                  <li>Examined the role of political narratives, media representation, and gendered rhetoric in democratic institutions.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* C. Moot Courts, Debates & Advocacy */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
              Moot Courts, Debates &amp; Advocacy
            </h3>
            <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
              <li>Participated in intra-university Moot Court competitions, developing skills in legal argumentation, case preparation, and oral advocacy.</li>
              <li>Represented India at an international debate competition in the United Kingdom.</li>
              <li>Participated in Mock Parliament as Finance Minister, demonstrating understanding of legislative and policy processes.</li>
            </ul>
          </div>

        </div>
      </div>

      {/* 4. Publications Section */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-900 pb-2 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-indigo-500" />
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
