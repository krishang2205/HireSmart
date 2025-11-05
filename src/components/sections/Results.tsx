import Reveal from '../../components/Reveal';

const Results = () => (
	<section className="relative bg-white py-24 md:py-32 overflow-hidden">
		{/* Angled Overlay similar to Flux Split (Light) */}
		<div
			className="absolute top-0 right-0 h-full w-[60%] bg-gradient-to-l from-white to-white/0 pointer-events-none"
			style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}
		></div>

		{/* Background Pattern */}
		<div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-multiply"></div>
		<div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
		<div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/4"></div>

		<div className="container mx-auto px-6 md:px-8 relative z-10">
			<div className="grid md:grid-cols-2 gap-16 items-center">
				<div className="text-left">
					<Reveal>
						<div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-600 mb-6 border border-indigo-100 shadow-sm">
							<span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>
							Market Impact
						</div>
						<h2 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight text-indigo-950 leading-tight">
							Real Results,<br />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Real Fast.</span>
						</h2>
						<p className="text-indigo-900/70 text-xl max-w-lg leading-relaxed font-light">
							Stop drowning in resumes. Our AI scoring engine gives you the confidence to interview the right candidates, instantly.
						</p>
					</Reveal>
				</div>

				<div className="grid gap-5">
					{[
						{ title: 'Similarity Score', desc: 'Vector-based alignment scoring.', icon: '🎯' },
						{ title: 'Skill Context', desc: 'Weighted hard & soft skill analysis.', icon: '🧠' },
						{ title: 'Ranking Buckets', desc: 'Instant "Hire", "Consider", "Pass" triage.', icon: '⚡' }
					].map((c, i) => (
						<Reveal key={c.title} delayMs={i * 90}>
							<div className="flex items-center gap-6 p-6 rounded-2xl bg-white/60 border border-white/80 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/40 transition-all backdrop-blur-md group hover:-translate-x-2 duration-300">
								<div className="h-14 w-14 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl border border-indigo-100 shadow-sm">
									{c.icon}
								</div>
								<div>
									<h3 className="font-bold text-xl text-indigo-950 mb-1 group-hover:text-indigo-600 transition-colors">{c.title}</h3>
									<p className="text-base text-indigo-900/60 font-light">{c.desc}</p>
								</div>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</div>
	</section>
);
export default Results;
