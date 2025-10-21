// ...existing code...
import { Upload, FileText, BadgeCheck, GaugeCircle, ListTree, BarChart3 } from 'lucide-react';
import Reveal from '../../components/Reveal';

const features = [
  { icon: Upload, title: 'Resume Upload', desc: 'Upload PDF or DOCX resumes in bulk.' },
  { icon: FileText, title: 'Job Description Matching', desc: 'Align candidates with your JD instantly.' },
  { icon: BadgeCheck, title: 'Skill Extraction & Matching', desc: 'Parse skills and map to requirements.' },
  { icon: GaugeCircle, title: 'Cosine Similarity Scoring', desc: 'Quantify fit with robust vector scoring.' },
  { icon: ListTree, title: 'Candidate Categorization', desc: 'Auto-group by relevance tier.' },
  { icon: BarChart3, title: 'Dynamic Visualization', desc: 'See insights with clear charts.' },
];

const Features = () => (
  <section id="features" aria-label="Features" className="py-16 md:py-24 border-t border-indigo-100/50">
    <div className="container mx-auto px-6 md:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-indigo-900">Features built for speed and clarity</h2>
        <p className="mt-3 text-indigo-800/80">Everything recruiters need to evaluate resumes faster with confidence.</p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delayMs={i * 60}>
            <article className="rounded-xl border border-white/50 bg-white/60 backdrop-blur-lg p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-indigo-100 text-indigo-600`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
export default Features;
