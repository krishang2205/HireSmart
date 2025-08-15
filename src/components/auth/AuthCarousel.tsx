import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ResumeScreeningIcon,
  AIBrainIcon,
  TeamIcon,
  AnalyticsIcon,
  SuccessIcon,
  DecorativeShapes
} from './AuthIllustrations';

interface Slide {
  id: number;
  title: string;
  description: string;
  bottomText: string;
  icon: React.ComponentType<{ className?: string }>;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Connecting Talent to Opportunities",
    description: "Discover endless opportunities on HireSmart, where AI helps recruiters and teams shortlist the right talent in seconds.",
    bottomText: "Upload resumes, match skills, and collaborate with your hiring team.",
    icon: ResumeScreeningIcon
  },
  {
    id: 2,
    title: "AI-Powered Resume Screening",
    description: "Evaluate resumes in seconds with our advanced AI technology. Match skills, experience, and cultural fit automatically.",
    bottomText: "Save hours of manual screening with intelligent automation.",
    icon: AIBrainIcon
  },
  {
    id: 3,
    title: "Smart Candidate Matching",
    description: "Our AI analyzes job requirements and candidate profiles to find the perfect match for your organization.",
    bottomText: "Get the best candidates ranked by relevance and fit.",
    icon: SuccessIcon
  },
  {
    id: 4,
    title: "Collaborative Hiring Process",
    description: "Work together with your team to review candidates, share feedback, and make informed hiring decisions.",
    bottomText: "Streamline your hiring workflow with team collaboration tools.",
    icon: TeamIcon
  },
  {
    id: 5,
    title: "Data-Driven Insights",
    description: "Get detailed analytics and insights about your hiring process, candidate pipeline, and team performance.",
    bottomText: "Make better hiring decisions with comprehensive reporting.",
    icon: AnalyticsIcon
  }
];

export const AuthCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const goToSlide = (index: number, dir: 'left' | 'right') => {
    setDirection(dir);
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length, 'left');
  };

  const goToNext = () => {
    goToSlide((currentSlide + 1) % slides.length, 'right');
  };

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_80%_-10%,rgba(99,102,241,0.25),transparent_60%),radial-gradient(900px_600px_at_0%_110%,rgba(56,189,248,0.25),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-indigo-600 to-sky-500" />

      {/* Decorative shapes */}
      <DecorativeShapes />

      {/* Content with sliding animation */}
      <div
        className={`relative z-10 h-full flex items-center justify-center p-12 transition-transform duration-500 ease-in-out`}
        style={{
          transform:
            direction === 'right'
              ? `translateX(0)` // main slide stays until changed
              : `translateX(0)`
        }}
      >
        <div
          key={slides[currentSlide].id}
          className={`max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-white shadow-2xl transform transition-transform duration-500 ease-in-out ${
            direction === 'right'
              ? 'animate-slideFromRight'
              : 'animate-slideFromLeft'
          }`}
        >
          <div className="flex justify-center mb-6">
            <CurrentIcon className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-extrabold leading-tight text-center">
            {slides[currentSlide].title}
          </h2>
          <p className="mt-3 text-sm/6 text-white/85 text-center">
            {slides[currentSlide].description}
          </p>
          <div className="mt-6 h-px w-full bg-white/20" />
          <p className="mt-4 text-xs text-white/80 text-center">
            {slides[currentSlide].bottomText}
          </p>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() =>
              goToSlide(
                index,
                index > currentSlide ? 'right' : 'left'
              )
            }
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Tailwind keyframes */}
      <style>{`
        @keyframes slideFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideFromLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideFromRight {
          animation: slideFromRight 0.5s ease forwards;
        }
        .animate-slideFromLeft {
          animation: slideFromLeft 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default AuthCarousel;
