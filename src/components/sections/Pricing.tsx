import Reveal from '../../components/Reveal';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
    {
        name: 'Starter',
        price: '$0',
        frequency: '/month',
        desc: 'Perfect for small teams trying out AI screening.',
        features: ['50 Resume Parses/mo', 'Basic Skill Matching', 'Email Support', '1 Team Member'],
        cta: 'Get Started',
        popular: false,
        theme: 'indigo'
    },
    {
        name: 'Pro',
        price: '$49',
        frequency: '/month',
        desc: 'For growing companies with active hiring needs.',
        features: ['500 Resume Parses/mo', 'Advanced Vector Scoring', 'Priority Support', '5 Team Members', 'Export to ATS'],
        cta: 'Start Free Trial',
        popular: true,
        theme: 'blue'
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        frequency: '',
        desc: 'Scalable solutions for large organizations.',
        features: ['Unlimited Parses', 'Custom AI Models', 'Dedicated Account Manager', 'SSO & Advanced Security', 'API Access'],
        cta: 'Contact Sales',
        popular: false,
        theme: 'slate'
    }
];

const Pricing = () => (
    <section id="pricing" aria-label="Pricing" className="py-16 md:py-24 border-t border-indigo-100/50">
        <div className="container mx-auto px-6 md:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-indigo-900">Simple, Transparent Pricing</h2>
                <p className="mt-4 text-indigo-800/80">Choose the plan that fits your hiring velocity.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {plans.map((plan, i) => (
                    <Reveal key={plan.name} delayMs={i * 100}>
                        <div className={`relative h-full rounded-2xl border ${plan.popular ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-white/50'} bg-white/60 backdrop-blur-lg p-8 shadow-xl flex flex-col hover:-translate-y-1 transition-transform duration-300`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" /> Most Popular
                                </div>
                            )}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold text-indigo-900">{plan.price}</span>
                                    <span className="text-sm font-medium text-gray-500">{plan.frequency}</span>
                                </div>
                                <p className="mt-2 text-sm text-gray-600 min-h-[40px]">{plan.desc}</p>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {plan.features.map((feat) => (
                                    <div key={feat} className="flex items-start gap-3 text-sm text-gray-700">
                                        <div className="mt-0.5 rounded-full bg-indigo-100 p-1 text-indigo-600">
                                            <Check className="size-3" />
                                        </div>
                                        {feat}
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={plan.popular ? 'hero' : 'outline'}
                                className={`w-full ${plan.popular ? 'shadow-lg shadow-indigo-200' : 'bg-transparent border-indigo-200 text-indigo-700 hover:bg-indigo-50'}`}
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

export default Pricing;
