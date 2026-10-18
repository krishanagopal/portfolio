import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import HomeHero from './components/HomeHero';
import ProjectsView from './components/ProjectsView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import KineticGrid from './components/ui/kinetic-grid';
import Preloader from './components/Preloader';
import GlowCursor from './components/ui/GlowCursor';
import { Menu } from 'lucide-react';
import './App.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('homepage');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const layoutRef = useRef(null);

  // Permanently maintain dark theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
    try {
      localStorage.setItem('portfolio-theme', 'dark');
    } catch {
      // ignore
    }
  }, []);

  // Smooth scroll to a section on click without page reload or redirection
  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll spy to update active tab in sidebar as user scrolls through sections
  useEffect(() => {
    const scrollContainer = document.querySelector('.portfolio-app-layout');
    const sections = ['homepage', 'about', 'projects', 'contact'];

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the top of the section is within upper 45% of viewport
          if (rect.top <= windowHeight * 0.45) {
            setActiveTab(id);
            break;
          }
        }
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Hide mobile navbar on scroll down, reveal on scroll up
  useEffect(() => {
    const getScrollTop = () => {
      const container = layoutRef.current;
      const containerScroll = container ? container.scrollTop : 0;
      const windowScroll = window.scrollY || document.documentElement.scrollTop || 0;
      return Math.max(containerScroll, windowScroll);
    };

    let ticking = false;

    const handleMobileNavScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = getScrollTop();
          const diff = currentY - lastScrollYRef.current;

          // Always visible at the very top
          if (currentY <= 30) {
            setIsHeaderHidden(false);
          } else if (diff > 8) {
            // Scrolling down -> hide navbar smoothly
            setIsHeaderHidden(true);
          } else if (diff < -10) {
            // Scrolling up -> show navbar smoothly
            setIsHeaderHidden(false);
          }

          lastScrollYRef.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    const container = layoutRef.current;
    if (container) {
      container.addEventListener('scroll', handleMobileNavScroll, { passive: true });
    }
    window.addEventListener('scroll', handleMobileNavScroll, { passive: true });

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleMobileNavScroll);
      }
      window.removeEventListener('scroll', handleMobileNavScroll);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <Preloader onComplete={() => setIsLoading(false)} />
      )}

      {/* Interactive WebGL Glowing Cursor Beam Trail */}
      <GlowCursor
        fixed={true}
        color="#FACC15"
        secondaryColor="#EAB308"
        trailLength={40}
        trailWidth={8}
        trailTaper={0.8}
        followSpeed={0.16}
        glowIntensity={1.9}
        glowSpread={1.2}
        hotspot={0.65}
        brightness={1.25}
        opacity={1}
        pulseSpeed={1.1}
        noiseStrength={0.035}
        idleFade
        idleTimeout={700}
        fadeDuration={900}
        blendMode="normal"
      />

      <div ref={layoutRef} className="portfolio-app-layout">
        {/* Mobile Top Header */}
        <header className={`mobile-header ${isHeaderHidden && !isMobileOpen ? 'hidden-on-scroll' : ''}`}>
          <div className="mobile-brand">
            <img src="/sculpture.jpg" alt="Krishana Gopal" className="mobile-avatar" />
            <div>
              <div className="mobile-name">Krishana Gopal</div>
              <div className="mobile-role">Web Developer</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="mobile-hamburger-btn" 
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </header>

        {/* Upper Split Layout: Sticky Sidebar + Upper Content (Hero & Projects) */}
        <div className="portfolio-split-layout">
          {/* Persistent Left Sidebar - Sticky within split layout */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={scrollToSection}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            onReplayLoader={() => setIsLoading(true)}
          />


          {/* Main Content Area - Continuous scroll through all sections */}
          <main className="portfolio-main-area" id="main-content">
            {/* Background kinetic grid: fades up cleanly before the section ends to prevent lines intersecting */}
            <div 
              className="absolute top-0 left-0 right-0 pointer-events-none z-0 overflow-hidden"
              style={{ height: '100vh' }}
            >
              <KineticGrid
                className="w-full h-full !min-h-0"
                globalColor="transparent"
                showBottomFade={false}
                maskGradient="linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) calc(100% - 220px), rgba(0,0,0,0) calc(100% - 20px))"
              />
            </div>

            <section id="homepage" className="portfolio-section relative z-10 bg-transparent">
              <HomeHero setActiveTab={scrollToSection} />
            </section>
            <section id="about" className="portfolio-section relative z-10 bg-transparent">
              <AboutView setActiveTab={scrollToSection} scrollContainerRef={layoutRef} />
            </section>
            <section id="projects" className="portfolio-section relative z-10 bg-transparent">
              <ProjectsView setActiveTab={scrollToSection} />
            </section>
          </main>
        </div>

        {/* Fullscreen Last Page: Contact Section (Covers complete 100vw x 100vh screen) */}
        <section id="contact" className="portfolio-contact-fullscreen">
          <ContactView setActiveTab={scrollToSection} />
        </section>
      </div>
    </>
  );
}
