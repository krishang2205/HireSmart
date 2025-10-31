import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hiresmart-hero-glass.png";
import Reveal from "@/components/Reveal";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <header className="relative overflow-hidden pt-20 pb-16 md:pb-24">
      <div className="absolute inset-0 -z-10">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full blur-3xl opacity-30 bg-gradient-primary"
          aria-hidden />
      </div>

      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal>
            <div className="relative z-10 lg:py-12">
              <div className="absolute -left-10 -top-10 w-20 h-20 bg-purple-200 rounded-full blur-2xl opacity-50"></div>
              <p className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 px-4 py-1.5 text-xs font-bold text-indigo-600 shadow-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                Recruiter-friendly • AI-powered
              </p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-violet-800 to-fuchsia-900 leading-[1.1]">
                HireSmart <br />
                <span className="text-4xl md:text-5xl lg:text-6xl text-indigo-900/80">Resume Screening</span>
              </h1>
              <p className="mt-6 text-lg text-indigo-900/70 md:text-xl font-medium max-w-lg leading-relaxed">
                Evaluate resumes in seconds with <span className="text-indigo-600 font-bold border-b-2 border-indigo-200">advanced vector matching</span>. Hire smarter, faster, and without bias.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  variant="hero"
                  className="hover-scale"
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
                <Button size="lg" variant="outline" asChild>
                  <a href="#how-it-works" className="hover-scale">See How It Works</a>
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal animation="fade-in" delayMs={100}>
            <div className="relative mx-auto max-w-xl lg:-ml-12 lg:mt-0 mt-8 group perspective-1000">
              {/* Decorative Blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-500/30 to-fuchsia-500/30 rounded-full blur-[80px] -z-10 animate-pulse-slow"></div>

              {/* Image Container with Gradient Border */}
              <div className="relative rounded-2xl p-1 bg-gradient-to-br from-white/80 via-indigo-100/50 to-white/80 backdrop-blur-sm shadow-2xl transform transition-transform duration-700 hover:rotate-y-6 hover:rotate-x-6">
                <div className="rounded-xl overflow-hidden bg-white/10">
                  <img
                    src={heroImg}
                    alt="Illustration of AI analyzing resumes with charts and documents"
                    width={960}
                    height={640}
                    className="w-full h-auto object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                {/* Glass Reflection */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </header>
  );
};

export default Hero;
