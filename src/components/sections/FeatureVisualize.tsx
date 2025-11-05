import { BarChart3 } from 'lucide-react';

const FeatureVisualize = () => (
    <section className="w-full relative z-0 flex flex-col bg-white">
        {/* Feature 2: Flux Split Layout (Image Left / Text Right) */}
        <div className="relative w-full overflow-hidden bg-white isolate min-h-[600px] flex items-center group py-24">
            {/* Background Image - Absolute Left */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src="/src/assets/feat-analytics.png"
                    alt="Hiring Analytics"
                    className="w-full h-full object-cover object-left md:object-center opacity-90 transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                />
                {/* Lighter overlay for image */}
                <div className="absolute inset-0 bg-white/30"></div>
            </div>

            {/* Angled Overlay - Text Background (Right side - Light) */}
            <div
                className="absolute top-0 right-0 h-full w-full md:w-[65%] bg-gradient-to-l from-white via-white/80 to-white/60 z-10"
                style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
            ></div>

            {/* Mobile Fallback Overlay */}
            <div className="absolute inset-0 bg-white/95 md:hidden z-10"></div>

            {/* Content Container (Aligned Right) */}
            <div className="container mx-auto px-6 md:px-8 relative z-20">
                <div className="w-full md:w-[55%] ml-auto text-indigo-950 md:pl-24">
                    <div className="inline-flex items-center rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-bold text-fuchsia-600 mb-6 border border-fuchsia-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 mr-2 animate-pulse"></span>
                        Data-Driven Decisions
                    </div>
                    <h3 className="text-4xl md:text-6xl font-display font-bold mb-6">Visualize Your Hiring Pipeline</h3>
                    <p className="text-xl text-indigo-900/70 leading-relaxed mb-8 font-light max-w-xl">
                        Stop guessing. See exactly where your best candidates are coming from and how your pipeline is performing in real-time.
                    </p>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-fuchsia-100 flex items-center justify-center border border-fuchsia-200">
                                <BarChart3 className="text-fuchsia-600 w-6 h-6" />
                            </div>
                            <span className="text-lg font-medium text-indigo-900">Real-time Hiring Metrics</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default FeatureVisualize;
