import React from 'react';
import PerspectiveGridBackground from './PerspectiveGridBackground';
import { AsciiGlitchRipple } from './ui/ascii-glitch-ripple';
import './AboutView.css';

export default function AboutView() {
  return (
    <div className="about-section-container">
      {/* Seamless atmospheric blend between Hero and About */}
      <div className="about-blend-atmosphere" aria-hidden="true" />

      {/* 3D Perspective Wireframe Grid Room Background */}
      <PerspectiveGridBackground />

      {/* Text displayed directly over the 3D grid - not on any card */}
      <div className="about-content-wrapper">
        <div className="about-content">
          <AsciiGlitchRipple as="h2" className="about-title">
            About
          </AsciiGlitchRipple>

          <ul className="about-bullet-list">
            <li className="about-bullet-item">
              <span className="about-bullet-dot">•</span>
              <span>
                I'm a{' '}
                <AsciiGlitchRipple as="strong" className="about-highlight">
                  Web Developer
                </AsciiGlitchRipple>{' '}
                &amp;{' '}
                <AsciiGlitchRipple as="strong" className="about-highlight">
                  Mechanical Student
                </AsciiGlitchRipple>{' '}
                obsessed with creating immersive digital experiences.
              </span>
            </li>

            <li className="about-bullet-item">
              <span className="about-bullet-dot">•</span>
              <span>
                I design and develop modern interfaces with{' '}
                <AsciiGlitchRipple as="strong" className="about-highlight">
                  React, TypeScript, Motion, and WebGL / GSAP
                </AsciiGlitchRipple>
                , focusing on interaction, storytelling, and fluid user experiences.
              </span>
            </li>

            <li className="about-bullet-item">
              <span className="about-bullet-dot">•</span>
              <span>
                I also work across the backend with{' '}
                <AsciiGlitchRipple as="strong" className="about-highlight">
                  Node.js, Bun, PostgreSQL, and fast APIs
                </AsciiGlitchRipple>{' '}
                to build fast, scalable, full-stack applications.
              </span>
            </li>

            <li className="about-bullet-item">
              <span className="about-bullet-dot">•</span>
              <span>
                I enjoy turning complex ideas and mechanical intuition into clean, engaging products that balance{' '}
                <AsciiGlitchRipple as="strong" className="about-highlight">
                  aesthetics with performance
                </AsciiGlitchRipple>
                .
              </span>
            </li>

            <li className="about-bullet-item">
              <span className="about-bullet-dot">•</span>
              <span>
                Beyond the code:{' '}
                <AsciiGlitchRipple as="strong" className="about-highlight">
                  sketching, badminton &amp; cricket
                </AsciiGlitchRipple>{' '}
                — my excuse for touching grass 🌱 and making things work without a keyboard.
              </span>
            </li>
          </ul>

          {/* EXPERIENCE SECTION DIRECTLY BELOW */}
          <div id="experience" className="about-experience-section">
            <div className="experience-header-wrapper">
              <AsciiGlitchRipple as="h3" className="experience-heading">
                EXPERIENCE
              </AsciiGlitchRipple>
              <div className="experience-divider" aria-hidden="true" />
            </div>

            <div className="experience-job-item">
              <div className="experience-job-header-top">
                <span>
                  <AsciiGlitchRipple as="span" className="font-bold">
                    BUYOK (Startup)
                  </AsciiGlitchRipple>
                </span>
                <span>Remote</span>
              </div>

              <div className="experience-job-header-sub">
                <span>UI &amp; AI Engineer Intern</span>
                <span>July 2025 – Present</span>
              </div>

              <ul className="experience-bullet-list">
                <li className="experience-bullet-item">
                  <span className="experience-bullet-dot">•</span>
                  <span>
                    Developed responsive production UIs using{' '}
                    <AsciiGlitchRipple as="strong" className="about-highlight">
                      React.js, JavaScript, and Tailwind CSS
                    </AsciiGlitchRipple>
                    , translating Figma designs into reusable components.
                  </span>
                </li>

                <li className="experience-bullet-item">
                  <span className="experience-bullet-dot">•</span>
                  <span>
                    Integrated{' '}
                    <AsciiGlitchRipple as="strong" className="about-highlight">
                      REST APIs and AI-powered features
                    </AsciiGlitchRipple>{' '}
                    into frontend workflows with effective data handling, validation, and error states.
                  </span>
                </li>

                <li className="experience-bullet-item">
                  <span className="experience-bullet-dot">•</span>
                  <span>
                    Worked on Generative AI workflows using{' '}
                    <AsciiGlitchRipple as="strong" className="about-highlight">
                      LLMs, LangChain, LangGraph, and RAG
                    </AsciiGlitchRipple>{' '}
                    to enhance product functionality.
                  </span>
                </li>

                <li className="experience-bullet-item">
                  <span className="experience-bullet-dot">•</span>
                  <span>
                    Collaborated with the development team to build features, resolve UI issues, and improve overall user experience.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth Gradient Transition from Yellow into Black */}
      <div className="about-bottom-transition" aria-hidden="true" />
    </div>
  );
}
