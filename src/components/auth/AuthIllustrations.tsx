import React from 'react';

// Illustration 1: Resume Screening
export const ResumeScreeningIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.8"/>
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="48" height="48" rx="8" fill="url(#grad1)" stroke="white" strokeWidth="2"/>
    <path d="M16 20h32M16 28h24M16 36h20M16 44h16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="44" cy="28" r="3" fill="white"/>
    <circle cx="40" cy="36" r="2" fill="white"/>
    <circle cx="36" cy="44" r="1.5" fill="white"/>
  </svg>
);

// Illustration 2: AI Brain
export const AIBrainIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.8"/>
      </linearGradient>
    </defs>
    <path d="M32 12c-8 0-16 6-16 16 0 8 4 12 8 16 4 4 8 8 8 16" stroke="url(#grad2)" strokeWidth="3" fill="none"/>
    <path d="M32 12c8 0 16 6 16 16 0 8-4 12-8 16-4 4-8 8-8 16" stroke="url(#grad2)" strokeWidth="3" fill="none"/>
    <circle cx="32" cy="28" r="4" fill="white"/>
    <circle cx="24" cy="36" r="2" fill="white"/>
    <circle cx="40" cy="36" r="2" fill="white"/>
    <circle cx="28" cy="44" r="1.5" fill="white"/>
    <circle cx="36" cy="44" r="1.5" fill="white"/>
  </svg>
);

// Illustration 3: Team Collaboration
export const TeamIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.8"/>
      </linearGradient>
    </defs>
    <circle cx="32" cy="20" r="8" fill="url(#grad3)" stroke="white" strokeWidth="2"/>
    <circle cx="16" cy="40" r="6" fill="url(#grad3)" stroke="white" strokeWidth="2"/>
    <circle cx="48" cy="40" r="6" fill="url(#grad3)" stroke="white" strokeWidth="2"/>
    <path d="M24 36l8-8M40 36l-8-8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="32" cy="20" r="3" fill="white"/>
    <circle cx="16" cy="40" r="2" fill="white"/>
    <circle cx="48" cy="40" r="2" fill="white"/>
  </svg>
);

// Illustration 4: Analytics Dashboard
export const AnalyticsIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.8"/>
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="48" height="48" rx="8" fill="url(#grad4)" stroke="white" strokeWidth="2"/>
    <path d="M16 48V32M24 48V24M32 48V28M40 48V20M48 48V36" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="16" cy="32" r="2" fill="white"/>
    <circle cx="24" cy="24" r="2" fill="white"/>
    <circle cx="32" cy="28" r="2" fill="white"/>
    <circle cx="40" cy="20" r="2" fill="white"/>
    <circle cx="48" cy="36" r="2" fill="white"/>
  </svg>
);

// Illustration 5: Success/Checkmark
export const SuccessIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.8"/>
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="24" fill="url(#grad5)" stroke="white" strokeWidth="2"/>
    <path d="M20 32l8 8 16-16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Background decorative elements
export const DecorativeShapes: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Floating circles */}
    <div className="absolute top-10 right-10 w-20 h-20 bg-white/5 rounded-full animate-pulse" />
    <div className="absolute bottom-20 left-8 w-12 h-12 bg-white/3 rounded-full animate-pulse delay-1000" />
    <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-white/4 rounded-full animate-pulse delay-500" />
    
    {/* Abstract shapes */}
    <svg className="absolute top-0 right-0 w-32 h-32 text-white/5" viewBox="0 0 128 128">
      <path d="M64 0L128 64L64 128L0 64Z" fill="currentColor" />
    </svg>
    <svg className="absolute bottom-0 left-0 w-24 h-24 text-white/3" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r="40" fill="currentColor" />
    </svg>
  </div>
);

export default {
  ResumeScreeningIcon,
  AIBrainIcon,
  TeamIcon,
  AnalyticsIcon,
  SuccessIcon,
  DecorativeShapes
};
