import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hiresmart-hero.png";
import Reveal from "@/components/Reveal";

const Hero = () => {
  return (
    <header className="relative overflow-hidden pt-20 pb-16 md:pb-24">
      <div className="absolute inset-0 -z-10">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full blur-3xl opacity-30 bg-gradient-primary"
             aria-hidden />
      </div>

      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div>
              <p className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                Recruiter-friendly • AI-powered
              </p>
              <h1 className="mt-4 font-display text-4xl leading-tight font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                HireSmart – AI-Powered Resume Screening
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Evaluate resumes in seconds. Match skills. Hire smarter.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" variant="hero" className="hover-scale">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#how-it-works" className="hover-scale">See How It Works</a>
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal animation="fade-in" delayMs={100}>
            <div className="relative mx-auto max-w-xl">
              <img
                src={heroImg}
                alt="Illustration of AI analyzing resumes with charts and documents"
                width={960}
                height={640}
                className="w-full h-auto rounded-xl border border-border shadow-sm"
                loading="eager"
                decoding="async"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </header>
  );
};

export default Hero;
