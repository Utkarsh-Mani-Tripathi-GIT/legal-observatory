'use client';

import React, { useEffect } from 'react';

export default function SecureReaderWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable right click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable print, dev tools, and browser actions
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Block Cmd+P / Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        alert('Printing this secure document is disabled.');
        return;
      }

      // 2. Block F12 (Dev Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return;
      }

      // 3. Block Cmd+Option+I / Ctrl+Shift+I (Inspect Element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'i') {
        e.preventDefault();
        return;
      }

      // 4. Block Cmd+Option+J / Ctrl+Shift+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'j') {
        e.preventDefault();
        return;
      }

      // 5. Block Cmd+Option+C / Ctrl+Shift+C (Inspect Element selection tool)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'c') {
        e.preventDefault();
        return;
      }

      // 6. Block Cmd+Option+U / Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'u') {
        e.preventDefault();
        return;
      }

      // 7. Block Cmd+I (Send Link via Mail on Mac Safari/Chrome)
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        return;
      }

      // 8. Block Cmd+S / Ctrl+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="select-none relative bk-secure-reader-container">
      {/* CSS overrides to block select, copy, drag, and print */}
      <style jsx global>{`
        /* Disable text selection and user actions */
        .bk-secure-reader-container,
        .bk-secure-reader-container * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-user-drag: none !important;
        }

        /* Prevent Print Preview from rendering any content */
        @media print {
          body, html, .bk-secure-reader-container, #__next, main {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
        }
      `}</style>
      {children}
    </div>
  );
}
