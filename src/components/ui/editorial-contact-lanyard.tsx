"use client";

import React, { useEffect, useRef, useState } from "react";
import { Copy, Check, ArrowUpRight, Volume2, VolumeX, Mail } from "lucide-react";

export interface EditorialContactLanyardProps {
  nameFirst?: string;
  nameLast?: string;
  role?: string;
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  location?: string;
  ropeLength?: number;
  anchorX?: string;
  anchorY?: number;
  stagePosition?: "fixed" | "absolute";
  className?: string;
}

const CSS = `
.ecl-root {
  --ecl-font-serif: 'Playfair Display', 'Instrument Serif', Georgia, serif;
  --ecl-font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --ecl-font-mono: 'JetBrains Mono', monospace;
  font-family: var(--ecl-font-sans);
}
.ecl-root * { box-sizing: border-box; }

.ecl-stage {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  overflow: visible;
}

.ecl-rope {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.ecl-rail {
  display: none;
}

.ecl-card {
  position: absolute;
  width: clamp(210px, 62vw, 260px);
  aspect-ratio: 260 / 335;
  perspective: 1400px;
  cursor: grab;
  touch-action: none;
  user-select: none;
  transform-origin: top center;
  pointer-events: auto;
}
.ecl-card:active { cursor: grabbing; }

.ecl-flipper {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

/* Acrylic clear badge sleeve */
.ecl-face {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 10px 12px 11px;
  display: flex;
  flex-direction: column;
  backface-visibility: hidden;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.09);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.22),
    0 10px 25px -6px rgba(0, 0, 0, 0.12),
    inset 0 1px 1px rgba(255, 255, 255, 0.95),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.ecl-face::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.7), transparent 45%);
  mix-blend-mode: overlay;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.ecl-card.ecl-hovering .ecl-face::after { opacity: 1; }

.ecl-front {
  align-items: stretch;
}
.ecl-back {
  transform: rotateY(180deg);
  background: rgba(255, 255, 255, 0.92);
}

/* Acrylic Sleeve Header with 2 holes and 1 center lanyard slot */
.ecl-sleeve-header {
  position: relative;
  width: 100%;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  flex-shrink: 0;
}
.ecl-slot {
  width: 32px;
  height: 7px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.16);
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.25);
}
.ecl-punch-hole {
  position: absolute;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
}
.ecl-punch-left { left: 14px; }
.ecl-punch-right { right: 14px; }

/* The white paper card insert */
.ecl-card-inner {
  position: relative;
  flex: 1;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 13px 13px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Editorial Serif Name Headline */
.ecl-name-headline {
  margin: 0;
  display: flex;
  flex-direction: column;
  line-height: 0.92;
  letter-spacing: -0.04em;
  font-family: var(--ecl-font-serif);
}
.ecl-name-first {
  font-size: clamp(31px, 8.2vw, 39px);
  font-weight: 900;
  color: #000000;
}
.ecl-name-last {
  font-size: clamp(31px, 8.2vw, 39px);
  font-weight: 900;
  color: #C83737; /* Aligned Terracotta Crimson */
  margin-top: -3px;
}

/* Sections */
.ecl-section {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ecl-section-label {
  font-family: var(--ecl-font-mono);
  font-size: 8.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #374151;
  font-weight: 700;
}
.ecl-section-value {
  font-size: 11.5px;
  font-weight: 800;
  color: #000000;
  line-height: 1.35;
}

/* Pills row */
.ecl-pills-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
}

.ecl-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 9.5px;
  font-weight: 600;
  font-family: var(--ecl-font-mono);
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;
  line-height: 1;
}
.ecl-pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.ecl-pill-dark {
  background: #111827;
  color: #ffffff;
}
.ecl-pill-dark:hover {
  background: #000000;
}

.ecl-pill-coral {
  background: #ef4444;
  color: #ffffff;
}
.ecl-pill-coral:hover {
  background: #dc2626;
}

.ecl-pill-purple {
  background: #7c3aed;
  color: #ffffff;
}
.ecl-pill-purple:hover {
  background: #6d28d9;
}

.ecl-copy-feedback {
  font-size: 8px;
  color: #10b981;
  font-family: var(--ecl-font-mono);
  margin-top: 2px;
  font-weight: 600;
}

/* Back Face */
.ecl-back-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 4px 4px;
}
.ecl-back-quote {
  font-family: var(--ecl-font-serif);
  font-size: 19px;
  line-height: 1.25;
  color: #111827;
  font-style: italic;
  font-weight: 600;
}
.ecl-back-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: var(--ecl-font-mono);
  font-size: 9.5px;
  color: #4b5563;
  padding-top: 8px;
  border-top: 1px dashed #e5e7eb;
}
.ecl-back-meta strong {
  color: #111827;
}

.ecl-hint-badge {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--ecl-font-mono);
  font-size: 9px;
  color: #6b7280;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0.8;
}
`;

