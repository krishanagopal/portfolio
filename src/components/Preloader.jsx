import React, { useState, useEffect } from 'react';
import { CrowdCanvas } from './ui/crowd-canvas';
import { ArrowRight } from 'lucide-react';
import './Preloader.css';

export default function Preloader({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);
  const [scale, setScale] = useState(0.72);

  const handleFinish = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 700);
  };

  // Zoomed in by an additional 30% based on viewport width
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScale(0.47);
      } else if (width < 1024) {
        setScale(0.61);
      } else {
        setScale(0.72);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Keyboard navigation (Escape, Enter, Space)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExiting]);

  // Mouse wheel scroll to enter
  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e) => {
      if (e.deltaY > 30) {
        handleFinish();
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const delta = touchStartY - e.touches[0].clientY;
        if (delta > 50) {
          handleFinish();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isExiting]);

  return (
    <div
      className={`crowd-preloader-root ${isExiting ? 'is-exiting' : ''}`}
      onClick={handleFinish}
      role="region"
      aria-label="Portfolio Introduction Screen"
    >
      {/* Top Right: Enter Portfolio button */}
      <div className="crowd-preloader-top-bar">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleFinish();
          }}
          className="crowd-preloader-enter-btn-top"
          aria-label="Enter portfolio"
        >
          <span>Enter Portfolio</span>
          <ArrowRight size={14} className="crowd-preloader-arrow" />
        </button>
      </div>

      {/* Background Layer: Giant Yellow PORTFOLIO text */}
      <div className="crowd-preloader-center">
        <h1 className="crowd-preloader-title">
          PORTFOLIO
        </h1>
      </div>

      {/* Foreground Layer: Walking Crowd Animation */}
      <div className="crowd-preloader-canvas-container">
        <CrowdCanvas
          src="/images/peeps/all-peeps.png"
          rows={15}
          cols={7}
          scale={scale}
        />
      </div>
    </div>
  );
}
