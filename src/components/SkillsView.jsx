import React from 'react';
import { ScrollCurvedLogoTrail } from './ui/scroll-curved-logo-trail';
import { Sparkles, ArrowDown } from 'lucide-react';

const TECH_ITEMS = [
  {
    id: 'html',
    name: 'HTML5',
    category: 'Markup Standard',
    color: '#e34f26',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-[#e34f26]">
        <path d="M1.5 0h21l-1.9 21.3L12 24l-8.6-2.7L1.5 0zm17.6 4.3H4.9l.4 4.5h13.3l-.5 5.5-4.1 1.2-4.1-1.2-.3-2.9H6.9l.4 5 4.7 1.3 4.7-1.3 1.1-12.1h.9V4.3z" />
      </svg>
    ),
  },
  {
    id: 'css',
    name: 'CSS3',
    category: 'Styling & Layout',
    color: '#1572b6',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-[#1572b6]">
        <path d="M1.5 0h21l-1.9 21.3L12 24l-8.6-2.7L1.5 0zm17.6 4.3H4.9l.4 4.5h13.3l-.5 5.5-4.1 1.2-4.1-1.2-.3-2.9H6.9l.4 5 4.7 1.3 4.7-1.3 1.1-12.1h.9V4.3z" />
      </svg>
    ),
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Utility Styling',
    color: '#38bdf8',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-[#38bdf8]">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
      </svg>
    ),
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Core Language',
    color: '#e2d680',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#e2d680" />
        <path d="M7 17.5c0 1.5 1 2.5 2.5 2.5 1.5 0 2.5-1 2.5-2.5V8.5h-2v9c0 .5-.3.8-.8.8s-.7-.3-.7-.8v-3H7v3.5zm7.5 2.5c2.5 0 4-1.5 4-3.5 0-1.8-1.2-2.5-2.8-3l-.7-.3c-.8-.3-1.2-.6-1.2-1.2 0-.6.5-1 1.2-1 .7 0 1.2.3 1.5 1h2c-.4-1.8-1.8-2.6-3.5-2.6-2 0-3.5 1.3-3.5 3 0 1.6 1 2.3 2.5 2.8l.8.3c1 .4 1.4.7 1.4 1.4 0 .7-.6 1.2-1.5 1.2-.9 0-1.6-.5-1.8-1.3H13c.2 1.8 1.7 3.2 3.5 3.2z" fill="#000" />
      </svg>
    ),
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Type Safety',
    color: '#3178c6',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#3178c6" />
        <path d="M12.5 8.5H6.5V11h2v8.5h2.5V11h1.5V8.5zm4.8 11.5c2.3 0 3.7-1.3 3.7-3.3 0-1.7-1.1-2.4-2.6-2.9l-.7-.2c-.7-.3-1.1-.6-1.1-1.1s.4-.9 1.1-.9c.7 0 1.1.3 1.4.9h2.2c-.3-1.7-1.7-2.6-3.5-2.6-2 0-3.4 1.2-3.4 2.9 0 1.6 1 2.2 2.4 2.7l.8.3c.9.3 1.3.6 1.3 1.3 0 .7-.6 1.1-1.4 1.1-.9 0-1.5-.4-1.7-1.2H14c.2 1.8 1.6 3 3.3 3z" fill="#fff" />
      </svg>
    ),
  },
  {
    id: 'react',
    name: 'React.js',
    category: 'UI Library',
    color: '#00d8ff',
    svg: (
      <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-full h-full">
        <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
        <g stroke="#00d8ff" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Full Stack Framework',
    color: '#ffffff',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.82 17.585l-7.05-9.117v9.117H8.5V6.415h2.27l7.26 9.387V6.415h2.29v11.17h-2.5z" />
      </svg>
    ),
  },
  {
    id: 'redux',
    name: 'Redux Toolkit',
    category: 'Global State',
    color: '#764abc',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-[#764abc]">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5v-2c2.5-.2 4-1.6 4-3.5 0-2.2-2.2-3.8-5-3.8s-5 1.6-5 3.8c0 1.9 1.5 3.3 4 3.5v2c-3.6-.3-6-2.3-6-5.5 0-3.3 3.1-5.8 7-5.8s7 2.5 7 5.8c0 3.2-2.4 5.2-6 5.5z" />
      </svg>
    ),
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Async Runtime',
    color: '#539e43',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-[#539e43]">
        <path d="M12 0L2 5.8v11.6L12 23.2l10-5.8V5.8L12 0zm7.8 16.3L12 20.8l-7.8-4.5V7.1L12 2.6l7.8 4.5v9.2z" />
      </svg>
    ),
  },
  {
    id: 'express',
    name: 'Express.js',
    category: 'REST API Engine',
    color: '#ffffff',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14h-2l3-4.5-2.8-4.5h2.1l1.8 3.1 1.8-3.1h2.1l-2.8 4.5 3 4.5h-2.1l-2-3.3-2.1 3.3z" />
      </svg>
    ),
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'NoSQL Database',
    color: '#13aa52',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-[#13aa52]">
        <path d="M12 0C11.5 1.5 8 7 8 13.5c0 4.2 2.3 7.8 4 10.5 1.7-2.7 4-6.3 4-10.5C16 7 12.5 1.5 12 0zm-.5 3.2c.2-.5.8-.5 1 0 .8 1.8 2.5 6.2 2.5 10.3 0 3.2-1.5 6-3 8.3-1.5-2.3-3-5.1-3-8.3 0-4.1 1.7-8.5 2.5-10.3z" />
      </svg>
    ),
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    category: 'Relational DB',
    color: '#336791',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-[#336791]">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-3 0-5.5-2-5.5-5s2.5-5 5.5-5 5.5 2 5.5 5-2.5 5-5 5z" />
      </svg>
    ),
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    category: 'Query Language',
    color: '#e10098',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-[#e10098]">
        <path d="M12 2L2 7.8v8.4L12 22l10-5.8V7.8L12 2zm0 2.3l7.8 4.5-3.3 1.9L12 8.3 7.5 10.7 4.2 8.8 12 4.3zM4 10.5l3.5 2-3.5 2v-4zm8 9.2l-7.8-4.5 3.3-1.9L12 15.7l4.5-2.4 3.3 1.9L12 19.7zm8-5.2l-3.5-2 3.5-2v4z" />
      </svg>
    ),
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'Containerization',
    color: '#2496ed',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-[#2496ed]">
        <path d="M13.9 8.2h2v2h-2zm-3 0h2v2h-2zm-3 0h2v2h-2zm-3 0h2v2h-2zm9-3h2v2h-2zm-3 0h2v2h-2zm-3 0h2v2h-2zm14.3 8.3c-.6-.4-1.8-.7-2.9-.2-.3-.8-.9-1.5-1.7-2l-.9-.5-.4.9c-.3.8-.3 1.7 0 2.5-.8.5-2.3.5-3 .1l-.6-.4-.4.6c-.9 1.3-2.5 2.1-4.2 2.1H3.5c-.8 0-1.5.3-2 .8-.6.6-.9 1.4-.9 2.2 0 3.3 2.7 6 6 6 5.8 0 10.8-3.7 12.5-9.1.9-.1 2.2-.4 2.8-1.5.2-.4.1-.7-.1-.9z" />
      </svg>
    ),
  },
  {
    id: 'git',
    name: 'Git',
    category: 'Version Control',
    color: '#f05032',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-[#f05032]">
        <path d="M23.5 10.8L13.2.5c-.7-.7-1.8-.7-2.5 0L8.4 2.8l3.1 3.1c.7-.2 1.6 0 2.2.6.6.6.8 1.5.6 2.2l3 3c.7-.2 1.6 0 2.2.6.8.8.8 2.2 0 3-.8.8-2.2.8-3 0-.6-.6-.8-1.5-.6-2.2l-2.8-2.8v5.8c.2.2.3.4.3.7 0 1.2-1 2.2-2.2 2.2s-2.2-1-2.2-2.2c0-.8.4-1.5 1.1-1.9V8.9c-.7-.4-1.1-1.1-1.1-1.9 0-.3.1-.6.2-.8L5.3 3.3.5 8.1c-.7.7-.7 1.8 0 2.5l10.3 10.3c.7.7 1.8.7 2.5 0l10.2-10.1z" />
      </svg>
    ),
  },
  {
    id: 'vite',
    name: 'Vite',
    category: 'Next-Gen Bundler',
    color: '#646cff',
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-[#646cff]">
        <path d="M23.5 3.3L12.7 23.5c-.3.6-1.1.6-1.4 0L.5 3.3c-.4-.7.1-1.5.9-1.5h21.2c.8 0 1.3.8.9 1.5zm-11.5 3L8.8 12.5h3.4l-1.7 5.5 5.2-7h-3.4l2.2-4.7H12z" />
      </svg>
    ),
  },
];

export default function SkillsView() {
  return (
    <div className="skills-view relative w-full overflow-hidden select-none pt-12 pb-16 px-6 sm:px-10 lg:px-14">
      {/* Clean Minimal Header */}
      <div className="section-header mb-2 relative z-20">
        <span className="section-tag inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-neutral-300">
          <Sparkles size={13} className="text-[#e2d680]" />
          Skills & Tech Stack
        </span>
        <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mt-3">
          Technologies
        </h2>
        <p className="section-subtitle text-neutral-400 text-sm sm:text-base max-w-[540px] mt-1.5 flex items-center gap-2">
          <span>Scroll to guide the tech stack ribbon</span>
          <ArrowDown size={14} className="text-[#e2d680] animate-bounce" />
        </p>
      </div>

      {/* On-Scroll Curved Logo Trail */}
      <div className="relative -mt-6 sm:-mt-10 md:-mt-12 w-full">
        <ScrollCurvedLogoTrail items={TECH_ITEMS} />
      </div>
    </div>
  );
}
