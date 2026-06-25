'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ProtectedArticleViewerProps {
  html: string;
  title: string;
}

// Parse HTML into plain structured blocks for canvas rendering
interface Block {
  tag: string;   // h1 h2 h3 h4 p li blockquote strong em hr
  text: string;
}

function parseHtmlToBlocks(html: string): Block[] {
  const div = document.createElement('div');
  div.innerHTML = html;
  const blocks: Block[] = [];

  function walk(node: Element) {
    const tag = node.tagName?.toLowerCase() || '';
    if (['h1','h2','h3','h4','h5','h6','p','li','blockquote'].includes(tag)) {
      const text = (node.textContent || '').trim();
      if (text) blocks.push({ tag, text });
    } else if (tag === 'hr') {
      blocks.push({ tag: 'hr', text: '' });
    } else {
      Array.from(node.children).forEach(walk);
    }
  }
  Array.from(div.children).forEach(walk);
  return blocks;
}

// Wrap text to fit canvas width, return array of lines
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? current + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// Render a single block onto canvas, return height used
function renderBlock(
  ctx: CanvasRenderingContext2D,
  block: Block,
  y: number,
  width: number,
  isDark: boolean
): number {
  const pad = 48;
  const usable = width - pad * 2;
  const textColor   = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor  = isDark ? '#94a3b8' : '#475569';
  const accentColor = isDark ? '#818cf8' : '#4f46e5';

  if (block.tag === 'hr') {
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, y + 12);
    ctx.lineTo(width - pad, y + 12);
    ctx.stroke();
    return 32;
  }

  let fontSize = 15;
  let fontWeight = '400';
  let fontFamily = 'Georgia, serif';
  let color = textColor;
  let marginTop = 12;
  let marginBottom = 8;
  let indentLeft = 0;
  let lineHeight = 1.75;

  switch (block.tag) {
    case 'h1':
      fontSize = 28; fontWeight = '800'; marginTop = 32; marginBottom = 12;
      color = textColor; lineHeight = 1.3;
      break;
    case 'h2':
      fontSize = 22; fontWeight = '700'; marginTop = 36; marginBottom = 10;
      color = textColor; lineHeight = 1.35;
      // draw bottom border after text
      break;
    case 'h3':
      fontSize = 18; fontWeight = '700'; marginTop = 28; marginBottom = 8;
      color = textColor; lineHeight = 1.4;
      break;
    case 'h4':
      fontSize = 15; fontWeight = '700'; marginTop = 20; marginBottom = 6;
      color = accentColor; lineHeight = 1.5;
      break;
    case 'blockquote':
      fontSize = 14; fontWeight = '400'; fontFamily = 'Georgia, serif';
      color = mutedColor; indentLeft = 20; marginTop = 16; marginBottom = 16;
      lineHeight = 1.75;
      break;
    case 'li':
      fontSize = 15; indentLeft = 24; marginTop = 4; marginBottom = 4;
      color = textColor; lineHeight = 1.7;
      break;
    default:
      fontSize = 15; lineHeight = 1.75; marginTop = 0; marginBottom = 12;
  }

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';

  const textX = pad + indentLeft;
  const textWidth = usable - indentLeft;
  const linePixels = fontSize * lineHeight;

  // Blockquote left bar
  if (block.tag === 'blockquote') {
    ctx.fillStyle = isDark ? 'rgba(129,140,248,0.5)' : 'rgba(79,70,229,0.35)';
    ctx.fillRect(pad, y + marginTop, 3, 9999); // placeholder, will trim after
    ctx.fillStyle = color;
  }

  // List bullet
  let displayText = block.text;
  if (block.tag === 'li') {
    ctx.beginPath();
    ctx.arc(pad + 8, y + marginTop + fontSize * 0.55, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = accentColor;
    ctx.fill();
    ctx.fillStyle = color;
  }

  const lines = wrapText(ctx, displayText, textWidth);
  let cursor = y + marginTop;

  for (const line of lines) {
    ctx.fillText(line, textX, cursor);
    cursor += linePixels;
  }

  const totalHeight = marginTop + lines.length * linePixels + marginBottom;

  // H2 bottom border
  if (block.tag === 'h2') {
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, y + marginTop + lines.length * linePixels + 4);
    ctx.lineTo(width - pad, y + marginTop + lines.length * linePixels + 4);
    ctx.stroke();
  }

  // Fix blockquote bar height
  if (block.tag === 'blockquote') {
    ctx.fillStyle = isDark ? 'rgba(129,140,248,0.5)' : 'rgba(79,70,229,0.35)';
    ctx.fillRect(pad, y + marginTop, 3, lines.length * linePixels);
    ctx.fillStyle = color;
  }

  return totalHeight;
}

