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
      {/* Feature Deep Dive - Modern Cards */}
      <div className="space-y-16">
        {/* Feature 1 Card */}
        <Reveal>
          <div className="group relative overflow-hidden rounded-[2.5rem] bg-indigo-900/5 border border-indigo-100/50 p-8 md:p-16">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center rounded-full bg-white/60 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-blue-600 mb-6 border border-white/40 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                  Intelligent Parsing
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-indigo-950 mb-6">Precision Resume Scanning</h3>
                <p className="text-lg text-indigo-900/70 leading-relaxed mb-8 max-w-lg">
                  Our AI reads resumes like a human expert, but thousands of times faster. It extracts skills, experience, and education with high accuracy.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl border border-white/50 hover:bg-white/80 transition-colors shadow-sm">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <BadgeCheck className="text-green-600 w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-800">98% Accuracy on PDF & Docx</span>
                  </div>
                  <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl border border-white/50 hover:bg-white/80 transition-colors shadow-sm">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <ListTree className="text-orange-600 w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-800">Structured Data Extraction</span>
                  </div>
                </div>
              </div>

              <div className="relative order-1 lg:order-2 lg:-mr-24">
                <img
                  src="/src/assets/feat-scan.png"
                  alt="AI Resume Scanning Interface"
                  className="w-full h-auto rounded-xl shadow-2xl border border-white/20 transform group-hover:scale-[1.02] group-hover:-rotate-1 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Feature 2 Card */}
        <Reveal delayMs={100}>
          <div className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-fuchsia-50 to-indigo-50 border border-fuchsia-100/50 p-8 md:p-16">
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative lg:-ml-24">
                <img
                  src="/src/assets/feat-analytics.png"
                  alt="Hiring Analytics Dashboard"
                  className="w-full h-auto rounded-xl shadow-2xl border border-white/20 transform group-hover:scale-[1.02] group-hover:rotate-1 transition-all duration-700"
                />
              </div>

              <div className="lg:pl-12">
                <div className="inline-flex items-center rounded-full bg-white/60 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-fuchsia-600 mb-6 border border-white/40 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-fuchsia-500 mr-2 animate-pulse"></span>
                  Data-Driven Decisions
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-indigo-950 mb-6">Visualize Your Pipeline</h3>
                <p className="text-lg text-indigo-900/70 leading-relaxed mb-8">
                  Stop guessing. See exactly where your best candidates are coming from and how your pipeline is performing in real-time.
                </p>
                <div className="bg-white/60 p-5 rounded-2xl border border-white/50 hover:bg-white/80 transition-colors shadow-sm inline-block">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="text-purple-600 w-5 h-5" />
                    <span className="font-bold text-indigo-900">Live Metrics</span>
                  </div>
                  <div className="text-sm text-indigo-800/60">Time-to-hire, Source Quality, and more.</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
export default Features;
