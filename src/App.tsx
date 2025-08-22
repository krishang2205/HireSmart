import React, { useEffect } from 'react';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import Results from '@/components/sections/Results';
import Testimonials from '@/components/sections/Testimonials';
import CTA from '@/components/sections/CTA';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const App: React.FC = () => {
  useEffect(() => {
    // Listen for theme changes in localStorage
    const syncTheme = () => {
      const theme = localStorage.getItem('hs_theme');
      if (theme === 'dark') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    };
    syncTheme();
    window.addEventListener('storage', syncTheme);
    return () => window.removeEventListener('storage', syncTheme);
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Results />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};
export default App;
