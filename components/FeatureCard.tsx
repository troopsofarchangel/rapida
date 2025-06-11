import React from 'react';

interface FeatureCardProps {
  icon: string;
  text: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, text }) => {
  return (
    <div className="bg-white/95 p-4 sm:p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/30 transform hover:-translate-y-1">
      <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600">
          <i className={icon}></i>
        </span>
      </div>
      <h4 className="text-sm sm:text-base font-medium text-gray-700">{text}</h4>
    </div>
  );
};