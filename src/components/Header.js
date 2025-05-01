import React from 'react';
import { FaClipboard } from 'react-icons/fa'; // Adding an icon for a more dynamic look

const Header = () => {
  return (
    <header className="bg-[#0B2948] py-3 px-6 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <FaClipboard className="text-white text-xl" />
          <h1 className="text-white text-xl font-semibold">HireSmart</h1>
        </div>

        {/* Subtitle and Beta Badge */}
        <div className="flex items-center space-x-2">
          <p className="text-white text-sm font-light">AI-powered resume screening</p>
          <span className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            BETA
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;