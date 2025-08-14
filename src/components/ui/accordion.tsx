
import React, { useState } from 'react';

import { ReactNode } from 'react';

interface AccordionProps {
	title: ReactNode;
	children: React.ReactNode;
	className?: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, className = '' }) => {
	const [open, setOpen] = useState(false);
	return (
		<span className={`inline-block ${className}`}> 
			<button
				className="flex items-center gap-1 text-indigo-700 underline text-xs px-1 py-0 focus:outline-none"
				onClick={() => setOpen((o) => !o)}
				aria-expanded={open}
				style={{ background: 'none', border: 'none' }}
			>
				{title}
				<span>{open ? '▲' : '▼'}</span>
			</button>
			{open && (
				<span className="block mt-1 animate-fade-in">
					{children}
				</span>
			)}
		</span>
	);
};

export default Accordion;
