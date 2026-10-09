import React, { useRef, useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import Matter from 'matter-js';
import './FallingText.css';

const FallingText = forwardRef(({
  className = '',
  text = '',
  highlightWords = [],
  highlightClass = 'highlighted',
  trigger = 'auto', // 'auto' | 'scroll' | 'click' | 'hover'
  backgroundColor = 'transparent',
  wireframes = false,
  gravity = 0.8,
  mouseConstraintStiffness = 0.4,
  fontSize = '1rem',
  children,
  minHeight = 'auto',
  showReset = false,
  onReset,
  boundaryRef = null,
  resetLabel = '↺ Reset'
}, ref) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const portalItemsRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const renderRef = useRef(null);
  const animFrameRef = useRef(null);
  const dragDistRef = useRef(0);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const initialPositionsRef = useRef([]);

  const [effectStarted, setEffectStarted] = useState(false);
  const [isFallen, setIsFallen] = useState(false);

  // If text string is provided, build word spans
  useEffect(() => {
    if (!text || children || !textRef.current) return;
    const words = text.split(' ');
    const newHTML = words
      .map((word) => {
        const isHighlighted = highlightWords.some((hw) => word.startsWith(hw));
        return `<span class="word ${isHighlighted ? highlightClass : ''}">${word}</span>`;
      })
      .join(' ');
    textRef.current.innerHTML = newHTML;
  }, [text, children, highlightWords, highlightClass]);

  // Trigger observer / listeners
  useEffect(() => {
    if (trigger === 'auto') {
      setEffectStarted(true);
      return;
    }
    if (trigger === 'scroll' && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  const handleTrigger = useCallback(() => {
    if (effectStarted) return;
    if (trigger === 'click' || trigger === 'hover') {
      // Calculate initial element coordinates before portaling
      const boundary = boundaryRef?.current || containerRef.current;
      const hostEl = textRef.current || containerRef.current;
      if (boundary && hostEl) {
        const boundaryRect = boundary.getBoundingClientRect();
        const targetQuery = children
          ? '.falling-item, .hero-falling-pill, .link-falling-item, a, button'
          : '.word';
        let rawElements = Array.from(hostEl.querySelectorAll(targetQuery));
        if (rawElements.length === 0) {
          rawElements = Array.from(hostEl.children);
        }
        const targetElements = rawElements.filter(
          (el) => !rawElements.some((parent) => parent !== el && parent.contains(el))
        );

        initialPositionsRef.current = targetElements.map((elem) => {
          const rect = elem.getBoundingClientRect();
          return {
            x: rect.left - boundaryRect.left + rect.width / 2,
            y: rect.top - boundaryRect.top + rect.height / 2,
            width: rect.width,
            height: rect.height
          };
        });
      }
      setEffectStarted(true);
    }
  }, [effectStarted, trigger, boundaryRef, children]);

  // Reset function
  const resetPhysics = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (renderRef.current) {
      Matter.Render.stop(renderRef.current);
      if (renderRef.current.canvas && canvasContainerRef.current) {
        try {
          canvasContainerRef.current.removeChild(renderRef.current.canvas);
        } catch {
          // ignore
        }
      }
    }
    if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
    if (engineRef.current) {
      Matter.World.clear(engineRef.current.world);
      Matter.Engine.clear(engineRef.current);
    }

    const resetEl = (root) => {
      if (!root) return;
      const elems = root.querySelectorAll('.word, .falling-item, .hero-falling-pill, .link-falling-item, a, button');
      elems.forEach((elem) => {
        elem.style.position = '';
        elem.style.left = '';
        elem.style.top = '';
        elem.style.transform = '';
      });
    };

    resetEl(textRef.current);
    resetEl(portalItemsRef.current);

    setEffectStarted(false);
    setIsFallen(false);
    if (onReset) onReset();
  }, [onReset]);

  useImperativeHandle(ref, () => ({
    reset: resetPhysics,
    isFallen,
    effectStarted,
  }), [resetPhysics, isFallen, effectStarted]);

  useEffect(() => {
    if (!effectStarted) return;

    const boundary = boundaryRef?.current || containerRef.current;
    const activeTextHost = (boundaryRef?.current && portalItemsRef.current) || textRef.current;
    if (!boundary || !activeTextHost) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

    const boundaryRect = boundary.getBoundingClientRect();
    const width = boundaryRect.width;
    const height = boundaryRect.height;

    if (width <= 0 || height <= 0) return;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;
    engineRef.current = engine;

    const render = Render.create({
      element: canvasContainerRef.current || boundary,
      engine,
      options: {
        width,
        height,
        background: backgroundColor,
        wireframes
      }
    });
    renderRef.current = render;

    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    };

    // Ground floor at bottom of boundary, walls on left/right, ceiling on top
    const floor = Bodies.rectangle(width / 2, height + 15, width + 400, 30, boundaryOptions);
    const leftWall = Bodies.rectangle(-15, height / 2, 30, height * 2 + 400, boundaryOptions);
    const rightWall = Bodies.rectangle(width + 15, height / 2, 30, height * 2 + 400, boundaryOptions);
    const ceiling = Bodies.rectangle(width / 2, -60, width + 400, 30, boundaryOptions);

    const targetQuery = children
      ? '.falling-item, .hero-falling-pill, .link-falling-item, a, button'
      : '.word';
    let rawElements = Array.from(activeTextHost.querySelectorAll(targetQuery));
    if (rawElements.length === 0) {
      rawElements = Array.from(activeTextHost.children);
    }
    const targetElements = rawElements.filter(
      (el) => !rawElements.some((parent) => parent !== el && parent.contains(el))
    );

    if (targetElements.length === 0) return;

    const bodies = targetElements.map((elem, idx) => {
      const saved = initialPositionsRef.current[idx];
      let x = saved?.x;
      let y = saved?.y;
      let w = saved?.width;
      let h = saved?.height;

      if (!x || !y) {
        const rect = elem.getBoundingClientRect();
        x = rect.left - boundaryRect.left + rect.width / 2;
        y = rect.top - boundaryRect.top + rect.height / 2;
        w = rect.width;
        h = rect.height;
      }

      const body = Bodies.rectangle(x, y, w || 100, h || 40, {
        render: { fillStyle: 'transparent' },
        restitution: 0.72,
        frictionAir: 0.015,
        friction: 0.15,
        chamfer: { radius: Math.min((h || 40) / 2, 16) }
      });

      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 4,
        y: Math.random() * 2
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06);

      return { elem, body };
    });

    bodies.forEach(({ elem, body }) => {
      elem.style.position = 'absolute';
      elem.style.left = '0px';
      elem.style.top = '0px';
      elem.style.willChange = 'transform';
      elem.style.userSelect = 'none';
      elem.style.pointerEvents = 'auto';
      elem.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) translate(-50%, -50%) rotate(${body.angle}rad)`;
    });

    const mouse = Mouse.create(boundary);
    mouse.element = boundary;
    mouse.pixelRatio = window.devicePixelRatio || 1;

    // Matter.js by default intercepts 'wheel' and 'touchmove' calling event.preventDefault(),
    // which completely breaks page scrolling. Remove them immediately so the page scrolls freely.
    try {
      boundary.removeEventListener('wheel', mouse.mousewheel);
      boundary.removeEventListener('touchmove', mouse.mousemove);
      boundary.removeEventListener('touchstart', mouse.mousedown);
      boundary.removeEventListener('touchend', mouse.mouseup);
    } catch {
      // ignore
    }
    mouse.mousewheel = () => {};

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false }
      }
    });
    render.mouse = mouse;

    World.add(engine.world, [floor, leftWall, rightWall, ceiling, mouseConstraint, ...bodies.map((b) => b.body)]);

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
    Render.run(render);

    const updateLoop = () => {
      bodies.forEach(({ body, elem }) => {
        const { x, y } = body.position;
        elem.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${body.angle}rad)`;
      });
      Matter.Engine.update(engine);
      animFrameRef.current = requestAnimationFrame(updateLoop);
    };
    updateLoop();
    setIsFallen(true);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas && canvasContainerRef.current) {
        try {
          canvasContainerRef.current.removeChild(render.canvas);
        } catch {
          // ignore
        }
      }
      World.clear(engine.world);
      Engine.clear(engine);
      try {
        boundary.removeEventListener('mousemove', mouse.mousemove);
        boundary.removeEventListener('mousedown', mouse.mousedown);
        boundary.removeEventListener('mouseup', mouse.mouseup);
        boundary.removeEventListener('wheel', mouse.mousewheel);
        boundary.removeEventListener('touchmove', mouse.mousemove);
        boundary.removeEventListener('touchstart', mouse.mousedown);
        boundary.removeEventListener('touchend', mouse.mouseup);
      } catch {
        // ignore
      }
    };
  }, [effectStarted, gravity, wireframes, backgroundColor, mouseConstraintStiffness, children, boundaryRef]);

  // Pointer drag tracking to ensure genuine clicks still trigger links/buttons
  const onPointerDown = (e) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    dragDistRef.current = 0;
  };

  const onPointerMove = (e) => {
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    dragDistRef.current = Math.hypot(dx, dy);
  };

  const onClickCapture = (e) => {
    // If the user was dragging the body with Matter.js (>8px), prevent link navigation / click
    if (dragDistRef.current > 8) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // If boundaryRef is supplied, portal physics items directly into the boundary (whole section)
  const isPortaled = Boolean(boundaryRef?.current && effectStarted);

  return (
    <>
      <div
        ref={containerRef}
        className={`falling-text-container ${className}`}
        onClick={trigger === 'click' ? handleTrigger : undefined}
        onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClickCapture={onClickCapture}
        style={{
          position: 'relative',
          minHeight: effectStarted ? minHeight : undefined,
          overflow: 'visible'
        }}
      >
        {/* If portaled, keep a placeholder space so the page text doesn't shift */}
        {isPortaled ? (
          <div className="hero-actions-placeholder opacity-0 pointer-events-none min-h-[48px]">
            {children}
          </div>
        ) : (
          <div
            ref={textRef}
            className="falling-text-target"
            style={{
              fontSize: children ? undefined : fontSize,
              lineHeight: children ? undefined : 1.4
            }}
          >
            {children}
          </div>
        )}

        {/* Local canvas for standalone non-portaled mode */}
        {!isPortaled && <div ref={canvasContainerRef} className="falling-text-canvas" />}
      </div>

      {/* Portaled layer covering the entire boundary (e.g. whole hero first page) */}
      {isPortaled &&
        createPortal(
          <div
            className="hero-physics-boundary-layer absolute inset-0 pointer-events-none z-30 w-full h-full overflow-hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onClickCapture={onClickCapture}
          >
            <div ref={canvasContainerRef} className="falling-text-canvas" />
            <div ref={portalItemsRef} className="w-full h-full relative pointer-events-none">
              {children}
            </div>
          </div>,
          boundaryRef.current
        )}
    </>
  );
});

FallingText.displayName = 'FallingText';

export default FallingText;