// Diagonal watermark tiles on a canvas
function drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const lines = ['NATIONAL LEGAL OBSERVATORY', 'BHOOMIJA KHANNA', 'NLO · RESTRICTED'];
  const step = 220;
  ctx.save();
  for (let y = -height; y < height * 2; y += step) {
    for (let x = -width; x < width * 2; x += step) {
      const idx = Math.floor(Math.abs(x + y) / step) % lines.length;
      const angle = -(Math.PI / 5.5) + (((x * 7 + y * 3) % 100) / 9000);
      const opacity = 0.045 + ((Math.abs(x * 3 + y * 7) % 100) / 5000);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#1e1b4b';
      ctx.font = `600 11px Georgia, serif`;
      ctx.fillText(lines[idx], 0, 0);
      ctx.restore();
    }
  }
  ctx.restore();
}

// Single canvas segment
function ArticleCanvas({
  blocks,
  isDark,
}: {
  blocks: Block[];
  isDark: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [height, setHeight] = useState(600);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth || 700;

    // First pass: measure total height
    ctx.scale(1, 1);
    let totalHeight = 0;
    for (const block of blocks) {
      const h = renderBlock(ctx, block, totalHeight, width, isDark);
      totalHeight += h;
    }
    totalHeight += 32;
    setHeight(totalHeight);

    // Second pass: draw at correct size
    canvas.width  = width * dpr;
    canvas.height = totalHeight * dpr;
    canvas.style.height = totalHeight + 'px';
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
    ctx.fillRect(0, 0, width, totalHeight);

    // Text
    let y = 0;
    for (const block of blocks) {
      y += renderBlock(ctx, block, y, width, isDark);
    }

    // Watermark on top
    drawWatermark(ctx, width, totalHeight);

  }, [blocks, isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height,
        display: 'block',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        pointerEvents: 'none', // text cannot be selected at all
      } as React.CSSProperties}
    />
  );
}

// Drifting fixed watermark overlay
function DynamicWatermark() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const positions = [
      { top: '10%', left: '6%' },
      { top: '12%', left: '8%' },
      { top: '9%',  left: '5%' },
      { top: '11%', left: '7%' },
    ];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % positions.length;
      if (ref.current) {
        ref.current.style.top  = positions[i].top;
        ref.current.style.left = positions[i].left;
      }
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const ts = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

  return (
    <div ref={ref} aria-hidden="true" style={{
      position: 'fixed', top: '10%', left: '6%',
      pointerEvents: 'none', zIndex: 9999,
      opacity: 0.05, transition: 'top 2.5s ease, left 2.5s ease',
      userSelect: 'none', fontFamily: 'Georgia, serif',
      fontSize: '12px', fontWeight: 700,
      letterSpacing: '0.2em', color: '#1e1b4b',
      whiteSpace: 'nowrap', transform: 'rotate(-30deg)',
    }}>
      NATIONAL LEGAL OBSERVATORY · {ts}
    </div>
  );
}

const CHUNK_SIZE = 8; // blocks per canvas segment

export default function ProtectedArticleViewer({ html }: ProtectedArticleViewerProps) {
  const [chunks, setChunks] = useState<Block[][]>([]);
  const [visibleChunks, setVisibleChunks] = useState(1);
  const [isDark, setIsDark] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark'))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const blocks = parseHtmlToBlocks(html);
    const result: Block[][] = [];
    for (let i = 0; i < blocks.length; i += CHUNK_SIZE) {
      result.push(blocks.slice(i, i + CHUNK_SIZE));
    }
    setChunks(result);
  }, [html]);

  // Lazy load more canvas segments on scroll
  useEffect(() => {
    const s = sentinelRef.current;
    if (!s || chunks.length === 0) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisibleChunks(v => Math.min(v + 1, chunks.length));
    }, { threshold: 0.1 });
    obs.observe(s);
    return () => obs.disconnect();
  }, [chunks]);

  // Block keyboard shortcuts
  const blockKey = useCallback((e: KeyboardEvent) => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && ['c','x','a','s','p','u','i'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', blockKey);
    const beforePrint = () => document.getElementById('nlo-protected-wrap')!.style.display = 'none';
    const afterPrint  = () => document.getElementById('nlo-protected-wrap')!.style.display = '';
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint',  afterPrint);
    return () => {
      window.removeEventListener('keydown', blockKey);
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint',  afterPrint);
    };
  }, [blockKey]);

  return (
    <>
      <DynamicWatermark />
      <style>{`@media print { #nlo-protected-wrap { display: none !important; } }`}</style>
      <div
        id="nlo-protected-wrap"
        onContextMenu={e => e.preventDefault()}
        style={{ userSelect: 'none', WebkitUserSelect: 'none' } as React.CSSProperties}
      >
        {chunks.slice(0, visibleChunks).map((chunk, i) => (
          <ArticleCanvas key={i} blocks={chunk} isDark={isDark} />
        ))}
        {visibleChunks < chunks.length && (
          <div ref={sentinelRef} style={{ height: 1 }} />
        )}
        {chunks.length === 0 && (
          <div className="text-slate-400 text-sm py-8 text-center">Loading article…</div>
        )}
      </div>
    </>
  );
}
