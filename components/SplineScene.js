'use client';

import React, { Suspense, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

const SplineScene = ({ className }) => {
  useEffect(() => {
    // Ultra-aggressive MutationObserver to kill the watermark as soon as it exists
    const observer = new MutationObserver((mutations) => {
      const watermarks = document.querySelectorAll('a[href*="spline.design"], #spline-watermark, [class*="spline-watermark"]');
      watermarks.forEach(el => {
        if (el) {
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
          el.style.pointerEvents = 'none';
          el.style.display = 'none';
          // If we can, just remove it from the DOM entirely
          try { el.remove(); } catch (e) {}
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    
    // Initial sweep
    const initialSweep = setInterval(() => {
      const watermarks = document.querySelectorAll('a[href*="spline.design"], #spline-watermark');
      watermarks.forEach(el => el.remove());
    }, 100);

    // Stop sweeping after 10 seconds to save resources
    setTimeout(() => clearInterval(initialSweep), 10000);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`absolute inset-0 z-0 ${className || ''}`}>
      <Suspense fallback={<div className="w-full h-full bg-[#050505]" />}>
        <Spline scene="https://prod.spline.design/lZVl501SwkfK57RC/scene.splinecode" />
      </Suspense>
    </div>
  );
};

export default SplineScene;
