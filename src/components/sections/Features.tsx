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
              {(i === 0 || i === 3 || i === 4) && <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${f.style.replace('text-', 'from-').split(' ')[0]} to-transparent opacity-20 blur-2xl rounded-bl-full`}></div>}

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${f.style} shadow-inner`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-indigo-950 mb-2">{f.title}</h3>
                <p className="text-indigo-900/70 leading-relaxed text-sm">{f.desc}</p>
              </div>

              {(i === 0 || i === 3) && <ArrowRight className="absolute bottom-8 right-8 w-6 h-6 text-indigo-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />}
            </article>
          </Reveal>
        ))}
      </div>

      {/* Feature Deep Dive - Overlapping Layout */}
      <div className="space-y-24">
        {/* Feature 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative z-10 lg:pr-12">
              <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 mb-6 border border-blue-100">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                Intelligent Parsing
              </div>
              <h3 className="text-3xl font-display font-bold text-indigo-900 mb-4">Precision Resume Scanning</h3>
              <p className="text-lg text-indigo-900/70 leading-relaxed mb-6">
                Our AI reads resumes like a human expert, but thousands of times faster. It extracts skills, experience, and education with high accuracy, even from complex layouts.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-indigo-50">
                  <BadgeCheck className="text-green-500 w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">98% Accuracy on PDF & Docx</span>
                </div>
                <div className="flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-indigo-50">
                  <ListTree className="text-orange-500 w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">Structured Data Extraction</span>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delayMs={200}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl rotate-3 blur-md -z-10 opacity-60"></div>
              <img src="/src/assets/feat-scan.png" alt="AI Resume Scanning" className="w-full h-auto rounded-2xl shadow-2xl border border-white/40 -ml-4 hover:ml-0 transition-all duration-500" />
            </div>
          </Reveal>
        </div>

        {/* Feature 2 (Reversed) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal delayMs={200}>
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-gradient-to-l from-fuchsia-100 to-purple-100 rounded-2xl -rotate-2 blur-md -z-10 opacity-60"></div>
              <img src="/src/assets/feat-analytics.png" alt="Hiring Analytics" className="w-full h-auto rounded-2xl shadow-2xl border border-white/40 ml-4 hover:ml-0 transition-all duration-500" />
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <div className="relative z-10 lg:pl-12">
              <div className="inline-flex items-center rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-bold text-fuchsia-600 mb-6 border border-fuchsia-100">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 mr-2"></span>
                Data-Driven Decisions
              </div>
              <h3 className="text-3xl font-display font-bold text-indigo-900 mb-4">Visualize Your Hiring Pipeline</h3>
              <p className="text-lg text-indigo-900/70 leading-relaxed mb-6">
                Stop guessing. See exactly where your best candidates are coming from and how your pipeline is performing.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-indigo-50">
                  <BarChart3 className="text-purple-500 w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">Real-time Hiring Metrics</span>
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
