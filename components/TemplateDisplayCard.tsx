import React from 'react';
import { Template } from '../types';
import { CopyButton } from './CopyButton.jsx';

interface TemplateCardProps {
  template: Template;
  onCopy: () => void;
}

export const TemplateDisplayCard: React.FC<TemplateCardProps> = ({ template, onCopy }) => {
  
  const handleCopyClick = () => {
    onCopy(); // This updates analytics
    // CopyButton component handles actual clipboard copy and its state.
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg shadow-lg border-l-4 border-indigo-500 transition-all duration-300 hover:shadow-xl">
      <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{template.title}</h4>
      <pre className="bg-gray-100 p-3 rounded-md text-xs sm:text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
        {template.content}
      </pre>
      <div onClick={handleCopyClick}> {/* This div wrapper ensures onCopy is called for analytics */}
        <CopyButton textToCopy={template.content} />
      </div>
    </div>
  );
};