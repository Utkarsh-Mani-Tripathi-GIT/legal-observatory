'use client';

import React, { useState } from 'react';
import { Link as LinkIcon, Check } from 'lucide-react';

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex-1 py-1.5 flex justify-center items-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      title={copied ? "Copied!" : "Copy link to clipboard"}
    >
      {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
    </button>
  );
}
