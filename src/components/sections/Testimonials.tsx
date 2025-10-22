import { Quote } from 'lucide-react';
import Reveal from '../../components/Reveal';

const testimonials = [
  { quote: 'HireSmart cut our resume review time by 70%. We shortlist with confidence now.', name: 'Alicia Chen', role: 'Senior Recruiter, FinServ Co.' },
  { quote: 'The skill matching and similarity scores are spot on. It surfaces the right candidates fast.', name: 'Mark Rivera', role: 'Talent Lead, HealthTech' },
  { quote: 'Our hiring managers love the categorization and visuals. It made our process objective.', name: 'Priya Singh', role: 'People Ops, SaaS Startup' },
];

const Testimonials = () => (
  <section id="testimonials" aria-label="Testimonials" className="py-16 md:py-24 border-t border-indigo-100/50">
    <div className="container mx-auto px-6 md:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-indigo-900">Testimonials</h2>
        <p className="mt-3 text-indigo-800/80">Real impact from recruiters saving time and improving hire quality.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delayMs={i * 80}>
            <blockquote className="h-full rounded-xl border border-white/50 bg-white/60 backdrop-blur-lg p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <Quote className="text-indigo-500" />
              <p className="mt-3 text-indigo-950 font-medium">“{t.quote}”</p>
              <footer className="mt-4 text-sm text-indigo-800/70"><span className="font-bold text-indigo-900">{t.name}</span> — {t.role}</footer>
            </blockquote>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
export default Testimonials;
