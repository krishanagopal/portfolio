import React, { useEffect, useRef } from 'react';

/**
 * ProjectCrossGridBackground
 * Renders the atmospheric background matching the user reference image:
 * - Floating 3D golden crosshairs ('+') in #e2d680
 * - Dual undulating 3D golden particle mesh/wave on the left and right flanks
 * - Ground ambient golden glow reflection beneath the 3D book monographs
 * - Subtle mouse parallax and depth perspective
 */
export default function ProjectCrossGridBackground({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    const mouse = { x: 0, y: 0 };
    const currentMouse = { x: 0, y: 0 };

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouse.x = Math.max(-1, Math.min(1, x));
      mouse.y = Math.max(-1, Math.min(1, y));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 3D Cross Particles
    const FOV = 450;
    const MAX_DEPTH = 1600;
    const NUM_CROSSES = 140;

    const crosses = [];
    for (let i = 0; i < NUM_CROSSES; i++) {
      crosses.push({
        x: (Math.random() - 0.5) * 1650,
        y: (Math.random() - 0.5) * 1050,
        z: Math.random() * MAX_DEPTH + 40,
        baseArm: Math.random() * 4 + 3.5,
        speedZ: Math.random() * 0.3 + 0.15,
        alphaOffset: Math.random() * 0.35,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.016;
      currentMouse.x += (mouse.x - currentMouse.x) * 0.05;
      currentMouse.y += (mouse.y - currentMouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const vanishX = width / 2 + currentMouse.x * 22;
      const vanishY = height * 0.44 + currentMouse.y * 16;

      ctx.save();

      // ─── 1. TERRACOTTA / AMBER GROUND SPOTLIGHT & REFLECTION POOL ─────────────────────
      const groundGlow = ctx.createRadialGradient(
        vanishX,
        height * 0.88,
        15,
        vanishX,
        height * 0.88,
        Math.min(width * 0.52, 650)
      );
      groundGlow.addColorStop(0, 'rgba(200, 55, 55, 0.16)');
      groundGlow.addColorStop(0.35, 'rgba(217, 119, 36, 0.08)');
      groundGlow.addColorStop(0.7, 'rgba(200, 55, 55, 0.02)');
      groundGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = groundGlow;
      ctx.fillRect(0, height * 0.45, width, height * 0.55);

      // ─── 2. PERSPECTIVE WIREFRAME GRID (TERRACOTTA CRIMSON) ───────────
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(200, 55, 55, 0.14)';
      ctx.beginPath();
      // Outer corner rays
      ctx.moveTo(0, 0); ctx.lineTo(vanishX, vanishY);
      ctx.moveTo(width, 0); ctx.lineTo(vanishX, vanishY);
      ctx.moveTo(width, height); ctx.lineTo(vanishX, vanishY);
      ctx.moveTo(0, height); ctx.lineTo(vanishX, vanishY);

      const numRays = 8;
      for (let c = 1; c < numRays; c++) {
        const frac = c / numRays;
        ctx.moveTo(frac * width, 0); ctx.lineTo(vanishX, vanishY);
        ctx.moveTo(frac * width, height); ctx.lineTo(vanishX, vanishY);
      }
      ctx.stroke();

      // ─── 3. UNDULATING 3D TERRACOTTA & AMBER PARTICLE WAVE (LEFT & RIGHT) ──────────────
      // Flanking ribbon waves matching the reference aesthetic
      const waveSides = [-1, 1]; // -1 for left flank, 1 for right flank
      const cols = 14;
      const rows = 18;

      waveSides.forEach((side) => {
        const baseOffsetX = side * (width * 0.38);

        for (let r = 0; r < rows; r++) {
          const zNorm = r / rows; // 0 (near) to 1 (far)
          const z = 180 + zNorm * 900;
          const scale = FOV / (FOV + z);

          ctx.beginPath();
          let started = false;

          for (let c = 0; c < cols; c++) {
            const cNorm = c / cols;
            // X spans laterally outward from the center
            const xLocal = baseOffsetX + side * (cNorm * 420);
            
            // Undulating wave mathematics
            const freq1 = Math.sin(cNorm * 4.2 + time * 1.2 + side) * 55;
            const freq2 = Math.cos(zNorm * 5.0 - time * 0.8) * 35;
            const freq3 = Math.sin((cNorm + zNorm) * 6.0 + time * 1.5) * 20;
            const yLocal = 120 + freq1 + freq2 + freq3;

            const sx = vanishX + xLocal * scale;
            const sy = vanishY + yLocal * scale;

            if (!started) {
              ctx.moveTo(sx, sy);
              started = true;
            } else {
              ctx.lineTo(sx, sy);
            }

            // Draw glowing terracotta & amber particle dots on alternate mesh vertices
            if (c % 2 === 0 && r % 2 === 0) {
              const alpha = Math.max(0.18, (1 - zNorm * 0.75) * 0.85);
              ctx.fillStyle = c % 4 === 0 ? `rgba(200, 55, 55, ${alpha})` : `rgba(217, 119, 36, ${alpha})`;
              ctx.beginPath();
              ctx.arc(sx, sy, Math.max(1, 2.5 * scale), 0, Math.PI * 2);
              ctx.fill();
            }
          }

          const lineAlpha = Math.max(0.08, (1 - zNorm * 0.85) * 0.35);
          ctx.strokeStyle = `rgba(200, 55, 55, ${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // ─── 4. FLOATING 3D TERRACOTTA CROSSES (+) ─────────────────────────────────
      crosses.sort((a, b) => b.z - a.z);

      for (let i = 0; i < crosses.length; i++) {
        const c = crosses[i];
        c.z -= c.speedZ;
        if (c.z < 25) {
          c.z += MAX_DEPTH;
          c.x = (Math.random() - 0.5) * 1650;
          c.y = (Math.random() - 0.5) * 1050;
        }

        const scale = FOV / (FOV + c.z);
        const sx = vanishX + c.x * scale;
        const sy = vanishY + c.y * scale;

        if (sx < -40 || sx > width + 40 || sy < -40 || sy > height + 40) {
          continue;
        }

        const arm = Math.max(2.2, c.baseArm * scale * 2.2);
        const depthAlpha = Math.min(0.92, (1 - c.z / MAX_DEPTH) * 0.95);
        const finalAlpha = Math.max(0.22, depthAlpha + c.alphaOffset * 0.15);

        // Crisp terracotta cross arms
        ctx.strokeStyle = i % 3 === 0 ? `rgba(217, 119, 36, ${finalAlpha})` : `rgba(200, 55, 55, ${finalAlpha})`;
        ctx.lineWidth = arm > 7 ? 1.5 : 1;

        ctx.beginPath();
        ctx.moveTo(sx - arm, sy);
        ctx.lineTo(sx + arm, sy);
        ctx.moveTo(sx, sy - arm);
        ctx.lineTo(sx, sy + arm);
        ctx.stroke();

        // Bright terracotta/amber center core on foreground crosses
        if (arm > 5.5) {
          ctx.fillStyle = `rgba(200, 55, 55, ${Math.min(1, finalAlpha * 1.4)})`;
          ctx.fillRect(sx - 0.75, sy - 0.75, 1.5, 1.5);
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`project-cross-grid-canvas absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ display: 'block' }}
      aria-hidden="true"
    />
  );
}
