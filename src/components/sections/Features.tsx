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
  <section id="features" aria-label="Features" className="py-16 md:py-24 border-t border-border bg-white">
    <div className="container mx-auto px-6 md:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold">Features built for speed and clarity</h2>
        <p className="mt-3 text-muted-foreground">Everything recruiters need to evaluate resumes faster with confidence.</p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f,i)=>(
          <Reveal key={f.title} delayMs={i*60}>
            <article className="rounded-xl border border-border bg-card p-6 shadow-sm hover-scale">
              <div className="flex items-center gap-3">
                <f.icon className="text-primary" />
                <h3 className="font-semibold">{f.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
export default Features;
