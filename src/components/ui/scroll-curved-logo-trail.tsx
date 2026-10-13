"use client";

import React, { useEffect, useRef, useState } from "react";

export interface TechLogoItem {
  id: string;
  name: string;
  category: string;
  color: string;
  svg: React.ReactNode;
}

// Cubic Bezier helper
function bezier(p0: number, p1: number, p2: number, p3: number, t: number) {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}

// 3-segment continuous cubic Bezier matching the curved trail in user reference
const SEGMENTS = [
  { p0: [920, 70], p1: [960, 230], p2: [940, 430], p3: [860, 520] },
  { p0: [860, 520], p1: [780, 600], p2: [590, 590], p3: [440, 515] },
  { p0: [440, 515], p1: [290, 440], p2: [170, 350], p3: [70, 260] },
];

function getCurvePoint(u: number) {
  const clampedU = Math.max(0, Math.min(0.9999, u));
  const segIdx = Math.min(2, Math.floor(clampedU * 3));
  const t = clampedU * 3 - segIdx;
  const seg = SEGMENTS[segIdx];
  const x = bezier(seg.p0[0], seg.p1[0], seg.p2[0], seg.p3[0], t);
  const y = bezier(seg.p0[1], seg.p1[1], seg.p2[1], seg.p3[1], t);
  return { x, y };
}

function getCurveAngle(u: number) {
  const p1 = getCurvePoint(u);
  const p2 = getCurvePoint(Math.min(0.9999, u + 0.006));
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

export function ScrollCurvedLogoTrail({
  items,
  className = "",
}: {
  items: TechLogoItem[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0.2);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const targetProgress = useRef(0.2);
  const currentProgress = useRef(0.2);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const scrollParent =
      document.querySelector(".portfolio-app-layout") ||
      document.querySelector(".portfolio-main-area") ||
      window;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate progress from 0 (entering view) to 1 (leaving view)
      const rawProgress =
        (viewportHeight - rect.top) / (viewportHeight + rect.height);
      targetProgress.current = Math.max(0, Math.min(1, rawProgress));
    };

    // Smooth physics lerp loop
    const tick = () => {
      currentProgress.current +=
        (targetProgress.current - currentProgress.current) * 0.12;
      setScrollProgress(currentProgress.current);
      animFrameId.current = requestAnimationFrame(tick);
    };

    handleScroll();
    scrollParent.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    animFrameId.current = requestAnimationFrame(tick);

    return () => {
      scrollParent.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  const total = items.length;
  // Trail spread along the curve
  const spread = 0.58; // total length of the trail along u
  const travelRange = 0.42; // how far the entire trail travels on scroll

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[580px] sm:h-[640px] md:h-[700px] overflow-hidden select-none ${className}`}
    >
      {/* Background ambient curved guide line */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="curveGlow" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2d680" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M 920,70 C 960,230 940,430 860,520 C 780,600 590,590 440,515 C 290,440 170,350 70,260"
          fill="none"
          stroke="url(#curveGlow)"
          strokeWidth="2"
          strokeDasharray="6 8"
        />
      </svg>

      {/* Render Logos along the curved path */}
      {items.map((item, idx) => {
        // Calculate position u for this item based on its index and scroll progress
        // Higher index items lead the train, lower follow
        const normalizedIndex = idx / Math.max(1, total - 1);
        const leadOffset = scrollProgress * travelRange;
        const u = Math.max(
          0.001,
          Math.min(0.999, leadOffset + normalizedIndex * spread)
        );

        const point = getCurvePoint(u);
        const angle = getCurveAngle(u);

        // Responsive position in percentage
        const leftPercent = (point.x / 1000) * 100;
        const topPercent = (point.y / 600) * 100;

        // Dynamic scale and opacity based on position along the curve (gives 3D depth)
        const depthScale = 0.78 + 0.32 * Math.sin(u * Math.PI);
        const depthOpacity = Math.min(1, Math.max(0.35, u > 0.05 ? 1 : u * 20));
        const isHovered = activeItem === item.id;

        return (
          <div
            key={item.id}
            onMouseEnter={() => setActiveItem(item.id)}
            onMouseLeave={() => setActiveItem(null)}
            className="absolute cursor-pointer transition-transform duration-150 ease-out"
            style={{
              left: `${leftPercent}%`,
              top: `${topPercent}%`,
              transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${
                isHovered ? depthScale * 1.35 : depthScale
              })`,
              zIndex: isHovered ? 50 : Math.round(u * 30) + 10,
              opacity: depthOpacity,
            }}
          >
            {/* Tech Logo Card */}
            <div
              className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-[70px] md:h-[70px] rounded-2xl bg-neutral-950/90 border backdrop-blur-md transition-all duration-200 ${
                isHovered
                  ? "border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                  : "border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.65)] hover:border-white/35"
              }`}
              style={{
                boxShadow: isHovered
                  ? `0 0 25px ${item.color}44, 0 10px 25px rgba(0,0,0,0.8)`
                  : undefined,
              }}
            >
              {/* Logo SVG */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                {item.svg}
              </div>

              {/* Tooltip on hover */}
              {isHovered && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/20 shadow-2xl text-center whitespace-nowrap pointer-events-none"
                  style={{
                    transform: `translate(-50%, 0) rotate(${-angle}deg)`, // un-rotate tooltip so text stays horizontal!
                  }}
                >
                  <div className="text-xs font-bold text-white leading-tight">
                    {item.name}
                  </div>
                  <div
                    className="text-[10px] font-mono leading-tight"
                    style={{ color: item.color }}
                  >
                    {item.category}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
