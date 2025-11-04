import Reveal from '../../components/Reveal';

const Results = () => (
	<section className="py-12 md:py-24">
		<div className="container mx-auto px-6 md:px-8">
			<div className="bg-indigo-950 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
				{/* Background Pattern */}
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>

				<div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
					<div className="text-left">
						<Reveal>
							<h2 className="font-display text-3xl md:text-5xl font-bold mb-6 tracking-tight">Real Results,<br />Real Fast.</h2>
							<p className="text-indigo-200/80 text-lg max-w-md leading-relaxed">
								Stop drowning in resumes. Our AI scoring engine gives you the confidence to interview the right candidates, instantly.
							</p>
						</Reveal>
					</div>

					<div className="grid gap-4">
						{[
							{ title: 'Similarity Score', desc: 'Vector-based alignment scoring.' },
							{ title: 'Skill Context', desc: 'Weighted hard & soft skill analysis.' },
							{ title: 'Ranking Buckets', desc: 'Instant "Hire", "Consider", "Pass" triage.' }
						].map((c, i) => (
							<Reveal key={c.title} delayMs={i * 90}>
								<div className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
									<div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-xl border border-indigo-500/30">{i + 1}</div>
									<div>
										<h3 className="font-bold text-lg text-white">{c.title}</h3>
										<p className="text-sm text-indigo-200/60">{c.desc}</p>
									</div>
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</div>
		</div>
	</section>
);
export default Results;
