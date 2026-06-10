'use client';

import { useEffect } from 'react';

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const trackView = async () => {
      try {
        const res = await fetch('/api/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug }),
        });
        if (res.ok) {
          const data = await res.json();
          // Find the views counter in the DOM and update it smoothly
          const viewDisplay = document.getElementById('view-count-display');
          if (viewDisplay && data.views) {
            const span = viewDisplay.querySelector('span');
            if (span) {
              span.textContent = `${data.views} views`;
            }
          }
        }
      } catch (err) {
        console.warn('View tracking failure:', err);
      }
    };
    
    // Defer a bit so it doesn't block critical page load cycles
    const delay = setTimeout(trackView, 1200);
    return () => clearTimeout(delay);
  }, [slug]);

  return null;
}
