'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Landmark, ArrowRight, Mail, HelpCircle } from 'lucide-react';
import HelpDeskModal from './HelpDeskModal';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [helpDeskOpen, setHelpDeskOpen] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Subscription successful!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-1.5 bg-indigo-600 text-white rounded">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                NATIONAL LEGAL OBSERVATORY
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-500">
              An independent repository for legal scholars, policymakers, and practitioners focusing on structural constitutionalism, judicial review analysis, and technological rights frameworks.
            </p>
            <div className="flex items-center space-x-3 text-slate-400 dark:text-slate-600">
              <a href="https://www.instagram.com/national.legal.observatory" target="_blank" rel="noopener noreferrer" className="relative group hover:text-indigo-600 dark:hover:text-indigo-400 transition" aria-label="Instagram">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 bg-slate-800 text-white text-[11px] px-2 py-1 rounded shadow-md whitespace-nowrap pointer-events-none z-10 font-medium">
                  Instagram (@national.legal.observatory)
                </span>
              </a>
              <a href="https://linkedin.com/in/bhoomija-khanna-268995368" target="_blank" rel="noopener noreferrer" className="relative group hover:text-indigo-600 dark:hover:text-indigo-400 transition" aria-label="LinkedIn">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 bg-slate-800 text-white text-[11px] px-2 py-1 rounded shadow-md whitespace-nowrap pointer-events-none z-10 font-medium">
                  LinkedIn (Bhoomija Khanna)
                </span>
              </a>
              <a href="mailto:Nationallegalobservatory@gmail.com?subject=Request%20Source%20Code%20Access" className="relative group hover:text-indigo-600 dark:hover:text-indigo-400 transition" aria-label="Request GitHub Access">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                </svg>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 bg-slate-800 text-white text-[11px] px-2 py-1 rounded shadow-md whitespace-nowrap pointer-events-none z-10 font-medium">
                  Request Source Code Access
                </span>
              </a>
              <a href="mailto:Nationallegalobservatory@gmail.com" className="relative group hover:text-indigo-600 dark:hover:text-indigo-400 transition" aria-label="Email">
                <Mail className="w-5 h-5" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 bg-slate-800 text-white text-[11px] px-2 py-1 rounded shadow-md whitespace-nowrap pointer-events-none z-10 font-medium">
                  Email (Nationallegalobservatory@gmail.com)
                </span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Archive Categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/publications?category=constitutional-law" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Constitutional Law
                </Link>
              </li>
              <li>
                <Link href="/publications?category=technology-law" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Technology & Privacy Law
                </Link>
              </li>
              <li>
                <Link href="/publications?category=public-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Legislative Policies
                </Link>
              </li>
              <li>
                <Link href="/publications?category=human-rights" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Human Rights
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Submission & Support */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Contributors
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Editorial Board
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Submission Guidelines
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setHelpDeskOpen(true)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition text-left"
                >
                  Contact Editorial
                </button>
              </li>
              <li>
                <button
                  onClick={() => setHelpDeskOpen(true)}
                  className="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 mr-1" /> Help Desk
                </button>
              </li>
              <li>
                <a
                  href="https://utkarshmanitripathi.vercel.app/resume/OVERALL/full-resume.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span> The Tech Guy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Sign-up */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Newsletter Subscription
            </h3>
            <p className="text-xs text-slate-500 leading-normal">
              Subscribe to receive bi-weekly legal alerts, recent publications, case reviews, and editorial commentaries directly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex rounded-md shadow-sm overflow-hidden border border-slate-300 dark:border-slate-800">
                <input
                  type="email"
                  className="w-full bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-indigo-600 hover:bg-indigo-750 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white dark:text-slate-950 px-4 py-2 text-xs font-semibold transition flex items-center shrink-0 cursor-pointer"
                >
                  {status === 'loading' ? (
                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              
              {/* Alert Feedback Messages */}
              {status === 'success' && (
                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 animate-fade-in">
                  {message}
                </p>
              )}
              {status === 'error' && (
                <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 animate-fade-in">
                  {message}
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom copyright section */}
<div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
  <p>&copy; {new Date().getFullYear()} National Legal Observatory Platform. All academic rights reserved.</p>
  <div className="flex space-x-4">
    <a href="#" className="hover:underline">Privacy Policy</a>
    <a href="#" className="hover:underline">Terms of Service</a>
    <a href="#" className="hover:underline">Citation Permissions</a>
  </div>
</div>
      </div>
    </footer>
  );
}
