'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface ProtectedArticleViewerProps {
  html: string;
  title: string;
}

// Splits HTML into chunks for lazy rendering — avoids exposing full DOM at once
function splitHtmlIntoChunks(html: string, chunkSize = 3): string[] {
  const div = document.createElement('div');
  div.innerHTML = html;
  const children = Array.from(div.children);
  const chunks: string[] = [];
  for (let i = 0; i < children.length; i += chunkSize) {
    const slice = children.slice(i, i + chunkSize);
    chunks.push(slice.map((el) => el.outerHTML).join(''));
  }
  return chunks.length > 0 ? chunks : [html];
}

// Watermark canvas drawn behind article
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
      const step = 180;

      for (let y = -canvas.height; y < canvas.height * 2; y += step) {
        for (let x = -canvas.width; x < canvas.width * 2; x += step) {
          const lineIndex = Math.floor(Math.abs(x + y) / step) % lines.length;
          const text = lines[lineIndex];
          // Slight randomisation per tile
          const angle = -(Math.PI / 5.5) + (((x * 7 + y * 3) % 100) / 10000);
          const opacity = 0.038 + (((x * 3 + y * 7) % 100) / 10000);
          const fontSize = 10 + (Math.abs(x + y) % 4);

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.globalAlpha = opacity;
          ctx.fillStyle = '#1e1b4b';
          ctx.font = `600 ${fontSize}px 'Georgia', serif`;
          ctx.letterSpacing = '0.18em';
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
      }
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
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
        zIndex: 0,
      }}
    />
  );
}

// Dynamic floating watermark overlay — moves slightly every few seconds
function DynamicWatermark() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const positions = [
      { top: '12%', left: '8%' },
      { top: '14%', left: '10%' },
      { top: '11%', left: '9%' },
      { top: '13%', left: '7%' },
    ];

    const interval = setInterval(() => {
      frame = (frame + 1) % positions.length;
      const pos = positions[frame];
      el.style.top = pos.top;
      el.style.left = pos.left;
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
        top: '12%',
        left: '8%',
        pointerEvents: 'none',
        zIndex: 9,
        opacity: 0.045,
        transition: 'top 2s ease, left 2s ease',
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

export default function ProtectedArticleViewer({ html, title }: ProtectedArticleViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chunks, setChunks] = React.useState<string[]>([]);
  const [visibleCount, setVisibleCount] = React.useState(2);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Split into chunks on mount (client-only — avoids full DOM exposure)
  useEffect(() => {
    setChunks(splitHtmlIntoChunks(html, 3));
  }, [html]);

  // Lazy-reveal chunks via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || chunks.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((v) => Math.min(v + 2, chunks.length));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [chunks]);

  // ── All copy/selection/keyboard protections ──
  const block = useCallback((e: Event) => e.preventDefault(), []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Block context menu, drag
    el.addEventListener('contextmenu', block);
    el.addEventListener('dragstart', block);
    el.addEventListener('drop', block);
    el.addEventListener('selectstart', block);

    // Block keyboard shortcuts
    const handleKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && ['c', 'x', 'a', 's', 'p', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKey);

    // Block print
    const handleBeforePrint = () => {
      if (el) el.style.display = 'none';
    };
    const handleAfterPrint = () => {
      if (el) el.style.display = '';
    };
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      el.removeEventListener('contextmenu', block);
      el.removeEventListener('dragstart', block);
      el.removeEventListener('drop', block);
      el.removeEventListener('selectstart', block);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [block]);

  return (
    <>
      <DynamicWatermark />

      {/* Print blocker */}
      <style>{`
        @media print {
          .protected-article-viewer { display: none !important; }
        }
      `}</style>

      <div
        ref={containerRef}
        className="protected-article-viewer relative"
        style={{
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserDrag: 'none',
        } as React.CSSProperties}
        onCopy={block as any}
        onCut={block as any}
        onPaste={block as any}
      >
        {/* Static watermark canvas layer */}
        <WatermarkCanvas />

        {/* Subtle noise texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Article content — lazy chunked */}
        <div className="relative z-10">
          {chunks.slice(0, visibleCount).map((chunk, i) => (
            <div
              key={i}
              className="prose max-w-none dark:prose-invert prose-headings:font-serif prose-h2:text-xl prose-h2:font-extrabold prose-h2:mt-8 prose-h2:pb-1 prose-h2:border-b prose-h2:border-slate-200/50 dark:prose-h2:border-slate-800/50 prose-h3:text-lg prose-h3:font-bold prose-h3:mt-6 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-slate-300 dark:prose-blockquote:border-slate-700 prose-blockquote:pl-4 prose-blockquote:italic prose-p:leading-relaxed prose-li:leading-relaxed text-justify"
              dangerouslySetInnerHTML={{ __html: chunk }}
            />
          ))}
          {/* Sentinel for lazy loading */}
          {visibleCount < chunks.length && (
            <div ref={sentinelRef} style={{ height: 1 }} />
          )}
        </div>

        {/* Top glass shield — intercepts pointer to prevent text tool selection */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-20 pointer-events-auto"
          style={{ background: 'transparent' }}
          onMouseDown={(e) => {
            // Allow links to work but block text selection drag
            const target = e.target as HTMLElement;
            if (target.tagName !== 'A') e.preventDefault();
          }}
        />
      </div>
    </>
  );
}
