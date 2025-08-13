import React from 'react';

export const AuthLayout: React.FC<{ children: React.ReactNode; title?: string; subtitle?: string; }> = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-10">
    <div className="mb-4 flex items-center gap-2">
      <img src="/favicon.svg" alt="logo" className="h-8 w-8" />
      <span className="font-semibold text-lg">HireSmart</span>
    </div>
    <div className="w-full max-w-xl bg-card/80 backdrop-blur border rounded-xl shadow-sm p-8 space-y-6">
      {(title || subtitle) && (
        <div className="text-center space-y-1">
          {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  </div>
);
export default AuthLayout;
