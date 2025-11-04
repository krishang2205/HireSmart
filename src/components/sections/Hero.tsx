import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hiresmart-hero-glass.png";
import Reveal from "@/components/Reveal";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { CheckCircle2 } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <header className="relative overflow-hidden pt-20 pb-16 md:pb-24">
      {/* Background Image - Absolute */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Background illustration"
          className="w-full h-full object-cover opacity-10 md:opacity-15 md:scale-110"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/40 to-white/90"></div>
      </div>

      <div className="container mx-auto px-6 md:px-8 pt-20 pb-24 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <Reveal>
            <div className="flex flex-col items-center">
              <div className="absolute -left-10 -top-10 w-20 h-20 bg-purple-200 rounded-full blur-2xl opacity-50"></div>
              <p className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 px-4 py-1.5 text-xs font-bold text-indigo-600 shadow-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                Recruiter-friendly • AI-powered
              </p>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-violet-800 to-fuchsia-900 leading-[1.05] mb-8">
                HireSmart <br className="hidden md:block" />
                <span className="text-4xl md:text-6xl lg:text-7xl text-indigo-900/80">Resume Screening</span>
              </h1>
              <p className="text-xl text-indigo-900/70 md:text-2xl font-medium max-w-2xl leading-relaxed mb-10">
                Evaluate resumes in seconds with <span className="text-indigo-600 font-bold border-b-2 border-indigo-200">advanced vector matching</span>. Hire smarter, faster, and without bias.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                <Button
                  size="lg"
                  variant="hero"
                  className="rounded-full h-14 px-8 text-lg hover-scale shadow-xl shadow-indigo-500/20"
                  disabled={loading}
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      if (user) {
                        navigate('/dashboard');
                      } else {
                        navigate('/auth/login');
                      }
                      setLoading(false);
                    }, 400);
                  }}
                >
                  {loading ? 'Loading...' : 'Get Started'}
                </Button>
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg border-2 border-indigo-100 text-indigo-700 hover:bg-white hover:text-indigo-800 bg-white/50 backdrop-blur-sm" asChild>
                  <a href="#how-it-works">See How It Works</a>
                </Button>
              </div>

              <div className="mt-12 flex items-center gap-6 text-sm font-medium text-indigo-900/40 justify-center">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal animation="fade-in" delayMs={100} className="w-full mt-16 md:mt-24">
            <div className="relative rounded-2xl p-1 shadow-2xl transform transition-transform duration-700 hover:rotate-y-2 hover:rotate-x-2 perspective-1000 mx-auto max-w-4xl">
              <div className="rounded-xl overflow-hidden">
                <img
                  src={heroImg}
                  alt="Illustration of AI analyzing resumes with charts and documents"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </header>
  );
};

export default Hero;
