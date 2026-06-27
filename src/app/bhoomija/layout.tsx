'use client';

import { useEffect, useRef } from 'react';

export default function BhoomijaLayout({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    // Find the constraining <main> ancestor and neutralise its padding/max-width
    let node: HTMLElement | null = el.parentElement;
    const overridden: { el: HTMLElement; oldStyle: string }[] = [];

    while (node && node.tagName !== 'BODY') {
      const tag = node.tagName.toLowerCase();
      if (tag === 'main' || node.classList.contains('flex-grow')) {
        overridden.push({ el: node, oldStyle: node.getAttribute('style') || '' });
        node.style.maxWidth = 'none';
        node.style.width = '100%';
        node.style.padding = '0';
        node.style.margin = '0';
        node.style.overflow = 'visible';
      }
      node = node.parentElement;
    }

    return () => {
      overridden.forEach(({ el: target, oldStyle }) => {
        if (oldStyle) {
          target.setAttribute('style', oldStyle);
        } else {
          target.removeAttribute('style');
        }
      });
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ width: '100%', marginTop: '-32px', marginBottom: '-16px', overflowX: 'hidden' }}>
      {children}
    </div>
  );
}
