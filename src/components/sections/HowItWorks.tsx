import { Upload, FileText, GaugeCircle, ListTree } from 'lucide-react';
import Reveal from '../../components/Reveal';

const steps = [
  { icon: Upload, title: 'Upload resume(s)', desc: 'Drag & drop PDF or DOCX files.' },
  { icon: FileText, title: 'Enter job description', desc: 'Paste or upload your JD.' },
  { icon: GaugeCircle, title: 'AI analyzes & scores', desc: 'Vector scoring and skill matching.' },
  { icon: ListTree, title: 'Get categorized results', desc: 'Best for Hire, Can Consider, Not Good.' },
];

const HowItWorks = () => (
  <section id="how-it-works" aria-label="How it works" className="py-16 md:py-24 bg-muted/40 border-t border-border">
    <div className="container mx-auto px-6 md:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold">How It Works</h2>
        <p className="mt-3 text-muted-foreground">A simple, guided flow from upload to insights.</p>
      </div>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s,i)=>(
          <Reveal key={s.title} delayMs={i*80}>
            <div className="relative rounded-xl bg-card p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-secondary p-2 text-primary"><s.icon /></div>
                <h3 className="font-semibold">{s.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
export default HowItWorks;
