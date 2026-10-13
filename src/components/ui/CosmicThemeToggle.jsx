import React, { useState } from 'react';
import './CosmicThemeToggle.css';

export default function CosmicThemeToggle({ theme, toggleTheme, className = '' }) {
  const [ripple, setRipple] = useState(null);
  const isDark = theme === 'dark';

  const handleClick = (e) => {
    // Get click position for origin of radial screen ripple
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const newMode = isDark ? 'to-light' : 'to-dark';
    
    // Set ripple animation state
    setRipple({ x, y, mode: newMode, key: Date.now() });

    // Execute theme toggle
    if (toggleTheme) {
      toggleTheme();
    }

    // Clean up ripple element after animation finishes
    setTimeout(() => {
      setRipple(null);
    }, 750);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`cosmic-toggle-btn ${isDark ? 'is-dark' : 'is-light'} ${className}`}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle theme mode"
      >
        {/* Orbiting Stardust Particles in Dark Mode */}
        <div className="cosmic-stardust-ring" aria-hidden="true">
          <span className="cosmic-particle"></span>
          <span className="cosmic-particle"></span>
          <span className="cosmic-particle"></span>
          <span className="cosmic-particle"></span>
        </div>

        {/* Morphing Sun/Moon SVG Icon */}
        <div className="cosmic-icon-wrapper">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cosmic-svg-icon"
          >
            <mask id="cosmic-moon-mask">
              <rect x="0" y="0" width="24" height="24" fill="white" />
              <circle className="cosmic-moon-mask-circle" r="8" fill="black" />
            </mask>

            {/* Central Circle (Sun or Moon Body) */}
            <circle
              className="cosmic-sun-center"
              cx="12"
              cy="12"
              r={isDark ? 9 : 5}
              mask="url(#cosmic-moon-mask)"
            />

            {/* Sun Rays */}
            <g className="cosmic-sun-rays" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
          </svg>
        </div>
      </button>

      {/* Radial Screen Ripple Transition Overlay */}
      {ripple && (
        <div className="cosmic-ripple-overlay">
          <div
            key={ripple.key}
            className={`cosmic-ripple-circle ${ripple.mode}`}
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
            }}
          />
        </div>
      )}
    </>
  );
}
