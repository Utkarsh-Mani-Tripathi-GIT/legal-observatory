'use client';

import React, { useEffect, useRef } from 'react';

export default function AuthorInteractions({ children }: { children: React.ReactNode }) {
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cover = coverRef.current;
    if (!cover) return;

    const cursor = document.createElement('div');
    cursor.className = 'author-cursor';
    cursor.innerHTML = '<div class="author-cursor-inner">✦</div>';
    cursor.style.opacity = '0';
    document.body.appendChild(cursor);

    const inner = cursor.querySelector('.author-cursor-inner') as HTMLElement;

    const onMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    };
    const onEnter = () => { cursor.style.opacity = '1'; };
    const onLeave = () => { cursor.style.opacity = '0'; };

    const spawnSparkles = (x: number, y: number) => {
      const ripple = document.createElement('div');
      ripple.className = 'author-click-ripple';
      ripple.style.left   = x + 'px';
      ripple.style.top    = y + 'px';
      ripple.style.width  = '80px';
      ripple.style.height = '80px';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const dist  = 32 + Math.random() * 24;
        const s = document.createElement('div');
        s.className = 'author-sparkle';
        s.style.left = x + 'px';
        s.style.top  = y + 'px';
        s.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        s.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
        s.style.background = i % 2 === 0 ? '#4f46e5' : '#818cf8';
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 650);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      inner.classList.add('is-clicking');
      spawnSparkles(e.clientX, e.clientY);
    };
    const onMouseUp = () => inner.classList.remove('is-clicking');

    window.addEventListener('mousemove', onMove);
    cover.addEventListener('mouseenter', onEnter);
    cover.addEventListener('mouseleave', onLeave);
    cover.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cover.removeEventListener('mouseenter', onEnter);
      cover.removeEventListener('mouseleave', onLeave);
      cover.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cursor.remove();
    };
  }, []);

  return (
    <div ref={coverRef} className="author-cover">
      {children}
    </div>
  );
}
