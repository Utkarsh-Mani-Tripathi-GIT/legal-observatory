'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';

interface ProtectedArticleViewerProps {
  html: string;
  title: string;
}

// Split HTML into paragraph-level chunks for lazy rendering
function splitHtmlIntoChunks(html: string, chunkSize = 4): string[] {
  const div = document.createElement('div');
  div.innerHTML = html;
  const children = Array.from(div.children);
  if (children.length === 0) return [html];
  const chunks: string[] = [];
  for (let i = 0; i < children.length; i += chunkSize) {
    chunks.push(
      children
        .slice(i, i + chunkSize)
        .map((el) => el.outerHTML)
        .join('')
    );
  }
  return chunks;
}

// Canvas-based diagonal watermark behind the article text
function WatermarkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      canvas.width = canvas.offsetWidth || 800;
      canvas.height = canvas.offsetHeight || 1200;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const lines = ['NATIONAL LEGAL OBSERVATORY', 'BHOOMIJA KHANNA', 'NLO · RESTRICTED'];
      const step = 200;

      for (let y = -canvas.height; y < canvas.height * 2; y += step) {
        for (let x = -canvas.width; x < canvas.width * 2; x += step) {
          const lineIndex = Math.floor(Math.abs(x + y) / step) % lines.length;
          const angle = -(Math.PI / 5.5) + (((x * 7 + y * 3) % 100) / 8000);
          const opacity = 0.04 + (((Math.abs(x * 3 + y * 7)) % 100) / 4000);
          const fontSize = 11 + (Math.abs(x + y) % 3);

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.globalAlpha = opacity;
          ctx.fillStyle = '#1e1b4b';
          ctx.font = `600 ${fontSize}px Georgia, serif`;
          ctx.fillText(lines[lineIndex], 0, 0);
          ctx.restore();
        }
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

// Slowly drifting timestamp watermark — barely visible
function DynamicWatermark() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const positions = [
      { top: '10%', left: '6%' },
      { top: '12%', left: '8%' },
      { top: '9%',  left: '7%' },
      { top: '11%', left: '5%' },
    ];
    let frame = 0;
    const interval = setInterval(() => {
      frame = (frame + 1) % positions.length;
      if (ref.current) {
        ref.current.style.top  = positions[frame].top;
        ref.current.style.left = positions[frame].left;
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const ts = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: '10%',
        left: '6%',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0.045,
        transition: 'top 2.5s ease, left 2.5s ease',
        userSelect: 'none',
        fontFamily: 'Georgia, serif',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.2em',
        color: '#1e1b4b',
        whiteSpace: 'nowrap',
        transform: 'rotate(-30deg)',
      }}
    >
      NATIONAL LEGAL OBSERVATORY · {ts}
    </div>
  );
}

export default function ProtectedArticleViewer({ html }: ProtectedArticleViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef  = useRef<HTMLDivElement>(null);
  const [chunks, setChunks]           = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);

  // Client-only: split into chunks
  useEffect(() => {
    setChunks(splitHtmlIntoChunks(html, 4));
  }, [html]);

  // Lazy reveal via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || chunks.length === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((v) => Math.min(v + 3, chunks.length));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [chunks]);

  // Block all copy / keyboard shortcuts / print / drag
  const block = useCallback((e: Event) => e.preventDefault(), []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('contextmenu', block);
    el.addEventListener('dragstart',   block);
    el.addEventListener('drop',        block);

    const handleKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && ['c','x','a','s','p','u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKey);

    const beforePrint = () => { if (el) el.style.visibility = 'hidden'; };
    const afterPrint  = () => { if (el) el.style.visibility = ''; };
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint',  afterPrint);

    return () => {
      el.removeEventListener('contextmenu', block);
      el.removeEventListener('dragstart',   block);
      el.removeEventListener('drop',        block);
      window.removeEventListener('keydown',      handleKey);
      window.removeEventListener('beforeprint',  beforePrint);
      window.removeEventListener('afterprint',   afterPrint);
    };
  }, [block]);

  return (
    <>
      <DynamicWatermark />

      <style>{`
        @media print { .nlo-protected { display: none !important; } }
      `}</style>

      <div
        ref={containerRef}
        className="nlo-protected relative"
        onCopy={block as any}
        onCut={block as any}
        style={{
          WebkitUserSelect:    'none',
          MozUserSelect:       'none',
          msUserSelect:        'none',
          userSelect:          'none',
          WebkitTouchCallout:  'none',
        } as React.CSSProperties}
      >
        {/* Watermark canvas — absolutely positioned, pointer-events none */}
        <WatermarkCanvas />

        {/* Noise texture layer */}
        <div
          aria-hidden="true"
          style={{
            position:       'absolute',
            inset:          0,
            pointerEvents:  'none',
            zIndex:         2,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.022'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Article content — above watermark, fully readable */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {chunks.slice(0, visibleCount).map((chunk, i) => (
            <div
              key={i}
              className="prose max-w-none dark:prose-invert prose-headings:font-serif prose-h2:text-xl prose-h2:font-extrabold prose-h2:mt-8 prose-h2:pb-1 prose-h2:border-b prose-h2:border-slate-200/50 dark:prose-h2:border-slate-800/50 prose-h3:text-lg prose-h3:font-bold prose-h3:mt-6 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-slate-300 dark:prose-blockquote:border-slate-700 prose-blockquote:pl-4 prose-blockquote:italic prose-p:leading-relaxed prose-li:leading-relaxed text-justify"
              dangerouslySetInnerHTML={{ __html: chunk }}
            />
          ))}
          {visibleCount < chunks.length && (
            <div ref={sentinelRef} style={{ height: 1 }} />
          )}
        </div>
      </div>
    </>
  );
}
