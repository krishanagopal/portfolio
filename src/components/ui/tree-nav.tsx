"use client";

import * as React from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/components/ui/tree-nav-utils/use-typewriter";

export interface TreeNavItem {
  label: string;
  href: string;
  /** Small pill after the label, e.g. "New". */
  badge?: string;
  /** Opens in a new tab. */
  external?: boolean;
}

type LinkComponent =
  | "a"
  | React.ComponentType<
      React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
    >;

export interface TreeNavProps {
  items: TreeNavItem[];
  /** href of the current page; the marker and background rest on this row. */
  activeHref?: string;
  /** Slide the marker and background to the hovered row and spring back on leave. */
  followHover?: boolean;
  /** Element used for links, e.g. Next's Link. Defaults to a plain anchor. */
  linkComponent?: LinkComponent;
  onSelect?: (
    item: TreeNavItem,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => void;
  className?: string;
}

const ROW_H = 34;
const MARKER = 7;
/** Horizontal centre of the rail inside the gutter */
const RAIL_X = 8;
const PILL_START = 26;

// Critically damped (no overshoot) with a ~0.3s response: Apple's default for
// repositioning UI, tightened a little for a hover highlight. Springs re-target from the live value and carry velocity,
// so sweeping the pointer down the list never stutters or snaps.
const GLIDE = { type: "spring", visualDuration: 0.22, bounce: 0 } as const;
const FADE = { duration: 0.12, ease: "easeOut" } as const;

export function TreeNav({
  items,
  activeHref,
  followHover = true,
  linkComponent: Link = "a",
  onSelect,
  className,
}: TreeNavProps) {
  const listRef = React.useRef<HTMLUListElement>(null);
  const rowRefs = React.useRef<(HTMLLIElement | null)[]>([]);
  const centersRef = React.useRef<number[]>([]);
  const hoveredRef = React.useRef<number | null>(null);
  const reduced = usePrefersReducedMotion();
  const activeIndex = items.findIndex((item) => item.href === activeHref);
  // Handlers and the measurer read these through refs so they never go stale
  // and never need to be re-created; the sync runs before the measure effect.
  const reducedRef = React.useRef(reduced);
  const activeRef = React.useRef(activeIndex);
  React.useLayoutEffect(() => {
    reducedRef.current = reduced;
    activeRef.current = activeIndex;
  });

  // Rail length is the only measurement that renders; everything that moves is
  // a motion value, so hovering never re-renders the list.
  const [end, setEnd] = React.useState(0);
  const [measured, setMeasured] = React.useState(false);

  const centerY = useMotionValue(0);
  const visibility = useMotionValue(0);
  const pillY = useTransform(centerY, (v) => v - ROW_H / 2);
  const markerY = useTransform(centerY, (v) => v - MARKER / 2);
  const accentScale = useTransform(centerY, (v) =>
    end > 0 ? Math.min(1, v / end) : 0,
  );

  const moveTo = React.useCallback(
    (index: number | null, immediate = false) => {
      const centers = centersRef.current;
      if (index === null || index < 0 || index >= centers.length) {
        animate(visibility, 0, FADE);
        return;
      }
      const target = centers[index];
      // Coming back from hidden: appear on the row instead of travelling from
      // wherever the marker was last parked.
      const jump = immediate || reducedRef.current || visibility.get() < 0.05;
      if (jump) centerY.jump(target);
      else animate(centerY, target, GLIDE);
      animate(visibility, 1, FADE);
    },
    [centerY, visibility],
  );

  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const next = rowRefs.current
        .slice(0, items.length)
        .map((el) => (el ? el.offsetTop + el.offsetHeight / 2 : 0));
      centersRef.current = next;
      setEnd(next.length > 0 ? next[next.length - 1] : 0);
      setMeasured(true);
      // A re-measure is a layout change, not motion: settle instantly.
      moveTo(hoveredRef.current ?? activeRef.current, true);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [items.length, moveTo]);

  // Route changes glide; a hover in progress keeps priority.
  React.useEffect(() => {
    if (hoveredRef.current === null) moveTo(activeIndex);
  }, [activeIndex, moveTo]);

  const enter = (index: number) => {
    if (!followHover) return;
    hoveredRef.current = index;
    moveTo(index);
  };
  const leave = () => {
    if (!followHover) return;
    hoveredRef.current = null;
    moveTo(activeRef.current);
  };

  return (
    <ul
      ref={listRef}
      className={cn("relative flex flex-col gap-1 w-full", className)}
      style={{ paddingLeft: `${PILL_START}px` }}
      onPointerLeave={leave}
    >
      {/* Tree rail with a dot terminal, an accent run that grows to the marked
          row, and the diamond marker. All motion is transform + opacity. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 start-0"
        style={{ left: 0, width: `${PILL_START}px` }}
      >
        {/* Subtle background rail line */}
        <span
          className="absolute top-0 w-px bg-white/15"
          style={{ left: `${RAIL_X}px`, height: end }}
        />
        {/* Bottom terminal dot */}
        <span
          className="absolute size-1 rounded-full bg-[#FACC15]/40"
          style={{ left: `${RAIL_X - 1.5}px`, top: end - 2 }}
        />
        {/* Crisp solid Cyber Yellow accent line extending to active marker */}
        <motion.span
          className="absolute top-0 w-px origin-top bg-[#FACC15] will-change-transform"
          style={{
            left: `${RAIL_X}px`,
            height: end,
            scaleY: accentScale,
            opacity: visibility,
          }}
        />
        {/* Crisp solid Cyber Yellow diamond marker */}
        <motion.span
          className="absolute top-0 rounded-[1px] bg-[#FACC15] will-change-transform"
          style={{
            left: `${RAIL_X - MARKER / 2}px`,
            width: MARKER,
            height: MARKER,
            y: markerY,
            rotate: 45,
            opacity: visibility,
          }}
        />
      </span>

      {/* One shared background: rests on the active row, follows the pointer,
          springs back on leave. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute top-0 rounded-lg bg-[#FACC15]/15 will-change-transform"
        style={{
          left: `${PILL_START - 2}px`,
          right: 0,
          height: ROW_H,
          y: pillY,
          opacity: visibility,
        }}
      />

      {items.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <li
            key={item.href}
            ref={(el) => {
              rowRefs.current[index] = el;
            }}
            className="relative"
            onPointerEnter={() => enter(index)}
          >
            <Link
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              aria-current={isActive ? "page" : undefined}
              onClick={onSelect ? (event) => onSelect(item, event) : undefined}
              onFocus={() => enter(index)}
              onBlur={leave}
              className={cn(
                "flex h-[34px] items-center justify-between gap-2 rounded-lg text-[13.5px] leading-5 antialiased transition-colors duration-150 ease-out cursor-pointer select-none",
                // Initial frame fallback before measurement
                isActive && !measured && "bg-[#FACC15]/15",
                isActive
                  ? "font-semibold text-[#FACC15]"
                  : "font-medium text-white/70 hover:text-[#FACC15]",
              )}

              style={{ paddingLeft: '18px', paddingRight: '16px' }}
            >
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className="inline-flex h-[18px] shrink-0 items-center rounded-[5px] bg-[#2b7fff]/15 border border-[#2b7fff]/30 px-[6px] text-[11px] font-medium leading-none text-[#60a5fa]">
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default TreeNav;
