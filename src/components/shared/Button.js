// Button.js
import React from 'react';

const Button = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium focus:outline-none transition duration-300 ease-in-out transform';
  const variants = {
    default: 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-100 hover:scale-105',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:scale-105',
    success: 'bg-green-500 text-white hover:bg-green-600 hover:scale-105',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 hover:scale-105',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || ''} ${className}`}
      aria-label={children}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;