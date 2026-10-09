import React, { useState, useRef } from 'react';
import { MapPin, ArrowUpRight, FileText, Eye } from 'lucide-react';
import TechText from './TechText';
import { CursorDrivenParticleTypography } from './ui/cursor-driven-particles-typography';
import FallingText from './ui/FallingText';

export default function HomeHero({ setActiveTab }) {
  const [pulseSpeed, setPulseSpeed] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const heroRef = useRef(null);
  const fallingTextRef = useRef(null);

  const handleKineticReset = () => {
    setIsSpinning(true);
    setPulseSpeed(4);
    if (fallingTextRef.current?.reset) {
      fallingTextRef.current.reset();
    }
    setTimeout(() => {
      setIsSpinning(false);
      setPulseSpeed(1);
    }, 900);
  };

  return (
    <div ref={heroRef} className="hero-container bg-transparent relative overflow-hidden">

        {/* Hero Content Layer */}
        <div className="hero-content">
          {/* Main Headline */}
          <div className="hero-typography">
            <div className="hero-tech-title">
              <span className="sr-only">Hi, there</span>
              <TechText
                text="Hi, there"
                fontWeight={800}
                fontSize={75}
                reveal="letter"
                dashLength={4}
                dashGap={2}
                specks={15}
                fontFamily="'Playfair Display', 'Instrument Serif', Georgia, serif"
                color="#FFFFFF"
                accentColor="#C83737"

                letterSpacing={-0.035}
                reach={180}
                softness={0.7}
                strokeWidth={1.5}
                speed={1}
                lineStyle="dashed"
                selection
                labels
                draggable
                sweep
                align="left"
                padLeft={6}
              />
            </div>
            <h2 className="headline-line outlined">I engineer web apps</h2>

            {/* Interactive Particle Typography: Design / Code / Ship stacked vertically */}
            <div className="hero-particle-tagline w-full max-w-[340px] h-[165px] sm:h-[185px] md:h-[210px] mt-2 mb-3">
              <CursorDrivenParticleTypography
                text={['Design', 'Code', 'Ship']}
                fontSize={54}
                lineGap={1.22}
                align="left"
                color="#C83737"
                particleSize={1.5}
                particleDensity={4}
                dispersionStrength={16}
                returnSpeed={0.08}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Location Badge */}
          <div className="hero-location">
            <MapPin size={18} className="location-pin-icon" />
            <span>Gurugram, India</span>
          </div>


          {/* Call to action pills with Matter.js physics falling effect across the full first page */}
          <FallingText
            ref={fallingTextRef}
            boundaryRef={heroRef}
            trigger="hover"
            gravity={0.75}
            mouseConstraintStiffness={0.5}
            showReset={false}
            className="hero-falling-actions-wrap !w-full max-w-[640px]"
          >
            <div className="hero-actions">
              <a
                href="https://www.linkedin.com/in/krishana-gopal-97a73b392/"
                target="_blank"
                rel="noreferrer"
                className="action-pill-yellow falling-item"
              >
                <span>LinkedIn</span>
                <ArrowUpRight size={16} />
              </a>

              <a
                href="https://github.com/krishanagopal"
                target="_blank"
                rel="noreferrer"
                className="action-pill-yellow falling-item"
              >
                <span>GitHub</span>
                <ArrowUpRight size={16} />
              </a>

              <a
                href="/Krishana_Gopal_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="action-pill-yellow falling-item"
                title="Open Krishana Gopal's Resume"
              >
                <span>Resume</span>
                <FileText size={16} />
              </a>

              <button
                onClick={() => setActiveTab('projects')}
                className="action-pill-glass falling-item"
              >
                <Eye size={16} />
                <span>Explore Work</span>
              </button>
            </div>
          </FallingText>
        </div>

        {/* Bottom Right Interactive Kinetic Visualizer Circle (Acts as Reset Button) */}
        <div
          className="bottom-right-kinetic-widget"
          onClick={handleKineticReset}
          title="Click to reset buttons"
          role="button"
          tabIndex={0}
        >
          <div
            className={`kinetic-ring-outer ${isSpinning ? 'spinning' : ''}`}
            style={{ animationDuration: `${6 / pulseSpeed}s` }}
          >
            <div className="kinetic-ring-inner">
              <div className="kinetic-core-dot"></div>
            </div>
          </div>
        </div>
      </div>
  );
}
