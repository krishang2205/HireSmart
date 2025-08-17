import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import Reveal from '../../components/Reveal';

const CTA = () => {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus('idle');
		try {
			const res = await fetch('/api/request-demo', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});
			if (res.ok) {
				setStatus('success');
				setEmail('');
			} else {
				setStatus('error');
			}
		} catch {
			setStatus('error');
		}
	};
	return (
		<section
			id="cta"
			aria-label="Call to action"
			className="py-16 md:py-24 border-t border-border bg-white"
		>
			<div className="container mx-auto px-6 md:px-8">
				<div className="mx-auto max-w-3xl text-center">
					<Reveal>
						<h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">
							Start hiring smarter today
						</h2>
						<p className="mt-4 text-muted-foreground font-medium">
							Get a personalized demo or join the early access list.
						</p>
					</Reveal>
					<Reveal delayMs={100}>
						<form
							onSubmit={onSubmit}
							className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
						>
							<Input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your work email"
								aria-label="Work email"
								className="sm:w-[320px] h-11 border-slate-300/70 focus:border-blue-500"
							/>
							<Button
								type="submit"
								size="lg"
								variant="gradient"
								className="h-11 px-7 shadow-[0_8px_28px_-8px_rgba(37,99,235,0.55)]"
							>
								Request Demo
							</Button>
						</form>
						{status === 'success' && (
							<p className="mt-4 text-green-600 font-semibold">
								Thank you! We'll reach out soon.
							</p>
						)}
						{status === 'error' && (
							<p className="mt-4 text-red-600 font-semibold">
								Something went wrong. Please try again.
							</p>
						)}
					</Reveal>
				</div>
			</div>
		</section>
	);
};
export default CTA;
