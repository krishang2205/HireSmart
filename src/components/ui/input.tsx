
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
	return (
		<input
			className={`border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
			{...props}
		/>
	);
};
