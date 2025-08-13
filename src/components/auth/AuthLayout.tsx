import React from 'react';
import { BrandLogo, BrandWordmark } from '@/components/Brand';

export const AuthLayout: React.FC<{ children: React.ReactNode; title?: string; subtitle?: string; illustration?: React.ReactNode; }> = ({ children, title, subtitle, illustration }) => (
  <div className="h-screen w-screen overflow-hidden">
    <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
      {/* Left: form */}
      <div className="relative flex flex-col items-center justify-center bg-white px-6">
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <BrandLogo className="h-8 w-8" />
          <BrandWordmark className="text-lg font-semibold" />
        </div>
        <div className="w-full max-w-md space-y-6">
          {(title || subtitle) && (
            <div className="space-y-1">
              {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>

      {/* Right: visual */}
      <div className="relative hidden lg:block rounded-l-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_80%_-10%,rgba(99,102,241,0.25),transparent_60%),radial-gradient(900px_600px_at_0%_110%,rgba(56,189,248,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-indigo-600 to-sky-500" />
        <div className="absolute inset-0 mix-blend-overlay opacity-60" style={{ backgroundImage: 'url(/placeholder.svg)', backgroundSize: 'cover' }} />
        <div className="relative z-10 h-full flex items-center justify-center p-12">
          <div className="max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-white shadow-2xl">
            <h2 className="text-3xl font-extrabold leading-tight">Connecting Talent to Opportunities</h2>
            <p className="mt-3 text-sm/6 text-white/85">Discover endless opportunities on HireSmart, where AI helps recruiters and teams shortlist the right talent in seconds.</p>
            <div className="mt-6 h-px w-full bg-white/20" />
            <p className="mt-4 text-xs text-white/80">Upload resumes, match skills, and collaborate with your hiring team.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default AuthLayout;
