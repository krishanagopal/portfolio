import React, { useEffect, useRef } from 'react';

export default function PerspectiveGridBackground({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    // Mouse coordinates normalized (-1 to 1) for subtle 3D perspective parallax
    let mouse = { x: 0, y: 0 };
    let currentMouse = { x: 0, y: 0 };

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

    // Drawing function
    const render = () => {
      // Smooth interpolation for mouse parallax
      currentMouse.x += (mouse.x - currentMouse.x) * 0.05;
      currentMouse.y += (mouse.y - currentMouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Cyber Yellow / Gold background
      ctx.fillStyle = '#EAB308';
      ctx.fillRect(0, 0, width, height);

      // Center vanishing point with slight parallax
      const vanishX = width / 2 + currentMouse.x * 22;
      const vanishY = height / 2 + currentMouse.y * 16;

      // Inner back rectangle (the deep tunnel void)
      const innerRatioW = 0.44;
      const innerRatioH = 0.42;
      const innerW = width * innerRatioW;
      const innerH = height * innerRatioH;
      const innerLeft = vanishX - innerW / 2;
      const innerRight = vanishX + innerW / 2;
      const innerTop = vanishY - innerH / 2;
      const innerBottom = vanishY + innerH / 2;

      // Number of subdivisions matching reference image
      const numDepthFrames = 5; // Concentric depth rings
      const numCols = 8;        // Floor/ceiling segments
      const numRows = 6;        // Wall segments

      // Calculate depth frames (outer canvas bounds to inner rectangle)
      // We use perspective weighting so frames recede into the distance
      const frames = [];
      for (let i = 0; i <= numDepthFrames; i++) {
        // Perspective curve: frames get denser as they recede
        const t = Math.pow(i / numDepthFrames, 1.25);
        const l = 0 + (innerLeft - 0) * t;
        const r = width + (innerRight - width) * t;
        const top = 0 + (innerTop - 0) * t;
        const b = height + (innerBottom - height) * t;
        frames.push({ left: l, right: r, top, bottom: b, t });
      }

      // Collect intersection points for drawing vertex dots
      const vertexPoints = [];

      ctx.save();

      // 1. Draw corner perspective lines (connect outer corners to inner corners)
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(28, 25, 23, 0.45)';
      ctx.beginPath();
      // Top-Left
      ctx.moveTo(0, 0);
      ctx.lineTo(innerLeft, innerTop);
      // Top-Right
      ctx.moveTo(width, 0);
      ctx.lineTo(innerRight, innerTop);
      // Bottom-Right
      ctx.moveTo(width, height);
      ctx.lineTo(innerRight, innerBottom);
      // Bottom-Left
      ctx.moveTo(0, height);
      ctx.lineTo(innerLeft, innerBottom);
      ctx.stroke();

      // 2. Draw radiating perspective rays on Ceiling & Floor
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(28, 25, 23, 0.35)';
      ctx.beginPath();

      for (let c = 1; c < numCols; c++) {
        const frac = c / numCols;
        const outerX = frac * width;
        const innerX = innerLeft + frac * innerW;

        // Ceiling ray
        ctx.moveTo(outerX, 0);
        ctx.lineTo(innerX, innerTop);

        // Floor ray
        ctx.moveTo(outerX, height);
        ctx.lineTo(innerX, innerBottom);
      }
      ctx.stroke();

      // 3. Draw radiating perspective rays on Left & Right Walls
      ctx.strokeStyle = 'rgba(28, 25, 23, 0.35)';
      ctx.beginPath();
      for (let r = 1; r < numRows; r++) {
        const frac = r / numRows;
        const outerY = frac * height;
        const innerY = innerTop + frac * innerH;

        // Left wall ray
        ctx.moveTo(0, outerY);
        ctx.lineTo(innerLeft, innerY);

        // Right wall ray
        ctx.moveTo(width, outerY);
        ctx.lineTo(innerRight, innerY);
      }
      ctx.stroke();

      // 4. Draw concentric depth frame rectangles (cross lines)
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        // Fade lines slightly deeper into the tunnel (dark stone tone for contrast over yellow)
        const alpha = (0.55 - (i / numDepthFrames) * 0.15) * 0.55;
        ctx.strokeStyle = `rgba(28, 25, 23, ${Math.max(0.18, alpha)})`;
        ctx.lineWidth = i === frames.length - 1 ? 1.2 : 1;

        if (i === frames.length - 1) {
          // Bottom horizontal line only for innermost frame
          ctx.beginPath();
          ctx.moveTo(frame.left, frame.bottom);
          ctx.lineTo(frame.right, frame.bottom);
          ctx.stroke();
        } else if (i === 0) {
          // Outer frame
          ctx.beginPath();
          ctx.moveTo(frame.left, frame.top);
          ctx.lineTo(frame.left, frame.bottom);
          ctx.lineTo(frame.right, frame.bottom);
          ctx.lineTo(frame.right, frame.top);
          ctx.stroke();
        } else {
          ctx.strokeRect(
            frame.left,
            frame.top,
            frame.right - frame.left,
            frame.bottom - frame.top
          );
        }

        // Compute vertex dots along this frame
        if (i < frames.length - 1) {
          vertexPoints.push({ x: frame.left, y: frame.top });
          vertexPoints.push({ x: frame.right, y: frame.top });
        }
        vertexPoints.push({ x: frame.left, y: frame.bottom });
        vertexPoints.push({ x: frame.right, y: frame.bottom });

        // Floor and ceiling vertices on this frame
        const frameW = frame.right - frame.left;
        for (let c = 1; c < numCols; c++) {
          const frac = c / numCols;
          const px = frame.left + frac * frameW;
          if (i < frames.length - 1) {
            vertexPoints.push({ x: px, y: frame.top });
          }
          vertexPoints.push({ x: px, y: frame.bottom });
        }

        // Wall vertices on this frame
        const frameH = frame.bottom - frame.top;
        for (let r = 1; r < numRows; r++) {
          const frac = r / numRows;
          const py = frame.top + frac * frameH;
          const dotAlpha = (i === frames.length - 1) ? 0.15 : 0.55;
          vertexPoints.push({ x: frame.left, y: py, alpha: dotAlpha });
          vertexPoints.push({ x: frame.right, y: py, alpha: dotAlpha });
        }
      }

      // 5. Draw back wall vertical lines only (faded out)
      ctx.strokeStyle = 'rgba(28, 25, 23, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let c = 1; c < numCols; c++) {
        const frac = c / numCols;
        const x = innerLeft + frac * innerW;
        ctx.moveTo(x, innerTop);
        ctx.lineTo(x, innerBottom);
      }
      ctx.stroke();

      // Radial fog gradient fading the center out into yellow/amber depth
      const fogRadius = Math.max(innerW, innerH) * 0.6;
      const fogGrad = ctx.createRadialGradient(
        vanishX, vanishY, 0,
        vanishX, vanishY, fogRadius
      );
      fogGrad.addColorStop(0, '#CA8A04');
      fogGrad.addColorStop(0.35, 'rgba(234, 179, 8, 0.95)');
      fogGrad.addColorStop(0.7, 'rgba(234, 179, 8, 0.6)');
      fogGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');

      ctx.fillStyle = fogGrad;
      ctx.fillRect(innerLeft - 20, innerTop - 20, innerW + 40, innerH + 40);


      // Faded-out vertical border lines: gently dissolving across the text area
      const vertFadeGrad = ctx.createLinearGradient(0, innerTop, 0, innerBottom);
      vertFadeGrad.addColorStop(0, 'rgba(246, 244, 238, 0.25)');
      vertFadeGrad.addColorStop(0.2, 'rgba(246, 244, 238, 0.10)');
      vertFadeGrad.addColorStop(0.5, 'rgba(246, 244, 238, 0.04)');
      vertFadeGrad.addColorStop(0.8, 'rgba(246, 244, 238, 0.10)');
      vertFadeGrad.addColorStop(1, 'rgba(246, 244, 238, 0.25)');

      ctx.strokeStyle = vertFadeGrad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Left vertical line with smooth fade
      ctx.moveTo(innerLeft, innerTop);
      ctx.lineTo(innerLeft, innerBottom);
      // Right vertical line with smooth fade
      ctx.moveTo(innerRight, innerTop);
      ctx.lineTo(innerRight, innerBottom);
      ctx.stroke();

      // 6. Draw vertex dots at line intersections (warm off-white cream tone)
      for (let p = 0; p < vertexPoints.length; p++) {
        const pt = vertexPoints[p];
        const a = (pt.alpha !== undefined ? pt.alpha : 1) * 0.45;
        ctx.fillStyle = `rgba(246, 244, 238, ${a})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
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
      className={`perspective-grid-canvas absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ display: 'block' }}
      aria-hidden="true"
    />
  );
}
