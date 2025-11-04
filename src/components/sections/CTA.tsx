import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import Reveal from '../../components/Reveal';

const CTA = () => {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (status !== 'idle') {
			const timer = setTimeout(() => setStatus('idle'), 5000);
			return () => clearTimeout(timer);
		}
	}, [status]);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus('idle');
		setLoading(true);
		try {
			const res = await fetch('/api/request-demo', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});
			setLoading(false);
			if (res.ok) {
				setStatus('success');
				setEmail('');
			} else {
				setStatus('error');
			}
		} catch {
			setLoading(false);
			setStatus('error');
		}
	};
	return (
	return (
		<section
			id="cta"
			aria-label="Call to action"
			className="py-16 md:py-32"
		>
			<div className="container mx-auto px-6 md:px-8">
				<div className="relative rounded-[3rem] overflow-hidden p-10 md:p-24 text-center bg-gradient-to-b from-white/80 to-indigo-50/80 border border-white/60 shadow-2xl backdrop-blur-xl">
					{/* Decor */}
					<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

					<div className="max-w-4xl mx-auto relative z-10">
						<Reveal>
							<h2 className="font-display text-4xl md:text-6xl font-black tracking-tight text-indigo-950 mb-6">
								Ready to hire <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">smarter?</span>
							</h2>
							<p className="text-xl md:text-2xl text-indigo-900/60 font-medium mb-12 max-w-2xl mx-auto">
								Join hundreds of recruiters creating their dream teams with AI-powered insights.
							</p>
						</Reveal>
						<Reveal delayMs={100}>
							<form
								onSubmit={onSubmit}
								className="flex flex-col sm:flex-row gap-4 justify-center items-center"
							>
								<div className="relative group">
									<div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
									<Input
										type="email"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="work@company.com"
										aria-label="Work email"
										className="relative w-full sm:w-[360px] h-14 pl-6 pr-6 rounded-full border-none shadow-sm bg-white text-lg placeholder:text-gray-400 focus:ring-4 focus:ring-indigo-500/20"
									/>
								</div>
								<Button
									type="submit"
									size="lg"
									variant="hero"
									className="h-14 px-10 rounded-full text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-105"
									disabled={loading}
								>
									{loading ? (
										<span className="animate-spin mr-2 inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full align-middle" />
									) : null}
									Get Started
								</Button>
							</form>
							{status === 'success' && (
								<p className="mt-6 text-green-600 font-bold bg-green-50 inline-block px-4 py-2 rounded-full border border-green-100">
									✨ You're on the list! We'll be in touch.
								</p>
							)}
							{status === 'error' && (
								<p className="mt-6 text-red-600 font-bold">
									Something went wrong. Please try again.
								</p>
							)}
						</Reveal>
					</div>
				</div>
			</div>
		</section>
	);
	);
};
export default CTA;
