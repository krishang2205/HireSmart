import React from 'react';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import Results from '@/components/sections/Results';
import Testimonials from '@/components/sections/Testimonials';
import CTA from '@/components/sections/CTA';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const App: React.FC = () => {
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
