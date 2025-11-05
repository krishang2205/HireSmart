import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	size?: 'sm' | 'md' | 'lg';
	variant?: 'default' | 'outline' | 'hero' | 'gradient';
	asChild?: boolean;
	className?: string;
	children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
	children,
	size = 'md',
	variant = 'default',
	asChild = false,
	className = '',
	...props
}) => {
	const baseStyles = 'flex items-center justify-center px-4 py-2 rounded-lg font-medium focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500';
	const sizeStyles = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg py-3 px-6',
	};
	const variants: Record<string, string> = {
		default: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
		outline: 'border border-slate-300/70 text-slate-700 bg-white hover:bg-slate-50 shadow-sm',
		hero: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30',
		gradient: 'text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-600 hover:via-violet-600 hover:to-fuchsia-600 shadow-lg shadow-indigo-500/30',
	};

	const classes = `${baseStyles} ${sizeStyles[size] || ''} ${variants[variant] || ''} ${className}`;

	if (asChild && React.isValidElement(children)) {
		return React.cloneElement(children as React.ReactElement, {
			className: `${classes} ${(children.props && children.props.className) || ''}`,
			...props,
		});
	}

	return (
		<button className={classes} {...props}>
			{children}
		</button>
	);
};
