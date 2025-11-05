import { Upload, FileText, BadgeCheck, GaugeCircle, ListTree, BarChart3, ArrowRight } from 'lucide-react';
import Reveal from '../../components/Reveal';

const features = [
  { icon: Upload, title: 'Resume Upload', desc: 'Upload PDF or DOCX resumes in bulk.', style: 'bg-indigo-100 text-indigo-600' },
  { icon: FileText, title: 'Job Description Matching', desc: 'Align candidates with your JD instantly.', style: 'bg-blue-100 text-blue-600' },
  { icon: BadgeCheck, title: 'Skill Extraction & Matching', desc: 'Parse skills and map to requirements.', style: 'bg-green-100 text-green-600' },
  { icon: GaugeCircle, title: 'Cosine Similarity Scoring', desc: 'Quantify fit with robust vector scoring.', style: 'bg-cyan-100 text-cyan-600' },
  { icon: ListTree, title: 'Candidate Categorization', desc: 'Auto-group by relevance tier.', style: 'bg-orange-100 text-orange-600' },
  { icon: BarChart3, title: 'Dynamic Visualization', desc: 'See insights with clear charts.', style: 'bg-pink-100 text-pink-600' },
];

const Features = () => (
  <section id="features" aria-label="Features" className="pt-16 md:pt-24 border-t border-indigo-100/50">
    <div className="container mx-auto px-6 md:px-8 pb-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-indigo-900">Features built for speed and clarity</h2>
        <p className="mt-3 text-indigo-800/80">Everything recruiters need to evaluate resumes faster with confidence.</p>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-4 auto-rows-[300px]">
        {features.map((f, i) => (
          <Reveal
            key={f.title}
            delayMs={i * 60}
            className={`
              ${(i === 0 || i === 5) ? 'md:col-span-2' : 'md:col-span-1'} 
              h-full
            `}
          >
            <article className={`h-full flex flex-col justify-between rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-8 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group relative overflow-hidden`}>
              {/* Background Decoration for larger cards */}
              {(i === 0 || i === 5) && <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${f.style.replace('text-', 'from-').split(' ')[0]} to-transparent opacity-10 blur-3xl rounded-bl-full pointer-events-none`}></div>}

              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${f.style} bg-opacity-20 shadow-inner`}>
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-xl text-indigo-950 mb-3">{f.title}</h3>
                <p className="text-indigo-900/60 leading-relaxed text-sm font-medium">{f.desc}</p>
              </div>

              {(i === 0 || i === 5) && <div className="absolute bottom-8 right-8 w-8 h-8 rounded-full border border-indigo-100 flex items-center justify-center text-indigo-300 group-hover:text-indigo-600 group-hover:bg-white group-hover:border-indigo-200 transition-all"><ArrowRight className="w-4 h-4" /></div>}
            </article>
          </Reveal>
        ))}
      </div>

      {/* Transition Bridge */}
      <div className="w-full h-32 bg-gradient-to-b from-transparent to-indigo-950"></div>

      {/* Feature Deep Dive - Full Bleed Flux Split */}
      <div className="w-full relative z-0 flex flex-col bg-indigo-950">

        {/* Feature 1: Flux Split Layout (Text Left / Image Right) */}
        <div className="relative w-full overflow-hidden bg-indigo-950 isolate min-h-[600px] flex items-center group py-24">
          {/* Background Image - Absolute Right */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src="/src/assets/feat-scan.png"
              alt="AI Resume Scanning"
              className="w-full h-full object-cover object-right md:object-center opacity-90 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-indigo-950/20"></div>
          </div>

          {/* Angled Overlay - Text Background */}
          <div
            className="absolute top-0 left-0 h-full w-full md:w-[65%] bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-900/90 z-10"
            style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' }}
          ></div>

          {/* Mobile Fallback Overlay */}
          <div className="absolute inset-0 bg-indigo-950/90 md:hidden z-10"></div>

          {/* Content Container */}
          <div className="container mx-auto px-6 md:px-8 relative z-20">
            <div className="w-full md:w-[55%] text-white">
              <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-bold text-indigo-200 mb-6 border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
                Intelligent Parsing
              </div>
              <h3 className="text-4xl md:text-6xl font-display font-bold mb-6">Precision Resume Scanning</h3>
              <p className="text-xl text-indigo-100/80 leading-relaxed mb-8 font-light max-w-xl">
                Our AI reads resumes like a human expert, but thousands of times faster. It extracts skills, experience, and education with high accuracy.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <BadgeCheck className="text-indigo-300 w-6 h-6" />
                  </div>
                  <span className="text-lg font-medium text-indigo-100">98% Accuracy on PDF & Docx</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <ListTree className="text-indigo-300 w-6 h-6" />
                  </div>
                  <span className="text-lg font-medium text-indigo-100">Structured Data Extraction</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Flux Split Layout (Image Left / Text Right) */}
        <div className="relative w-full overflow-hidden bg-fuchsia-950 isolate min-h-[600px] flex items-center group py-24">
          {/* Background Image - Absolute Left */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src="/src/assets/feat-analytics.png"
              alt="Hiring Analytics"
              className="w-full h-full object-cover object-left md:object-center opacity-90 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-fuchsia-950/20"></div>
          </div>

          {/* Angled Overlay - Text Background (Right side) */}
          <div
            className="absolute top-0 right-0 h-full w-full md:w-[65%] bg-gradient-to-l from-fuchsia-950 via-fuchsia-900 to-fuchsia-900/90 z-10"
            style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
          ></div>

          {/* Mobile Fallback Overlay */}
          <div className="absolute inset-0 bg-fuchsia-950/90 md:hidden z-10"></div>

          {/* Content Container (Aligned Right) */}
          <div className="container mx-auto px-6 md:px-8 relative z-20">
            <div className="w-full md:w-[55%] ml-auto text-white md:pl-24">
              <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-bold text-fuchsia-200 mb-6 border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 mr-2 animate-pulse"></span>
                Data-Driven Decisions
              </div>
              <h3 className="text-4xl md:text-6xl font-display font-bold mb-6">Visualize Your Hiring Pipeline</h3>
              <p className="text-xl text-fuchsia-100/80 leading-relaxed mb-8 font-light max-w-xl">
                Stop guessing. See exactly where your best candidates are coming from and how your pipeline is performing in real-time.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <BarChart3 className="text-fuchsia-300 w-6 h-6" />
                  </div>
                  <span className="text-lg font-medium text-fuchsia-100">Real-time Hiring Metrics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </section>
);

export default Features;
