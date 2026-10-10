import React from 'react';
import { Sparkles, Calendar, Users, Video, ExternalLink } from 'lucide-react';

export default function WorkshopsView() {
  const workshops = [
    {
      title: 'Mastering Rive: State Machines & Interactive UI',
      type: 'Hands-on Masterclass',
      duration: '4 Hours',
      attendees: '500+ Alumni',
      description: 'Learn how to build interactive vector components with dynamic inputs, blend states, and export production-ready assets for React, Flutter, and iOS.',
      tags: ['Rive', 'State Machines', 'Runtime Integration']
    },
    {
      title: 'Motion Systems for Scalable Design Systems',
      type: 'Executive Workshop',
      duration: 'Full Day',
      attendees: 'Design Teams & Leads',
      description: 'How to codify timing curves, duration tokens, spatial choreography, and documentation so that entire engineering teams implement motion consistently.',
      tags: ['Design Tokens', 'Figma', 'System Architecture']
    },
    {
      title: 'Micro-Interactions That Convert',
      type: 'Interactive Seminar',
      duration: '2 Hours',
      attendees: 'Product Managers & Designers',
      description: 'Analyzing cognitive load, mental models, and rewarding tactile visual feedback to guide users gracefully through complex interfaces.',
      tags: ['UX Psychology', 'Micro-Interactions', 'Case Studies']
    }
  ];

  return (
    <div className="workshops-view">
      <div className="section-header">
        <span className="section-tag">
          <Sparkles size={14} /> Knowledge Sharing
        </span>
        <h2 className="section-title">Workshops &amp; Masterclasses</h2>
        <p className="section-subtitle">
          Empowering product teams and designers with actionable kinetic principles and next-generation motion workflows.
        </p>
      </div>

      <div className="workshops-list">
        {workshops.map((ws, i) => (
          <div key={i} className="workshop-card">
            <div className="workshop-header">
              <span className="workshop-badge">{ws.type}</span>
              <div className="workshop-meta-row">
                <span className="meta-badge"><Calendar size={13} /> {ws.duration}</span>
                <span className="meta-badge"><Users size={13} /> {ws.attendees}</span>
              </div>
            </div>

            <h3 className="workshop-title">{ws.title}</h3>
            <p className="workshop-desc">{ws.description}</p>

            <div className="workshop-footer">
              <div className="workshop-tags">
                {ws.tags.map((t, idx) => (
                  <span key={idx} className="tech-tag">{t}</span>
                ))}
              </div>
              <button 
                className="action-pill-glass-sm"
                onClick={() => alert(`Registration/Inquiry for "${ws.title}"`)}
              >
                <span>Request Session</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
