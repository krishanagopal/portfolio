import React, { useState } from 'react';
import { EditorialContactLanyard } from './ui/editorial-contact-lanyard';
import WaveGridBackground from './ui/wave-grid-background';
import { Volume2, VolumeX } from 'lucide-react';
import './ContactView.css';

export default function ContactView() {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="contact-editorial-view relative w-full h-full min-h-screen text-black overflow-hidden select-none">
      {/* 3D Wave Grid Interactive Background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <WaveGridBackground
          colorBase="#EAB308"
          colorHigh="#FEF08A"
          gridSize={40}
          waveAmplitude={0.4}
          waveSpeed={6.0}
          waveFrequency={1.2}
          waveWidth={3.0}
          waveMaxHeight={0.4}
          waveJitter={0.2}
          autoAnimate={true}
          vignette={true}
        />
      </div>

      {/* 2-Strand Lanyard extending straight from the top ceiling edge */}
      <EditorialContactLanyard
        nameFirst="Krishana"
        nameLast="Gopal"
        role="Full Stack Web & Systems Engineer"
        email="gopalkumardevna@gmail.com"
        githubUrl="https://github.com/krishanagopal"
        linkedinUrl="https://www.linkedin.com/in/krishana-gopal-97a73b392/"
        resumeUrl="/Krishana_Gopal_Resume.pdf"
        location="Gurugram, India"
        anchorX="50%"
        anchorY={-5}
        ropeLength={180}
        stagePosition="absolute"
      />

      {/* Top Editorial Meta Row: 30-40px gap from top */}
      <div className="contact-top-row absolute top-0 left-0 right-0 z-30 w-full px-7 sm:px-10 md:px-14 pt-[34px] flex items-start justify-between pointer-events-none">
        {/* Top Left Quote / Subtitle */}
        <div className="contact-top-left max-w-[280px] sm:max-w-[320px] pointer-events-auto">
          <p className="text-[11.5px] sm:text-[12.5px] font-mono leading-relaxed text-[#1C1917]/80 font-medium">
            I engineer web products and the stories behind them{' '}
            <span className="inline-block text-[#1C1917]/45 font-sans font-bold ml-0.5">
              [→]
            </span>
          </p>
        </div>

        {/* Top Right Current Status */}
        <div className="contact-top-right text-right max-w-[280px] sm:max-w-[340px] pointer-events-auto">
          <p className="text-[11px] sm:text-[12px] font-mono leading-relaxed text-[#1C1917]/75 font-medium">
            Currently based in Gurugram, India.<br />
            Open for Engineering Roles & Collaborations.
          </p>
        </div>
      </div>

      {/* Massive Cropped Editorial Typography placed behind the ID card */}
      <div className="contact-giant-typography-wrapper absolute bottom-0 left-0 right-0 z-10 w-full overflow-hidden pointer-events-none flex justify-center">
        <h1 className="contact-giant-name">
          Krishana Gopal
        </h1>
      </div>

      {/* Bottom Floating Audio Control */}
      <div className="contact-bottom-controls absolute bottom-6 right-6 sm:right-10 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsMuted((prev) => !prev)}
          className="contact-sound-btn flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900/80 hover:bg-neutral-900 text-white backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105"
          title={isMuted ? "Sound muted" : "Sound active"}
          aria-label="Sound toggle"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}
