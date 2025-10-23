import { Upload, FileText, GaugeCircle, ListTree } from 'lucide-react';
import Reveal from '../../components/Reveal';

const steps = [
  { icon: Upload, title: 'Upload resume(s)', desc: 'Drag & drop PDF or DOCX files.' },
  { icon: FileText, title: 'Enter job description', desc: 'Paste or upload your JD.' },
  { icon: GaugeCircle, title: 'AI analyzes & scores', desc: 'Vector scoring and skill matching.' },
  { icon: ListTree, title: 'Get categorized results', desc: 'Best for Hire, Can Consider, Not Good.' },
];

const HowItWorks = () => (
  <section id="how-it-works" aria-label="How it works" className="py-16 md:py-24 border-t border-indigo-100/50">
    <div className="container mx-auto px-6 md:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-indigo-900">How It Works</h2>
        <p className="mt-3 text-indigo-800/80">A simple, guided flow from upload to insights.</p>
      </div>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.title} delayMs={i * 80}>
            <div className="relative rounded-xl bg-white/60 backdrop-blur-lg p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                {i + 1}
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="rounded-full bg-indigo-100 p-4 text-indigo-600 group-hover:scale-110 transition-transform"><s.icon className="w-6 h-6" /></div>
                <h3 className="font-semibold text-lg text-indigo-900">{s.title}</h3>
              </div>
              <p className="mt-2 text-sm text-center text-indigo-800/70">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
export default HowItWorks;
