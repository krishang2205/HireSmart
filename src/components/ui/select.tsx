import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

export const Select: React.FC<SelectProps> = ({ className = '', children, ...props }) => {
	return (
		<select
			className={`border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm ${className}`}
			{...props}
		>
			{children}
		</select>
	);
};

export default Select;
