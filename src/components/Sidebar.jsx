import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import DitherVeil from './DitherVeil';
import { TreeNav } from '@/components/ui/tree-nav';

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, onReplayLoader }) {
  const [istTime, setIstTime] = useState('');
  const [photoSrc, setPhotoSrc] = useState('/sculpture.jpg');

  // Update real-time clock in IST (UTC+5:30)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Calculate IST time
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const istDate = new Date(utc + 3600000 * 5.5);
      
      const hours = String(istDate.getHours()).padStart(2, '0');
      const minutes = String(istDate.getMinutes()).padStart(2, '0');
      const seconds = String(istDate.getSeconds()).padStart(2, '0');
      setIstTime(`${hours}:${minutes}:${seconds} IST Gurugram`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const treeNavItems = [
    { label: 'Overview', href: '#homepage' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`portfolio-sidebar ${isMobileOpen ? 'open' : ''}`}>
        {/* Close button for mobile */}
        <button 
          className="mobile-close-btn" 
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        <div className="sidebar-content">
          {/* Profile Section */}
          <div className="profile-card relative">
            <div 
              className="avatar-wrapper"
              title="Interactive Dither Effect (Move cursor or click!)"
            >
              <DitherVeil
                src={photoSrc}
                pattern="floyd"
                pixelSize={1}
                inkColor="#FAF8F5"
                paperColor="#18181B"
                revealRadius={180}
                softness={0.6}
                linger={1}
                fit="contain"
                rimColor="#a78bfa"
                palette="duotone"
                levels={2}
                contrast={1.15}
                brightness={0}
                rim={0}
                reverse={false}
                wander={false}
                clickBurst
              />
            </div>

            <h1 className="profile-name">Krishana Gopal</h1>
            <p className="profile-title">Full Stack Web Developer</p>

            {/* Status Pill: Open to work */}
            <div className="status-badge">
              <span className="status-dot-pulse">
                <span className="status-dot"></span>
              </span>
              <span className="status-text">Open to work</span>
            </div>

            {/* Live Clock & City */}
            <div className="live-clock-badge">
              <span className="clock-dot"></span>
              <span className="clock-text">{istTime || '17:24:39 IST Gurugram'}</span>
            </div>
          </div>

          {/* Tree Navigation */}
          <div className="sidebar-nav-tree flex-1 py-1">
            <TreeNav
              items={treeNavItems}
              activeHref={`#${activeTab}`}
              onSelect={(item, event) => {
                event.preventDefault();
                const sectionId = item.href.replace('#', '');
                setActiveTab(sectionId);
                setIsMobileOpen(false);
              }}
              className="w-full"
            />
          </div>

          {/* Footer / Social Quick Links */}
          <div className="sidebar-footer">
            <div className="footer-links">
              <a href="https://www.linkedin.com/in/krishana-gopal-97a73b392/" target="_blank" rel="noreferrer" className="footer-link">
                <span>LinkedIn</span>
                <ArrowUpRight size={13} />
              </a>
              <span className="link-dot">·</span>
              <a href="https://github.com/krishanagopal" target="_blank" rel="noreferrer" className="footer-link">
                <span>GitHub</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
            <p className="copyright-text">© {new Date().getFullYear()} Krishana Gopal</p>
          </div>
        </div>
      </aside>
    </>
  );
}

