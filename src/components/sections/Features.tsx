// ...existing code...
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
  <section id="features" aria-label="Features" className="py-16 md:py-24 border-t border-indigo-100/50">
    <div className="container mx-auto px-6 md:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-indigo-900">Features built for speed and clarity</h2>
        <p className="mt-3 text-indigo-800/80">Everything recruiters need to evaluate resumes faster with confidence.</p>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-4 auto-rows-[300px] mb-32">
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

      {/* Feature Deep Dive - Overlapping Layout */}
      <div className="space-y-24">
        {/* Feature 1 */}
        {/* Feature 1: Precision Resume Scanning (Overlap Right) */}
        <div className="relative isolate">
          <Reveal>
            <div className="flex flex-col lg:flex-row items-center">
              {/* Text Card - Overlapping */}
              <div className="w-full lg:w-[45%] z-20 -mb-16 lg:mb-0 lg:-mr-20 relative">
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
                  <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 mb-6 border border-blue-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                    Intelligent Parsing
                  </div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-indigo-950 mb-4">Precision Resume Scanning</h3>
                  <p className="text-lg text-indigo-900/70 leading-relaxed mb-8">
                    Our AI reads resumes like a human expert, but thousands of times faster. It extracts skills, experience, and education with high accuracy.
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-indigo-50/50">
                      <BadgeCheck className="text-green-500 w-5 h-5" />
                      <span className="text-sm font-medium text-gray-700">98% Accuracy on PDF & Docx</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-indigo-50/50">
                      <ListTree className="text-orange-500 w-5 h-5" />
                      <span className="text-sm font-medium text-gray-700">Structured Data Extraction</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image - Background Layer */}
              <div className="w-full lg:w-[65%] lg:ml-auto relative z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-[3rem] blur-3xl -z-10"></div>
                <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-white/20 relative group">
                  <div className="absolute inset-0 bg-indigo-900/5 group-hover:bg-transparent transition-colors duration-500"></div>
                  <img
                    src="/src/assets/feat-scan.png"
                    alt="AI Resume Scanning Interface"
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Feature 2 (Reversed) */}
        {/* Feature 2: Pipeline Visualization (Overlap Left) */}
        <div className="relative isolate pt-12">
          <Reveal delayMs={200}>
            <div className="flex flex-col lg:flex-row items-center font-sans">
              {/* Image - Background Layer (Left) */}
              <div className="w-full lg:w-[65%] lg:mr-auto relative z-10 order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-l from-fuchsia-500/10 to-purple-500/10 rounded-[3rem] blur-3xl -z-10"></div>
                <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-white/20 relative group">
                  <div className="absolute inset-0 bg-purple-900/5 group-hover:bg-transparent transition-colors duration-500"></div>
                  <img
                    src="/src/assets/feat-analytics.png"
                    alt="Hiring Analytics Dashboard"
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Text Card - Overlapping (Right) */}
              <div className="w-full lg:w-[45%] z-20 -mt-16 lg:mt-0 lg:-ml-20 relative order-1 lg:order-2">
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
                  <div className="inline-flex items-center rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-bold text-fuchsia-600 mb-6 border border-fuchsia-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 mr-2"></span>
                    Data-Driven Decisions
                  </div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-indigo-950 mb-4">Visualize Your Hiring Pipeline</h3>
                  <p className="text-lg text-indigo-900/70 leading-relaxed mb-8">
                    Stop guessing. See exactly where your best candidates are coming from and how your pipeline is performing in real-time.
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-indigo-50/50">
                      <BarChart3 className="text-purple-500 w-5 h-5" />
                      <span className="text-sm font-medium text-gray-700">Real-time Hiring Metrics</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);
export default Features;
