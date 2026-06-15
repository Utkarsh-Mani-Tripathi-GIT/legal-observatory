import React from 'react';
import { Mail, Landmark, Award, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About the Observatory - Founder\'s Note',
  description: 'Why India Needs Independent Legal Observation: A founding note by Bhoomija Khanna, Founder & Research Director of the National Legal Observatory.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Editorial Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 pb-8 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-x-1 sm:gap-x-3 text-[7px] min-[375px]:text-[8.5px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-tight sm:tracking-wider text-slate-500 dark:text-slate-400 mb-6 whitespace-nowrap overflow-hidden w-full">
          <span>NATIONAL LEGAL OBSERVATORY</span>
          <span className="text-slate-300 dark:text-slate-700">&bull;</span>
          <span>Independent Legal Research | India</span>
          <span className="text-slate-300 dark:text-slate-700">&bull;</span>
          <span>Founding Editorial | June 2026</span>
        </div>
        
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
          Why India Needs Independent Legal Observation
        </h1>
        <p className="text-base sm:text-lg text-indigo-600 dark:text-indigo-400 font-serif italic mt-3">
          A Founding Note — National Legal Observatory
        </p>
      </header>

      {/* Author Details Block */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-b border-slate-100 dark:border-slate-900 text-xs">
        <div className="flex items-center gap-4">
          <img
            src="/bhoomija-avatar.png"
            alt="Bhoomija Khanna"
            className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <div className="text-center sm:text-left">
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              Bhoomija Khanna
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Founder & Research Director
            </p>
          </div>
        </div>
        <a
          href="/NLO_Founding_Editorial.docx"
          download
          className="flex items-center px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-semibold shrink-0"
        >
          <FileText className="w-4 h-4 mr-2 text-indigo-500" />
          <span>Download Editorial (DOCX)</span>
        </a>
      </div>

      {/* Main Editorial Body (Academic Serif Prose) */}
      <article className="prose prose-slate dark:prose-invert max-w-none font-serif text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 space-y-6 pt-8">
        
        <p>
          There is a particular kind of frustration that comes with studying law in India today.
        </p>
        
        <p>
          The Supreme Court delivers a judgment that reshapes the constitutional landscape and within forty-eight hours it is buried under political noise, reduced to a headline, or misrepresented entirely. Parliament passes legislation of real consequence, and the public discourse that follows is more partisan than legal. Policy shifts that carry serious implications for rights, for contracts, for civil liberties come and go, noted briefly and analysed rarely.
        </p>
        
        <p className="font-sans font-semibold text-slate-900 dark:text-white pl-4 border-l-2 border-indigo-500 dark:border-indigo-400 my-8 italic">
          This is not a critique of journalism. It is an observation about a gap.
        </p>
        
        <p>
          Legal developments in India move fast. The institutions that produce them are prolific. What is scarce is not information. What is scarce is sustained, independent, structured analysis of that information, produced without an agenda and accessible without a paywall.
        </p>
        
        <p>
          The National Legal Observatory is my attempt to address that gap.
        </p>
        
        <p>
          NLO is an independent legal research platform. Every month, it will publish a structured review tracking constitutional developments, landmark judgments, legislative changes, and shifts in public policy across India. The work will be primary-source driven, built from court records, legislative texts, and official notifications, and written for readers who want to understand what the law is actually doing.
        </p>
        
        <p>
          The scope is intentionally broad. Indian law is not one conversation. It is dozens of conversations happening simultaneously, across constitutional benches and district courts, inside parliamentary committees and regulatory bodies, through executive orders and judicial dissents. A platform that claims to observe the legal landscape of this country cannot afford to be narrow. NLO will not be.
        </p>
        
        <p>
          Constitutional law, civil litigation, criminal justice, commercial and contract law, environmental law, labour law, family law, technology and policy; these are all territories this platform covers, with the same rigour and the same commitment to primary sources.
        </p>
        
        <p>
          I am a second-year law student. I want to be straightforward about that.
        </p>
        
        <p>
          I do not write from the authority of a decade at the bar or a tenured academic position. What I bring is a deep investment in legal research, a commitment to rigorous analysis, and the belief that independent observation has value precisely because it is independent, not beholden to a firm, a party, or an institution.
        </p>
        
        <p>
          The legal profession trains us to read carefully, argue precisely, and remain accountable to the text. That is the standard NLO will hold itself to.
        </p>
        
        <p>
          The first report will be published at the end of June 2026. Reports will follow at the close of every month thereafter.
        </p>
        
        <p>
          If you are a student, a practitioner, an academic, or simply someone who believes that legal literacy matters, I invite you to read, to engage, and to hold this platform to the standards it sets for itself.
        </p>
        
      </article>

      {/* Signature and Credentials Box */}
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1 font-serif text-sm text-slate-600 dark:text-slate-400">
          <p className="font-bold text-slate-900 dark:text-white text-base">Bhoomija Khanna</p>
          <p>Founder & Research Director, National Legal Observatory</p>
          <p>B.A. LL.B. (Hons.), Alliance University Bengaluru – 562 106, Karnataka, India</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-sans mt-2">June 2026</p>
        </div>
        
        <Link 
          href="/contact"
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-750 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white dark:text-slate-950 text-xs font-bold rounded-lg shadow-sm transition"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Write to NLO</span>
        </Link>
      </div>

    </div>
  );
}
