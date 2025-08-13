import React from 'react';
import { BrandLogo, BrandWordmark } from '@/components/Brand';
import AuthCarousel from './AuthCarousel';

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
        <AuthCarousel />
      </div>
    </div>
  </div>
);
export default AuthLayout;
