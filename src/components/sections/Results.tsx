import Reveal from '../../components/Reveal';

const Results = () => (
	<section className="py-16 md:py-24 border-t border-border bg-muted/30">
		<div className="container mx-auto px-6 md:px-8">
			<div className="mx-auto max-w-3xl text-center">
				<Reveal>
					<h2 className="font-display text-3xl md:text-4xl font-bold">Actionable Results</h2>
					<p className="mt-3 text-muted-foreground">Transparent scoring, matched skills, and clear recommendations reduce decision friction.</p>
				</Reveal>
			</div>
			<div className="mt-10 grid gap-6 md:grid-cols-3">
				{[
					{ title: 'Similarity Score', desc: 'Quantifies alignment between resume and job description using embeddings.' },
					{ title: 'Skill Extraction', desc: 'Highlights hard & soft skills with frequency and context weighting.' },
					{ title: 'Ranking Buckets', desc: 'Groups candidates into Hire, Consider, Not Good for quick triage.' }
				].map((c,i)=>(
					<Reveal key={c.title} delayMs={i*90}>
						<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
							<h3 className="font-semibold mb-2">{c.title}</h3>
							<p className="text-sm text-muted-foreground">{c.desc}</p>
						</div>
					</Reveal>
				))}
			</div>
		</div>
	</section>
);
export default Results;
