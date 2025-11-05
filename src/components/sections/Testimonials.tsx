import { Quote } from 'lucide-react';

const testimonials = [
  { quote: 'HireSmart cut our resume review time by 70%. We shortlist with confidence now.', name: 'Alicia Chen', role: 'Senior Recruiter, FinServ Co.' },
  { quote: 'The skill matching and similarity scores are spot on. It surfaces the right candidates fast.', name: 'Mark Rivera', role: 'Talent Lead, HealthTech' },
  { quote: 'Our hiring managers love the categorization and visuals. It made our process objective.', name: 'Priya Singh', role: 'People Ops, SaaS Startup' },
];

const Testimonials = () => (
  <section id="testimonials" aria-label="Testimonials" className="py-24 md:py-32 overflow-hidden bg-white relative">
    {/* Subtle noise texture for premium feel */}
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-multiply"></div>

    <div className="container mx-auto px-6 md:px-8 mb-16 relative z-10">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-indigo-950">Loved by Recruiters</h2>
        <p className="mt-4 text-xl text-indigo-900/60 font-light">Real impact from teams saving time and improving hire quality.</p>
      </div>
    </div>

    {/* Marquee Container */}
    <div className="relative w-full flex overflow-hidden mask-linear-fade">
      <div className="flex gap-8 animate-marquee whitespace-nowrap py-4">
        {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            className="w-[350px] md:w-[450px] flex-shrink-0 rounded-[2rem] bg-white border border-indigo-100 p-8 shadow-xl shadow-indigo-100/20 hover:-translate-y-1 transition-transform duration-300"
          >
            <Quote className="text-indigo-400 w-8 h-8 mb-6 opacity-30 fill-current" />
            <p className="text-indigo-950 font-medium text-lg md:text-xl leading-relaxed whitespace-normal">“{t.quote}”</p>

            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-lg shadow-sm border border-indigo-200">
                {t.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-indigo-950 text-base">{t.name}</div>
                <div className="text-indigo-500 font-medium text-sm">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Duplicate for seamless loop (CSS animation handles the movement) */}
      <div className="flex gap-8 animate-marquee whitespace-nowrap py-4 absolute top-0 left-0" aria-hidden="true">
        {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
          <div
            key={`${t.name}-duplicate-${i}`}
            className="w-[350px] md:w-[450px] flex-shrink-0 rounded-[2rem] bg-white border border-indigo-100 p-8 shadow-xl hover:-translate-y-1 transition-transform duration-300 backdrop-blur-sm"
          >
            <Quote className="text-indigo-400 w-8 h-8 mb-6 opacity-30 fill-current" />
            <p className="text-indigo-950 font-medium text-lg md:text-xl leading-relaxed whitespace-normal">“{t.quote}”</p>

            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-lg shadow-sm border border-indigo-200">
                {t.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-indigo-950 text-base">{t.name}</div>
                <div className="text-indigo-500 font-medium text-sm">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
export default Testimonials;
