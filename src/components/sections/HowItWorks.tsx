import { Upload, FileText, GaugeCircle, ListTree } from 'lucide-react';
import Reveal from '../../components/Reveal';

const steps = [
  { icon: Upload, title: 'Upload resume(s)', desc: 'Drag & drop PDF or DOCX files.' },
  { icon: FileText, title: 'Enter job description', desc: 'Paste or upload your JD.' },
  { icon: GaugeCircle, title: 'AI analyzes & scores', desc: 'Vector scoring and skill matching.' },
  { icon: ListTree, title: 'Get categorized results', desc: 'Best for Hire, Can Consider, Not Good.' },
];

const HowItWorks = () => (
  <section id="how-it-works" aria-label="How it works" className="relative py-24 md:py-32 bg-slate-950 overflow-hidden">
    {/* Ambient Glows */}
    <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-fuchsia-500/5 rounded-full blur-[80px] pointer-events-none"></div>

    <div className="container mx-auto px-6 md:px-8 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
          <p className="text-xl text-slate-400 font-light max-w-xl">
            A simple, guided flow from upload to insights. No complex setup required.
          </p>
        </div>
        <div className="hidden md:block h-px flex-1 bg-white/10 ml-12 mb-4"></div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.title} delayMs={i * 80}>
            <div className="relative h-full p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group overflow-hidden">
              {/* Step Number Background */}
              <div className="absolute -right-4 -top-4 text-[8rem] font-bold text-white/5 select-none pointer-events-none group-hover:text-white/10 transition-colors">
                {i + 1}
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <s.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm flex-1">{s.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
export default HowItWorks;
