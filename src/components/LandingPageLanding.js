import React from 'react';
import { FaRocket, FaChartLine, FaUsers, FaShieldAlt } from 'react-icons/fa';
import Footer from './Footer';

const features = [
  { icon: <FaRocket className='text-primary text-2xl' />, title: 'Fast Screening', desc: 'Process resumes in seconds with AI.' },
  { icon: <FaChartLine className='text-primary text-2xl' />, title: 'Insightful Scores', desc: 'Similarity and skill matching clarity.' },
  { icon: <FaUsers className='text-primary text-2xl' />, title: 'Team Friendly', desc: 'Share results across hiring teams.' },
  { icon: <FaShieldAlt className='text-primary text-2xl' />, title: 'Secure', desc: 'Local processing, privacy first.' },
];

const testimonials = [
  { quote: 'Cut our screening time by 70% – incredible.', name: 'Recruiter A' },
  { quote: 'Clear scoring & skills mapping we can trust.', name: 'HR Lead B' },
  { quote: 'Super smooth workflow upgrade.', name: 'Talent Ops C' }
];

export default function LandingPageLanding() {
  return (
    <div className='bg-background text-foreground font-sans'>
      <nav className='fixed top-0 left-0 right-0 backdrop-blur border-b border-border bg-background/70 z-20'>
        <div className='container flex items-center justify-between h-14'>
          <a href='/' className='font-display font-bold text-lg'>HireSmart</a>
          <div className='flex items-center gap-4 text-sm'>
            <a href='#features' className='hover:text-primary transition-colors'>Features</a>
            <a href='/app' className='px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition'>Launch App</a>
          </div>
        </div>
      </nav>
      {/* Hero */}
      <header className='pt-32 pb-24 text-center container'>
        <h1 className='font-display text-4xl md:text-5xl font-bold tracking-tight'>Smarter Hiring Starts Here</h1>
        <p className='mt-4 text-muted-foreground max-w-2xl mx-auto'>HireSmart uses NLP + ML to surface the best candidates instantly with transparent scoring and skill insights.</p>
        <div className='mt-8 flex flex-col sm:flex-row gap-4 justify-center'>
          <a href='/#app' className='btn-hero px-6 py-3 rounded-md font-medium shadow hover-scale'>Try the App</a>
          <a href='#features' className='px-6 py-3 rounded-md font-medium border border-border hover:bg-accent/30 transition'>Learn More</a>
        </div>
      </header>

      {/* Features */}
      <section id='features' className='py-20 container'>
        <div className='mx-auto max-w-3xl text-center'>
          <h2 className='font-display text-3xl md:text-4xl font-bold'>Purpose-built Features</h2>
          <p className='mt-3 text-muted-foreground'>Everything you need to evaluate resumes faster & fairly.</p>
        </div>
        <div className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {features.map(f => (
            <div key={f.title} className='rounded-xl border border-border bg-card p-6 shadow-sm hover-scale'>
              <div className='flex items-center gap-3 mb-2'>{f.icon}<h3 className='font-semibold'>{f.title}</h3></div>
              <p className='text-sm text-muted-foreground'>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className='py-20 container'>
        <h2 className='font-display text-3xl font-bold text-center'>How It Works</h2>
        <div className='mt-10 grid gap-6 md:grid-cols-3'>
          {['Upload resumes', 'Paste job description', 'View ranked results'].map((step,i) => (
            <div key={step} className='rounded-lg border border-border bg-card p-6 shadow-sm'>
              <div className='text-primary font-bold mb-2'>Step {i+1}</div>
              <p className='text-sm text-muted-foreground'>{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Results Visualization (placeholder) */}
      <section className='py-20 container'>
        <h2 className='font-display text-3xl font-bold text-center'>Results Visualization</h2>
        <p className='mt-4 text-muted-foreground text-center max-w-2xl mx-auto'>Coming soon: interactive charts for skill coverage & candidate ranking trends.</p>
      </section>

      {/* Testimonials */}
      <section className='py-20 container'>
        <h2 className='font-display text-3xl font-bold text-center'>What Recruiters Say</h2>
        <div className='mt-10 grid gap-6 md:grid-cols-3'>
          {testimonials.map(t => (
            <blockquote key={t.name} className='rounded-xl border border-border bg-card p-6 shadow-sm'>
              <p className='text-sm text-foreground'>“{t.quote}”</p>
              <footer className='mt-3 text-xs text-muted-foreground'>— {t.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className='py-24 bg-gradient-primary text-center text-primary-foreground'>
        <h2 className='font-display text-3xl md:text-4xl font-bold'>Ready to accelerate hiring?</h2>
        <p className='mt-4 max-w-xl mx-auto'>Use HireSmart today and turn resume overload into structured insight.</p>
        <a href='/#app' className='mt-8 inline-block bg-background text-foreground font-medium px-6 py-3 rounded-md shadow hover-scale'>Get Started</a>
      </section>

      <Footer />
    </div>
  );
}
