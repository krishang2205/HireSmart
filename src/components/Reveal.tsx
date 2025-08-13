import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

interface RevealProps {
	children: React.ReactNode;
	delayMs?: number;
	animation?: 'fade-in' | 'scale-in';
	once?: boolean;
	className?: string;
}

// Simple intersection-based reveal animation wrapper
const Reveal: React.FC<RevealProps> = ({
	children,
	delayMs = 0,
	animation = 'fade-in',
	once = true,
	className
}) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					if (delayMs) {
						const t = setTimeout(() => setVisible(true), delayMs);
						if (once) observer.disconnect();
						return () => clearTimeout(t);
					} else {
						setVisible(true);
						if (once) observer.disconnect();
					}
				} else if (!once) {
					setVisible(false);
				}
			},
			{ threshold: 0.2 }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [delayMs, once]);

		// Migrated from landing page/src/components/Reveal.tsx
		return (
			<div
				ref={ref}
				className={cn(
					'transition-all duration-500 will-change-transform',
					!visible && 'opacity-0 translate-y-3',
					visible && `animate-${animation}`,
					className
				)}
			>
				{children}
			</div>
		);
};

export default Reveal;
