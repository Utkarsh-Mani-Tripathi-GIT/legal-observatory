'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * HighlightMention
 * Reads ?highlight=<term> from the URL, finds the first occurrence of that
 * term in the article body, wraps it in a highlighted span, and smoothly
 * scrolls to it with a pulsing amber glow — like Ctrl+F, but from search.
 */
export default function HighlightMention() {
  const searchParams = useSearchParams();
  const term = searchParams.get('highlight');
  const injectedRef = useRef(false);

  useEffect(() => {
    if (!term || injectedRef.current) return;

    // Inject keyframes once
    const styleId = 'nlo-highlight-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes nlo-pulse {
          0%   { background-color: #fbbf24; box-shadow: 0 0 0 4px #fbbf2460; }
          40%  { background-color: #fde68a; box-shadow: 0 0 0 8px #fbbf2420; }
          100% { background-color: #fef9c3; box-shadow: 0 0 0 0px transparent; }
        }
        .nlo-highlight {
          border-radius: 3px;
          padding: 0 2px;
          animation: nlo-pulse 2.4s ease forwards;
          scroll-margin-top: 120px;
        }
      `;
      document.head.appendChild(style);
    }

    // Target the article prose container
    const articleBody =
      document.querySelector('article') ||
      document.querySelector('.prose') ||
      document.querySelector('[data-article-body]') ||
      document.querySelector('main');

    if (!articleBody) return;

    const walker = document.createTreeWalker(articleBody, NodeFilter.SHOW_TEXT);
    const lowerTerm = term.toLowerCase();

    let found = false;
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const idx = node.textContent?.toLowerCase().indexOf(lowerTerm) ?? -1;

      if (idx !== -1 && node.textContent) {
        const parent = node.parentNode;
        if (!parent) continue;

        // Split the text node around the matched term
        const before = document.createTextNode(node.textContent.slice(0, idx));
        const matchText = node.textContent.slice(idx, idx + term.length);
        const after = document.createTextNode(node.textContent.slice(idx + term.length));

        const mark = document.createElement('mark');
        mark.className = 'nlo-highlight';
        mark.style.cssText = 'background:transparent;color:inherit;font-weight:700;';
        mark.textContent = matchText;

        parent.insertBefore(before, node);
        parent.insertBefore(mark, node);
        parent.insertBefore(after, node);
        parent.removeChild(node);

        // Scroll smoothly to the highlighted word
        setTimeout(() => {
          mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);

        found = true;
        injectedRef.current = true;
        break;
      }
    }

    if (!found) {
      // Fallback: scroll to top if not found
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [term]);

  return null; // renders nothing, purely behavioural
}
