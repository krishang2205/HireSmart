import React, { useState } from 'react';
import AssessmentModal from './AssessmentModal';

interface AssessmentButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  onAssessmentCreated?: () => void;
}

const AssessmentButton: React.FC<AssessmentButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children = 'Create Assessment',
  onAssessmentCreated
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const handleAssessmentCreated = () => {
    if (onAssessmentCreated) {
      onAssessmentCreated();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={buttonClasses}
      >
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
        {children}
      </button>

      <AssessmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssessmentCreated={handleAssessmentCreated}
      />
    </>
  );
};

export default AssessmentButton;
