
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
	const baseStyles = 'px-4 py-2 rounded-lg font-medium focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500';
	const sizeStyles = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg py-3 px-6',
	};
	const variants: Record<string,string> = {
		default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
		outline: 'border border-slate-300/70 text-slate-700 bg-white hover:bg-slate-50 shadow-sm',
		hero: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30',
		gradient: 'text-white bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 hover:from-blue-600 hover:via-blue-500 hover:to-blue-400 shadow-[0_8px_28px_-8px_rgba(37,99,235,0.55)]',
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
