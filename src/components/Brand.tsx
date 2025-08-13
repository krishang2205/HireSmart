import React from 'react';

export const BrandLogo: React.FC<{ className?: string } > = ({ className = 'h-8 w-8' }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <linearGradient id="hs-g" x1="6" y1="42" x2="42" y2="6" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6D28D9"/>
        <stop offset="50%" stopColor="#4F46E5"/>
        <stop offset="100%" stopColor="#22D3EE"/>
      </linearGradient>
      <linearGradient id="hs-g2" x1="10" y1="38" x2="38" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A78BFA"/>
        <stop offset="100%" stopColor="#60A5FA"/>
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#hs-g)"/>
    <path d="M15 31.5V16.5h4.5v5.25h9V16.5H33v15h-4.5v-5.25h-9V31.5H15z" fill="#fff"/>
    <circle cx="36" cy="12" r="4" fill="url(#hs-g2)"/>
  </svg>
);

export const BrandWordmark: React.FC<{ className?: string }> = ({ className = 'text-xl font-bold tracking-tight' }) => (
  <span className={className}>HireSmart</span>
);

export const Brand: React.FC<{ href?: string; className?: string; logoClassName?: string; wordClassName?: string; }>
  = ({ href = '/', className = 'flex items-center gap-2', logoClassName, wordClassName }) => (
  <a href={href} aria-label="HireSmart home" className={className}>
    <BrandLogo className={logoClassName} />
    <BrandWordmark className={wordClassName} />
  </a>
);

export default Brand;


