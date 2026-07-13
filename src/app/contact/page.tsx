'use client';

import React, { useState } from 'react';
import { Mail, Landmark, Send, CheckCircle, AlertCircle, Info } from 'lucide-react';

type SubmissionCategory = 'general' | 'judgment-review' | 'policy-brief' | 'research-article' | 'essay' | 'blog-post';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'general' as SubmissionCategory,
    // General
    subject: '',
    message: '',
    // Editorial
    title: '',
    caseName: '',
    court: '',
    policyArea: '',
    keywords: '',
    abstract: '',
    editorNotes: '',
    draftText: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.name || !form.email) {
      setStatus('error');
      return;
    }
    
    const { category } = form;
    
    // Construct Email content dynamically
    let mailtoSubject = '';
    let mailtoBody = `Name: ${form.name}\nEmail: ${form.email}\nCategory: ${category.replace('-', ' ').toUpperCase()}\n\n`;
    
    if (category === 'general') {
      if (!form.subject || !form.message) {
        setStatus('error');
        return;
      }
      mailtoSubject = `NLO General Inquiry: ${form.subject}`;
      mailtoBody += `Subject: ${form.subject}\n\nMessage:\n${form.message}`;
    } else {
      if (!form.title || !form.abstract) {
        setStatus('error');
        return;
      }
      
      mailtoSubject = `NLO Submission: ${form.title} [${category}]`;
      mailtoBody += `Title: ${form.title}\n`;
      
      if (category === 'judgment-review') {
        mailtoBody += `Case Name: ${form.caseName}\nCourt/Jurisdiction: ${form.court}\n`;
      } else if (category === 'policy-brief') {
        mailtoBody += `Policy Area: ${form.policyArea}\n`;
      } else if (category === 'research-article') {
        mailtoBody += `Keywords: ${form.keywords}\n`;
      }
      
      mailtoBody += `\nAbstract:\n${form.abstract}\n\n`;
      
      if (form.editorNotes) {
        mailtoBody += `Editor Notes:\n${form.editorNotes}\n\n`;
      }
      
      if (form.draftText) {
        mailtoBody += `Full Text Draft:\n${form.draftText}\n`;
      }
    }

    setStatus('success');
    window.location.href = `mailto:Nationallegalobservatory@gmail.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;
  };

  const isEditorial = form.category !== 'general';

  // UI rendering helper for text inputs
  const renderInput = (label: string, field: keyof typeof form, placeholder: string, required = false) => (
    <div className="space-y-1">
      <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type="text"
        required={required}
        value={form[field] as string}
        onChange={(e) => updateForm(field, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400"
      />
    </div>
  );

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contact the Editors
        </h1>
        <div className="h-1 w-20 bg-indigo-600 dark:bg-indigo-400 mx-auto rounded-full" />
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Submit publication drafts, request citation reproduction clearances, or contact the editorial advisory board regarding corrections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-start">
        {/* Left Column: Guidelines & Contact (Span 4) */}
        <div className="space-y-6 lg:col-span-4 lg:sticky lg:top-24">
          <div className="p-5 bg-white dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 rounded-xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Observatory Office
            </h3>
            <div className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-start space-x-3">
                <Landmark className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Alliance University, Bengaluru – 562 106, Karnataka, India
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <a href="mailto:Nationallegalobservatory@gmail.com" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-slate-700 dark:text-slate-300">
                  Nationallegalobservatory@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800 rounded-xl text-xs space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-200 dark:border-slate-800">
              Submission Guidelines
            </h4>
            <div className="text-slate-500 dark:text-slate-400 leading-relaxed space-y-3 pt-1">
              <p>We welcome original, unpublished work across the following formats:</p>
              <ul className="list-disc pl-4 space-y-1.5 marker:text-indigo-400">
                <li><strong className="font-semibold text-slate-700 dark:text-slate-300">Judgment Reviews</strong> — 1,500–3,000 words</li>
                <li><strong className="font-semibold text-slate-700 dark:text-slate-300">Policy Briefs</strong> — 2,000–3,500 words</li>
                <li><strong className="font-semibold text-slate-700 dark:text-slate-300">Research Articles</strong> — 5,000–12,000 words</li>
                <li><strong className="font-semibold text-slate-700 dark:text-slate-300">Essays</strong> — 1,000–3,000 words</li>
                <li><strong className="font-semibold text-slate-700 dark:text-slate-300">Blog Posts</strong> — 500–1,200 words</li>
              </ul>
              <p>All submissions must be original work and not simultaneously under review elsewhere. Citations should conform to the Bluebook formatting guidelines.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form (Span 8) */}
        <div className="lg:col-span-8 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
              Editorial Submission Portal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select a category below to view the relevant submission fields.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-sm">
            {/* Author Details (Always Visible) */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">1. Author Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderInput('Your Name', 'name', 'Prof. Jane Doe', true)}
                {renderInput('Your Email', 'email', 'j.doe@university.edu', true)}
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">2. Submission Category</h4>
              <div className="space-y-1">
                <select
                  value={form.category}
                  onChange={(e) => updateForm('category', e.target.value as SubmissionCategory)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-3 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold transition-colors cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.2em'
                  }}
                >
                  <option value="general">General Inquiry / Feedback</option>
                  <option value="judgment-review">Judgment Review</option>
                  <option value="policy-brief">Policy Brief</option>
                  <option value="research-article">Research Article</option>
                  <option value="essay">Essay</option>
                  <option value="blog-post">Blog Post</option>
                </select>
              </div>
            </div>

            {/* Dynamic Fields */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">3. Details & Content</h4>
              
              {/* General Inquiry Fields */}
              {form.category === 'general' && (
                <div className="space-y-4">
                  {renderInput('Subject / Topic', 'subject', 'What is this regarding?', true)}
                  <div className="space-y-1 text-xs">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Message <span className="text-rose-500">*</span></label>
                    <textarea 
                      required 
                      rows={6} 
                      value={form.message} 
                      onChange={(e) => updateForm('message', e.target.value)} 
                      placeholder="How can we help you?" 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 leading-relaxed placeholder:text-slate-400" 
                    />
                  </div>
                </div>
              )}

              {/* Editorial Fields */}
              {isEditorial && (
                <div className="space-y-5">
                  {renderInput('Submission Title', 'title', 'Full title of your work', true)}
                  
                  {form.category === 'judgment-review' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderInput('Case Name', 'caseName', 'e.g., Roe v. Wade', true)}
                      {renderInput('Court / Jurisdiction', 'court', 'e.g., Supreme Court of India', true)}
                    </div>
                  )}
                  
                  {form.category === 'policy-brief' && renderInput('Policy Area', 'policyArea', 'e.g., Data Privacy, Climate Change', true)}
                  
                  {form.category === 'research-article' && renderInput('Keywords', 'keywords', 'e.g., AI Law, Human Rights (comma separated)', true)}
                  
                  <div className="space-y-1 text-xs">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Abstract / Summary <span className="text-rose-500">*</span></label>
                    <textarea 
                      required 
                      rows={3} 
                      value={form.abstract} 
                      onChange={(e) => updateForm('abstract', e.target.value)} 
                      placeholder="A brief summary of your work (150-250 words)..." 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 leading-relaxed placeholder:text-slate-400" 
                    />
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Editor Notes (Optional)</label>
                    <textarea 
                      rows={2} 
                      value={form.editorNotes} 
                      onChange={(e) => updateForm('editorNotes', e.target.value)} 
                      placeholder="Special instructions or context for the editorial board..." 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 leading-relaxed placeholder:text-slate-400" 
                    />
                  </div>
                  
                  <div className="pt-2">
                    <div className="p-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Draft Submission</h4>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Paste Text</span>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <textarea 
                          rows={8} 
                          value={form.draftText} 
                          onChange={(e) => updateForm('draftText', e.target.value)} 
                          placeholder="Paste your full draft text here..." 
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 leading-relaxed placeholder:text-slate-400" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form alerts */}
            {status === 'success' && (
              <div className="flex items-center space-x-3 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/50 mt-4">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div className="text-sm">
                  <span className="font-bold block">Opening your email client...</span>
                  <span className="opacity-90">Please ensure you hit "Send" in your mail app to complete the submission.</span>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-100/30 mt-4">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-semibold text-sm">
                  Please fill in all required fields marked with an asterisk (*).
                </span>
              </div>
            )}

            {/* Submit */}
            <div className="pt-4 space-y-6 border-t border-slate-100 dark:border-slate-800">
              {isEditorial && (
                <div className="flex items-start space-x-3 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <span className="font-bold block">Document Upload Notice</span>
                    <span className="opacity-90 leading-relaxed block mt-1">
                      If you prefer to submit a document (PDF/Word) instead of pasting your text above, <strong>please manually attach the file to the email</strong> that opens when you click the button below.
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold rounded-xl shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 hover:scale-[1.02]"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Prepare Submission Email</span>
                    <Send className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
