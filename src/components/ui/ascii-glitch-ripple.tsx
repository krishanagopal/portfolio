"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

// Constants for wave animation behavior
const WAVE_THRESH = 3;
const CHAR_MULT = 3;
const ANIM_STEP = 40;
const WAVE_BUF = 5;

const toText = (c: any): string => {
  if (typeof c === "string") return c;
  if (typeof c === "number") return String(c);
  if (Array.isArray(c)) return c.map(toText).join("");
  if (c == null) return "";
  return String(c);
};

export interface AsciiGlitchRippleProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * The text to display and animate.
   */
  children: any;
  /**
   * The HTML element or component to render as.
   * @default "a"
   */
  as?: any;
  /**
   * Additional CSS classes.
   */
  className?: string;
  /**
   * Duration of each ripple wave in milliseconds.
   * @default 1000
   */
  dur?: number;
  /**
   * Character set to scramble through during the ripple wave.
   * @default '.,·-─~+:;=*π""┐┌┘┴┬╗╔╝╚╬╠╣╩╦║░▒▓█▄▀▌▐■!?&#$@0123456789*'
   */
  chars?: string;
  /**
   * Whether to preserve space characters or scramble them too.
   * @default true
   */
  preserveSpaces?: boolean;
  /**
   * The spread of the ripple wave. Larger numbers mean wider waves.
   * @default 1.0
   */
  spread?: number;
  [key: string]: any;
}

