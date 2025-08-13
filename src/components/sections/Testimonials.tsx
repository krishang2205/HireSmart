import { Quote } from 'lucide-react';
import Reveal from '../../components/Reveal';

const testimonials = [
  { quote: 'HireSmart cut our resume review time by 70%. We shortlist with confidence now.', name: 'Alicia Chen', role: 'Senior Recruiter, FinServ Co.' },
  { quote: 'The skill matching and similarity scores are spot on. It surfaces the right candidates fast.', name: 'Mark Rivera', role: 'Talent Lead, HealthTech' },
  { quote: 'Our hiring managers love the categorization and visuals. It made our process objective.', name: 'Priya Singh', role: 'People Ops, SaaS Startup' },
];

const Testimonials = () => (
  <section id="testimonials" aria-label="Testimonials" className="py-16 md:py-24 bg-muted/40 border-t border-border">
    <div className="container mx-auto px-6 md:px-8">
      <div className="mx-auto max-w-3xl text-center">
    <h2 className="font-display text-3xl md:text-4xl font-bold">Testimonials</h2>
        <p className="mt-3 text-muted-foreground">Real impact from recruiters saving time and improving hire quality.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.map((t,i)=>(
          <Reveal key={t.name} delayMs={i*80}>
            <blockquote className="h-full rounded-xl border border-border bg-card p-6 shadow-sm">
              <Quote className="text-primary" />
              <p className="mt-3 text-foreground">“{t.quote}”</p>
              <footer className="mt-4 text-sm text-muted-foreground"><span className="font-medium text-foreground">{t.name}</span> — {t.role}</footer>
            </blockquote>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
export default Testimonials;