export function EditorialContactLanyard({
  nameFirst = "Krishana",
  nameLast = "Gopal",
  role = "Full Stack Web & Systems Engineer",
  email = "gopalkumardevna@gmail.com",
  githubUrl = "https://github.com/krishanagopal",
  linkedinUrl = "https://www.linkedin.com/in/krishana-gopal-97a73b392/",
  resumeUrl = "/Krishana_Gopal_Resume.pdf",
  location = "UIET Hoshiarpur, Punjab",
  ropeLength = 150,
  anchorX = "50%",
  anchorY = 0,
  stagePosition = "absolute",
  className = "",
}: EditorialContactLanyardProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const flipperRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    const card = cardRef.current;
    const flipper = flipperRef.current;
    if (!scene || !canvas || !card || !flipper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resolveAnchorX() {
      const rect = scene!.getBoundingClientRect();
      const v = anchorX.trim();
      const calcMatch = v.match(/^calc\(\s*100%\s*-\s*([\d.]+)px\s*\)$/);
      if (calcMatch) return rect.width - parseFloat(calcMatch[1]);
      if (v.endsWith("%")) return rect.width * (parseFloat(v) / 100);
      return parseFloat(v);
    }

    const anchor = { x: resolveAnchorX(), y: anchorY };

    function resize() {
      const rect = scene!.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;
      anchor.x = resolveAnchorX();
    }
    resize();

    const NUM_POINTS = 14;
    const REST_LENGTH = ropeLength;
    const SEGMENT_LENGTH = REST_LENGTH / (NUM_POINTS - 1);
    const GRAVITY = 0.58;
    const FRICTION = 0.98;
    const CONSTRAINT_ITERATIONS = 6;
    const TAP_THRESHOLD = 6;
    const MAX_TILT = 8;

    type Pt = { x: number; y: number; oldx: number; oldy: number; pinned: boolean };
    const points: Pt[] = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      const y = anchor.y + i * SEGMENT_LENGTH;
      points.push({ x: anchor.x, y, oldx: anchor.x, oldy: y, pinned: i === 0 });
    }

    let dragging = false;
    let flipped = false;
    let downPos = { x: anchor.x, y: anchor.y };
    let pointer = { x: anchor.x, y: anchor.y + REST_LENGTH };
    let lastPointer = { ...pointer };
    let velocity = { x: 0, y: 0 };

    let flipTarget = 0;
    let flipCurrent = 0;
    const tiltTarget = { x: 0, y: 0 };
    const tiltCurrent = { x: 0, y: 0 };
    let mouse = { x: -9999, y: -9999 };

    function getScenePos(e: PointerEvent) {
      const rect = scene!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function clampToScene(p: { x: number; y: number }) {
      const margin = 16;
      p.x = Math.max(margin, Math.min(canvas!.width - margin, p.x));
      p.y = Math.max(anchor.y + 20, Math.min(canvas!.height - 30, p.y));
      return p;
    }

    function updatePoints() {
      for (let i = 1; i < points.length; i++) {
        if (dragging && i === points.length - 1) continue;
        const p = points[i];
        const vx = (p.x - p.oldx) * FRICTION;
        const vy = (p.y - p.oldy) * FRICTION;
        p.oldx = p.x;
        p.oldy = p.y;
        p.x += vx;
        p.y += vy + GRAVITY;
      }
    }

    function applyConstraints() {
      points[0].x = anchor.x;
      points[0].y = anchor.y;
      if (dragging) {
        const last = points[points.length - 1];
        last.x = pointer.x;
        last.y = pointer.y;
      }
      for (let iter = 0; iter < CONSTRAINT_ITERATIONS; iter++) {
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
          const diff = (SEGMENT_LENGTH - dist) / dist;
          const offX = dx * diff * 0.5;
          const offY = dy * diff * 0.5;
          const p1Locked = p1.pinned;
          const p2Locked = dragging && i + 1 === points.length - 1;
          if (!p1Locked) {
            p1.x -= offX;
            p1.y -= offY;
          }
          if (!p2Locked) {
            p2.x += offX;
            p2.y += offY;
          }
        }
      }
      for (let i = 1; i < points.length; i++) clampToScene(points[i]);
    }

    function drawRope() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const n = points.length;

      const leftPts: { x: number; y: number }[] = [];
      const rightPts: { x: number; y: number }[] = [];

      for (let i = 0; i < n; i++) {
        const p = points[i];
        let tx = 0;
        let ty = 1;
        if (i === 0) {
          tx = points[1].x - points[0].x;
          ty = points[1].y - points[0].y;
        } else if (i === n - 1) {
          tx = points[n - 1].x - points[n - 2].x;
          ty = points[n - 1].y - points[n - 2].y;
        } else {
          tx = points[i + 1].x - points[i - 1].x;
          ty = points[i + 1].y - points[i - 1].y;
        }
        const len = Math.hypot(tx, ty) || 1;
        const nx = -ty / len;
        const ny = tx / len;

        const t = i / (n - 1);
        // Responsive V-shape from top edge, tapering down to 3.5px at the clasp
        const maxSpread = Math.min((canvas?.width || 800) * 0.15, 70);
        const spread = maxSpread * (1 - t * 0.95);

        leftPts.push({ x: p.x - nx * spread, y: p.y - ny * spread });
        rightPts.push({ x: p.x + nx * spread, y: p.y + ny * spread });
      }

      function buildSmoothPath(pts: { x: number; y: number }[]) {
        const pathArr: { x: number; y: number; cx?: number; cy?: number }[] = [];
        pathArr.push({ x: pts[0].x, y: pts[0].y });
        for (let i = 1; i < pts.length - 1; i++) {
          const midX = (pts[i].x + pts[i + 1].x) / 2;
          const midY = (pts[i].y + pts[i + 1].y) / 2;
          pathArr.push({ x: pts[i].x, y: pts[i].y, cx: midX, cy: midY });
        }
        pathArr.push({ x: pts[pts.length - 1].x, y: pts[pts.length - 1].y });
        return pathArr;
      }

      const leftPath = buildSmoothPath(leftPts);
      const rightPath = buildSmoothPath(rightPts);

      function strokeRibbon(
        pathArr: { x: number; y: number; cx?: number; cy?: number }[],
        style: string | CanvasGradient,
        width: number
      ) {
        ctx!.beginPath();
        ctx!.moveTo(pathArr[0].x, pathArr[0].y);
        for (let i = 1; i < pathArr.length; i++) {
          const p = pathArr[i];
          if (p.cx !== undefined) ctx!.quadraticCurveTo(p.x, p.y, p.cx, p.cy as number);
          else ctx!.lineTo(p.x, p.y);
        }
        ctx!.strokeStyle = style;
        ctx!.lineWidth = width;
        ctx!.lineCap = "round";
        ctx!.lineJoin = "round";
        ctx!.stroke();
      }

      // Elegant soft shadow cast to the right on the white wall (as seen in Image 1)
      ctx!.save();
      ctx!.translate(14, 10);
      ctx!.globalAlpha = 0.06;
      strokeRibbon(leftPath, "#000000", 14);
      strokeRibbon(rightPath, "#000000", 14);
      ctx!.globalAlpha = 0.12;
      strokeRibbon(leftPath, "#000000", 7);
      strokeRibbon(rightPath, "#000000", 7);
      ctx!.restore();

      // Clean matte black straps matching reference
      strokeRibbon(leftPath, "#0f1115", 6.5);
      strokeRibbon(rightPath, "#0f1115", 6.5);
      strokeRibbon(leftPath, "rgba(255,255,255,0.1)", 1.2);
      strokeRibbon(rightPath, "rgba(255,255,255,0.1)", 1.2);
    }

    function drawClip() {
      // Bottom metallic clamp & drop swivel hook (as seen in Image 1)
      const last = points[points.length - 1];
      const prev = points[points.length - 2];
      const angle = Math.atan2(last.y - prev.y, last.x - prev.x) - Math.PI / 2;

      ctx!.save();
      ctx!.translate(last.x, last.y);
      ctx!.rotate(angle);

      // Soft shadow for the metal clasp
      ctx!.save();
      ctx!.translate(10, 8);
      ctx!.fillStyle = "rgba(0,0,0,0.1)";
      ctx!.beginPath();
      ctx!.roundRect(-5, -12, 10, 12, 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(0, 4, 4, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillRect(-1.5, 6, 3, 16);
      ctx!.restore();

      // 1. Sleek metallic crimp clamp binding both straps
      const gc = ctx!.createLinearGradient(-5, -12, 5, 0);
      gc.addColorStop(0, "#ffffff");
      gc.addColorStop(0.3, "#d1d5db");
      gc.addColorStop(0.7, "#888e99");
      gc.addColorStop(1, "#4b515a");
      ctx!.fillStyle = gc;
      ctx!.beginPath();
      ctx!.roundRect(-5, -12, 10, 12, 2);
      ctx!.fill();
      ctx!.strokeStyle = "rgba(0,0,0,0.25)";
      ctx!.lineWidth = 0.8;
      ctx!.stroke();

      // 2. Swivel circular bead / ring
      ctx!.fillStyle = "#9ca3af";
      ctx!.beginPath();
      ctx!.arc(0, 3, 3.5, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.strokeStyle = "#d1d5db";
      ctx!.lineWidth = 1;
      ctx!.stroke();

      // 3. Delicate vertical lobster clip / pin extending down into the badge slot
      ctx!.strokeStyle = "#b0b6bf";
      ctx!.lineWidth = 2.4;
      ctx!.beginPath();
      ctx!.moveTo(0, 6);
      ctx!.lineTo(0, 22);
      ctx!.stroke();

      // Hook closure tab
      ctx!.fillStyle = "#6b7280";
      ctx!.beginPath();
      ctx!.roundRect(-1.5, 10, 3, 7, 1);
      ctx!.fill();

      ctx!.restore();
    }

    function positionCard() {
      const last = points[points.length - 1];
      const prev = points[points.length - 2];
      const angle = Math.atan2(last.y - prev.y, last.x - prev.x) - Math.PI / 2;
      card!.style.left = last.x - card!.offsetWidth / 2 + "px";
      card!.style.top = last.y + 12 + "px";
      card!.style.transform = `rotate(${angle}rad)`;
    }

    function updateTiltAndSheen() {
      flipCurrent += (flipTarget - flipCurrent) * 0.16;

      const hovering = !dragging && mouse.x > -1000;
      if (hovering) {
        const cx = card!.offsetLeft + card!.offsetWidth / 2;
        const cy = card!.offsetTop + card!.offsetHeight / 2;
        const dx = Math.max(-1, Math.min(1, (mouse.x - cx) / (card!.offsetWidth / 2)));
        const dy = Math.max(-1, Math.min(1, (mouse.y - cy) / (card!.offsetHeight / 2)));
        tiltTarget.y = dx * MAX_TILT;
        tiltTarget.x = -dy * MAX_TILT;

        const mx = Math.max(0, Math.min(100, ((mouse.x - card!.offsetLeft) / card!.offsetWidth) * 100));
        const my = Math.max(0, Math.min(100, ((mouse.y - card!.offsetTop) / card!.offsetHeight) * 100));
        card!.style.setProperty("--mx", mx + "%");
        card!.style.setProperty("--my", my + "%");
        card!.classList.add("ecl-hovering");
      } else {
        tiltTarget.x = 0;
        tiltTarget.y = 0;
        card!.classList.remove("ecl-hovering");
      }

      tiltCurrent.x += (tiltTarget.x - tiltCurrent.x) * 0.12;
      tiltCurrent.y += (tiltTarget.y - tiltCurrent.y) * 0.12;

      flipper!.style.transform = `rotateY(${flipCurrent + tiltCurrent.y}deg) rotateX(${tiltCurrent.x}deg)`;
    }

    let raf = 0;
    function loop() {
      updatePoints();
      applyConstraints();
      drawRope();
      drawClip();
      positionCard();
      updateTiltAndSheen();
      raf = requestAnimationFrame(loop);
    }

    const onCardDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a, button")) return;
      e.preventDefault();
      dragging = true;
      card!.setPointerCapture(e.pointerId);
      const pos = clampToScene(getScenePos(e));
      pointer = pos;
      lastPointer = pos;
      downPos = pos;
    };
    const onWindowMove = (e: PointerEvent) => {
      mouse = getScenePos(e);
      if (!dragging) return;
      const pos = clampToScene(mouse);
      velocity.x = pos.x - lastPointer.x;
      velocity.y = pos.y - lastPointer.y;
      lastPointer = pos;
      pointer = pos;
    };
    const onWindowUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      const pos = getScenePos(e);
      const dist = Math.hypot(pos.x - downPos.x, pos.y - downPos.y);
      if (dist < TAP_THRESHOLD) {
        flipped = !flipped;
        flipTarget = flipped ? 180 : 0;
        const last = points[points.length - 1];
        last.oldx = last.x;
        last.oldy = last.y;
        return;
      }
      const last = points[points.length - 1];
      last.oldx = last.x - velocity.x;
      last.oldy = last.y - velocity.y;
    };
    const onResize = () => resize();
    const onPointerOut = (e: PointerEvent) => {
      if (e.relatedTarget === null) mouse = { x: -9999, y: -9999 };
    };

    card.addEventListener("pointerdown", onCardDown);
    window.addEventListener("pointermove", onWindowMove);
    window.addEventListener("pointerup", onWindowUp);
    window.addEventListener("resize", onResize);
    document.addEventListener("pointerout", onPointerOut);

    loop();

    return () => {
      cancelAnimationFrame(raf);
      card.removeEventListener("pointerdown", onCardDown);
      window.removeEventListener("pointermove", onWindowMove);
      window.removeEventListener("pointerup", onWindowUp);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, [anchorX, anchorY, ropeLength]);

  const copyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className={`ecl-root ${className}`}>
      <style>{CSS}</style>

      <div className="ecl-stage" ref={sceneRef} style={{ position: stagePosition }}>
        <canvas className="ecl-rope" ref={canvasRef} />

        <div className="ecl-card" ref={cardRef}>
          <div className="ecl-flipper" ref={flipperRef}>
            {/* FRONT FACE */}
            <div className="ecl-face ecl-front">
              {/* Acrylic sleeve punch holes and slot */}
              <div className="ecl-sleeve-header">
                <span className="ecl-punch-hole ecl-punch-left" />
                <span className="ecl-slot" />
                <span className="ecl-punch-hole ecl-punch-right" />
              </div>

              {/* White card inner */}
              <div className="ecl-card-inner">
                {/* Big Editorial Serif Name */}
                <h2 className="ecl-name-headline">
                  <span className="ecl-name-first">{nameFirst}</span>
                  <span className="ecl-name-last">{nameLast}</span>
                </h2>

                {/* Currently */}
                <div className="ecl-section mt-4">
                  <span className="ecl-section-label">Currently</span>
                  <span className="ecl-section-value">{role}</span>
                </div>

                {/* Email - Pure Text (No buttons) */}
                <div className="ecl-section mt-3">
                  <span className="ecl-section-label">Email</span>
                  <a
                    href={`mailto:${email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="block text-[11px] sm:text-[12px] font-mono text-black font-bold hover:underline hover:text-[#C83737] transition-colors"
                  >
                    {email}
                  </a>
                </div>

                {/* Profiles - Pure Text (No buttons) */}
                <div className="ecl-section mt-2.5">
                  <span className="ecl-section-label">Profiles</span>
                  <div className="flex flex-col gap-1 text-[11px] sm:text-[11.5px] font-mono text-black font-bold mt-0.5">
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 hover:underline hover:text-[#C83737] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>github.com/krishanagopal</span>
                      <ArrowUpRight size={10} className="text-black font-bold" />
                    </a>
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 hover:underline hover:text-[#C83737] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>linkedin.com/in/krishana-gopal-97a73b392</span>
                      <ArrowUpRight size={10} className="text-black font-bold" />
                    </a>
                    {resumeUrl && (
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:underline hover:text-[#C83737] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>resume / cv (pdf)</span>
                        <ArrowUpRight size={10} className="text-black font-bold" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="ecl-hint-badge">
                <span>tap to flip card · drag to swing</span>
              </div>
            </div>

            {/* BACK FACE */}
            <div className="ecl-face ecl-back">
              <div className="ecl-sleeve-header">
                <span className="ecl-punch-hole ecl-punch-left" />
                <span className="ecl-slot" />
                <span className="ecl-punch-hole ecl-punch-right" />
              </div>

              <div className="ecl-card-inner">
                <div className="ecl-back-inner">
                  <p className="ecl-back-quote">
                    "I engineer web products and the stories behind them."
                  </p>

                  <div className="ecl-back-meta">
                    <div>
                      <span>LOCATION / </span>
                      <strong>{location}</strong>
                    </div>
                    <div>
                      <span>CONTACT / </span>
                      <strong>{email}</strong>
                    </div>
                    <div>
                      <span>STATUS / </span>
                      <strong className="text-emerald-600">Open to Opportunities</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