export function AsciiGlitchRipple({
  children,
  as = "a",
  className,
  dur = 1000,
  chars = '.,·-─~+:;=*π""┐┌┘┴┬╗╔╝╚╬╠╣╩╦║░▒▓█▄▀▌▐■!?&#$@0123456789*',
  preserveSpaces = true,
  spread = 1.0,
  ...props
}: AsciiGlitchRippleProps) {
  const Component = as;
  const elRef = useRef<any>(null);

  const text = useMemo(() => toText(children), [children]);

  // Use a mutable ref to store animation state, preventing unnecessary React renders
  const stateRef = useRef({
    origTxt: text,
    origChars: text.split(""),
    isAnim: false,
    cursorPos: 0,
    waves: [] as Array<{ startPos: number; startTime: number; id: number }>,
    animId: null as number | null,
    isHover: false,
    origW: null as number | null,
    origH: null as number | null,
    dur,
    chars,
    preserveSpaces,
    spread,
  });

  // Keep internal mutable state updated when props change
  useEffect(() => {
    stateRef.current.origTxt = text;
    stateRef.current.origChars = text.split("");
    stateRef.current.dur = dur;
    stateRef.current.chars = chars;
    stateRef.current.preserveSpaces = preserveSpaces;
    stateRef.current.spread = spread;

    // Reset layout dimensions if text changes dynamically
    if (stateRef.current.origW !== null && elRef.current) {
      elRef.current.style.width = "";
      elRef.current.style.height = "";
      stateRef.current.origW = null;
      stateRef.current.origH = null;
    }

    if (!stateRef.current.isAnim && elRef.current) {
      elRef.current.textContent = text;
    }
  }, [text, dur, chars, preserveSpaces, spread]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // Initialize content
    el.textContent = text;

    const getClientX = (e: any): number | null => {
      if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
      if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientX;
      if (typeof e.clientX === "number") return e.clientX;
      return null;
    };

    const updateCursorPos = (e: any) => {
      const clientX = getClientX(e);
      if (clientX == null) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const len = stateRef.current.origTxt.length;
      if (len === 0 || rect.width === 0) return;
      const pos = Math.round((x / rect.width) * len);
      stateRef.current.cursorPos = Math.max(0, Math.min(pos, len - 1));
    };

    const stop = () => {
      el.textContent = stateRef.current.origTxt;
      el.classList.remove("as");

      // Restore dimensions cleanly without layout shift
      if (stateRef.current.origW !== null) {
        el.style.width = "";
        el.style.height = "";
        stateRef.current.origW = null;
        stateRef.current.origH = null;
      }
      stateRef.current.isAnim = false;
      if (stateRef.current.animId) {
        cancelAnimationFrame(stateRef.current.animId);
        stateRef.current.animId = null;
      }
    };

    const start = () => {
      if (stateRef.current.isAnim) return;

      const isMobileDevice =
        typeof window !== "undefined" &&
        (window.innerWidth <= 768 || "ontouchstart" in window || navigator.maxTouchPoints > 0);

      // Lock current width and height strictly on desktop to prevent any layout shifts.
      // On mobile viewports, keep fluid wrapping to avoid cutting off multi-line prose.
      if (!isMobileDevice && stateRef.current.origW === null) {
        const rect = el.getBoundingClientRect();
        stateRef.current.origW = rect.width;
        stateRef.current.origH = rect.height;
        el.style.width = `${rect.width}px`;
        el.style.height = `${rect.height}px`;
        el.style.display = "inline-block";
        el.style.verticalAlign = "bottom";
        el.style.overflow = "hidden";
        el.style.whiteSpace = "nowrap";
      }

      stateRef.current.isAnim = true;
      el.classList.add("as");

      const animate = () => {
        const t = Date.now();

        // Evict finished waves
        stateRef.current.waves = stateRef.current.waves.filter(
          (w) => t - w.startTime < stateRef.current.dur
        );

        if (stateRef.current.waves.length === 0) {
          stop();
          return;
        }

        // Apply visual scramble
        el.textContent = genScrambledTxt(t);
        stateRef.current.animId = requestAnimationFrame(animate);
      };

      stateRef.current.animId = requestAnimationFrame(animate);
    };

    const startWave = (pos?: number) => {
      if (stateRef.current.origTxt.length === 0) return;
      const wavePos = typeof pos === "number" ? pos : stateRef.current.cursorPos;
      stateRef.current.waves.push({
        startPos: wavePos,
        startTime: Date.now(),
        id: Math.random(),
      });

      if (!stateRef.current.isAnim) start();
    };

    const calcWaveEffect = (charIdx: number, t: number) => {
      let shouldAnim = false;
      let resultChar = stateRef.current.origChars[charIdx] || "";

      for (const w of stateRef.current.waves) {
        const age = t - w.startTime;
        const prog = Math.min(age / stateRef.current.dur, 1);
        const dist = Math.abs(charIdx - w.startPos);
        const maxDist = Math.max(w.startPos, stateRef.current.origChars.length - w.startPos - 1);
        const rad = (prog * (maxDist + WAVE_BUF)) / stateRef.current.spread;

        if (dist <= rad) {
          shouldAnim = true;
          const intens = Math.max(0, rad - dist);

          // Wave distortion characters
          if (intens <= WAVE_THRESH && intens > 0) {
            const index =
              (dist * CHAR_MULT + Math.floor(age / ANIM_STEP)) % stateRef.current.chars.length;
            resultChar = stateRef.current.chars[index];
          }
        }
      }

      return { shouldAnim, char: resultChar };
    };

    const genScrambledTxt = (t: number) =>
      stateRef.current.origChars
        .map((char, i) => {
          if (stateRef.current.preserveSpaces && char === " ") return " ";
          const res = calcWaveEffect(i, t);
          return res.shouldAnim ? res.char : char;
        })
        .join("");

    const handleEnter = (e: MouseEvent) => {
      stateRef.current.isHover = true;
      updateCursorPos(e);
      startWave();
    };

    const handleMove = (e: MouseEvent) => {
      if (!stateRef.current.isHover) return;
      const old = stateRef.current.cursorPos;
      updateCursorPos(e);
      if (stateRef.current.cursorPos !== old) startWave();
    };

    const handleLeave = () => {
      stateRef.current.isHover = false;
    };

    // Mobile touch & pointer handlers for touch screens & mobile responsive mode
    const handleTouchStart = (e: TouchEvent) => {
      stateRef.current.isHover = true;
      updateCursorPos(e);
      startWave();
    };

    const handleTouchMove = (e: TouchEvent) => {
      updateCursorPos(e);
      startWave();
    };

    const handleTouchEnd = () => {
      stateRef.current.isHover = false;
    };

    const handlePointerDown = (e: PointerEvent) => {
      stateRef.current.isHover = true;
      updateCursorPos(e);
      startWave();
    };

    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") {
        stateRef.current.isHover = true;
        updateCursorPos(e);
        startWave();
      }
    };

    const handleClick = (e: MouseEvent) => {
      updateCursorPos(e);
      startWave();
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    // Attach mobile touch and pointer events
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    el.addEventListener("pointerdown", handlePointerDown, { passive: true });
    el.addEventListener("pointerenter", handlePointerEnter, { passive: true });
    el.addEventListener("click", handleClick);

    // Mobile scroll / viewport auto-trigger:
    // On mobile devices where hover doesn't exist, ripple automatically when scrolled into view
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth <= 768 || "ontouchstart" in window || navigator.maxTouchPoints > 0);
    let observer: IntersectionObserver | null = null;

    if (isMobile && typeof IntersectionObserver !== "undefined") {
      let lastTrigger = 0;
      const scrollContainer = document.querySelector(".portfolio-app-layout");
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const now = Date.now();
              if (now - lastTrigger > 2500) {
                lastTrigger = now;
                const delay = 80 + Math.random() * 220;
                setTimeout(() => {
                  if (el) {
                    startWave(Math.floor(stateRef.current.origTxt.length / 2));
                  }
                }, delay);
              }
            }
          });
        },
        {
          root: scrollContainer || null,
          threshold: 0.3,
        }
      );
      observer.observe(el);
    }

    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("pointerdown", handlePointerDown);
      el.removeEventListener("pointerenter", handlePointerEnter);
      el.removeEventListener("click", handleClick);
      if (observer) observer.disconnect();
      if (stateRef.current.animId) {
        cancelAnimationFrame(stateRef.current.animId);
      }
    };
  }, [text]);

  const isHighlight = typeof className === "string" && className.includes("about-highlight");

  return (
    <Component
      ref={elRef}
      className={cn(
        "cursor-pointer select-none relative align-bottom transition-colors duration-200",
        isHighlight ? "inline" : "inline-block whitespace-nowrap overflow-hidden",
        className
      )}
      style={{
        verticalAlign: "bottom",
        lineHeight: "inherit",
        ...props.style,
      }}
      {...props}
    >
      {text}
    </Component>
  );
}

export default AsciiGlitchRipple;
