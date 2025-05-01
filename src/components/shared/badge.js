// badge.js
import React from 'react';

const Badge = ({ text, color }) => {
  return (
    <span className={`px-2 py-1 text-sm font-semibold rounded-full ${color}`}>
      {text}
    </span>
  );
};

export default Badge;