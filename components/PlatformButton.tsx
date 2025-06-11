import React from 'react';
import { Platform } from '../types';

interface PlatformButtonProps {
  platform: Platform;
  isSelected: boolean;
  onClick: () => void;
}

export const PlatformButton: React.FC<PlatformButtonProps> = ({ platform, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`py-2.5 px-3 border-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center
        ${isSelected
          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-transparent shadow-md'
          : 'bg-white border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'
        }`}
    >
      <i className={`${platform.icon} mr-2`}></i>
      {platform.name}
    </button>
  );
};