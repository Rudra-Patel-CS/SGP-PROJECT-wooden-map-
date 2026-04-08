"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * ScrollProgress — A modern vertical scroll progress indicator.
 *
 * • Fixed on the right edge of the screen
 * • Gradient fill (amber → brown, matching the Aryam Maps brand)
 * • Glow effect + rounded edges
 * • Percentage tooltip that follows the progress
 * • Hidden on very short pages; thinner on mobile
 * • Pure React — no external libraries
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const calculateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Only show the bar if the page is scrollable (more than 200px overflow)
    if (docHeight < 200) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    const pct = Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100);
    setProgress(pct);
  }, []);

  useEffect(() => {
    // Initial calculation
    calculateProgress();

    // Recalculate on scroll with passive listener for perf
    window.addEventListener("scroll", calculateProgress, { passive: true });
    // Recalculate on resize (page height can change)
    window.addEventListener("resize", calculateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", calculateProgress);
      window.removeEventListener("resize", calculateProgress);
    };
  }, [calculateProgress]);

  if (!isVisible) return null;

  return (
    <>
      {/* ── Track (background) ── */}
      <div
        className="scroll-progress-track"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* ── Fill (progress) ── */}
        <div
          className="scroll-progress-fill"
          style={{ height: `${progress}%` }}
        />

        {/* ── Tooltip ── */}
        <div
          className={`scroll-progress-tooltip ${showTooltip ? "visible" : ""}`}
          style={{ top: `${progress}%` }}
        >
          {Math.round(progress)}%
        </div>
      </div>

      {/* ── Inline styles (no external CSS file needed) ── */}
      <style jsx>{`
        .scroll-progress-track {
          position: fixed;
          top: 0;
          left: 0;
          width: 5px;
          height: 100vh;
          background: rgba(0, 0, 0, 0.06);
          z-index: 9999;
          cursor: pointer;
          transition: width 0.3s ease;
        }

        .scroll-progress-track:hover {
          width: 8px;
        }

        .scroll-progress-fill {
          width: 100%;
          border-radius: 0 0 4px 4px;
          background: linear-gradient(
            180deg,
            #c4a77d 0%,
            #8b5a3c 50%,
            #5c3a1e 100%
          );
          box-shadow:
            0 0 8px rgba(139, 90, 60, 0.4),
            0 0 20px rgba(139, 90, 60, 0.15);
          transition: height 0.08s linear;
        }

        .scroll-progress-tooltip {
          position: absolute;
          left: 14px;
          transform: translateY(-50%);
          background: #3e2d21;
          color: #f5f0eb;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.25s ease;
          letter-spacing: 0.03em;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .scroll-progress-tooltip::after {
          content: '';
          position: absolute;
          top: 50%;
          left: -4px;
          transform: translateY(-50%);
          border: 4px solid transparent;
          border-right-color: #3e2d21;
        }

        .scroll-progress-tooltip.visible {
          opacity: 1;
        }

        /* ── Responsive: thinner on mobile ── */
        @media (max-width: 768px) {
          .scroll-progress-track {
            width: 3px;
          }
          .scroll-progress-track:hover {
            width: 5px;
          }
          .scroll-progress-tooltip {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
