// Textarea.js
import React from 'react';

const Textarea = ({ className = '', ...props }) => {
  return (
    <textarea
      className={`border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};

export default Textarea;