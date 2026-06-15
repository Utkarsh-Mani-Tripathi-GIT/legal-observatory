'use client';

import React, { useState } from 'react';
import { Mail, Landmark, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    
    // Simulate submission delay
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', subject: 'general', message: '' });
    }, 1000);
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto py-4">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          Contact the Editors
        </h1>
        <div className="h-1 w-20 bg-indigo-600 dark:bg-indigo-400 mx-auto rounded-full" />
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Submit publication drafts, request citation reproduction clearances, or contact the editorial advisory board regarding corrections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 items-start">
        {/* Left Column: Direct Contact Info (Span 1) */}
        <div className="space-y-6 md:col-span-1">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Observatory Office
            </h3>
            
            <div className="space-y-3.5 text-xs text-slate-500">
              <div className="flex items-start space-x-3">
                <Landmark className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Alliance University, Bengaluru – 562 106, Karnataka, India
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <a href="mailto:bhoomija.k2810@gmail.com" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  bhoomija.k2810@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800 rounded-xl text-xs space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Submission Guidelines
            </h4>
            <div className="text-slate-500 dark:text-slate-400 leading-relaxed space-y-2">
              <p>We welcome original, unpublished work across the following formats:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong className="font-semibold text-slate-700 dark:text-slate-300">Judgment Reviews</strong> — 1,500–3,000 words</li>
                <li><strong className="font-semibold text-slate-700 dark:text-slate-300">Policy Briefs</strong> — 2,000–3,500 words</li>
                <li><strong className="font-semibold text-slate-700 dark:text-slate-300">Research Articles</strong> — 5,000–12,000 words</li>
                <li><strong className="font-semibold text-slate-700 dark:text-slate-300">Essays</strong> — 1,000–3,000 words</li>
                <li><strong className="font-semibold text-slate-700 dark:text-slate-300">Blog Posts</strong> — 500–1,200 words</li>
              </ul>
              <p>All submissions must be original work and not simultaneously under review elsewhere. Citations should conform to the Bluebook formatting guidelines. Essays and blog posts may adopt a more accessible tone but must maintain factual accuracy and, where applicable, cite authoritative sources.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form (Span 2) */}
        <div className="md:col-span-2 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl shadow-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-slate-950 dark:text-white">
            Editorial Submission Portal
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Prof. Jane Doe"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Your Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="j.doe@university.edu"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Subject Classification</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="general">General Inquiry</option>
                <option value="judgment-submission">Judgment Review Proposal</option>
                <option value="policy-submission">Policy Evaluation Draft</option>
                <option value="research-submission">Research Paper Submission</option>
                <option value="correction">Request Correction</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Query Details / Abstract Draft</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Paste your inquiry, citation clearance query, or article abstract summary here..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              />
            </div>

            {/* Form alerts */}
            {status === 'success' && (
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-100/30">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="font-semibold">
                  Thank you! Your inquiry was transmitted to our editors. We will respond within 3-5 academic business days.
                </span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-100/30">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-semibold">
                  Please fill in all required fields.
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-750 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white dark:text-slate-950 font-bold rounded-lg shadow-sm transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {status === 'loading' ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Transmit Query</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
