import React from 'react';
import { Template } from '../types';
import { TemplateDisplayCard } from './TemplateDisplayCard.jsx';

interface TemplatesPanelProps {
  templates: Template[];
  onTemplateCopied: () => void;
}

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({ templates, onTemplateCopied }) => {
  return (
    <div className="bg-white/95 p-5 sm:p-8 rounded-xl shadow-xl backdrop-blur-md border border-white/30">
      <h3 className="text-xl sm:text-2xl font-semibold mb-1 text-gray-700 flex items-center">
        <i className="fas fa-file-alt mr-3 text-indigo-500"></i>Templates de Prompts Virais
      </h3>
      <p className="text-sm text-gray-600 mb-4 sm:mb-6">Use estes templates testados para criar conteúdo que engaja!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {templates.map(template => (
          <TemplateDisplayCard key={template.id} template={template} onCopy={onTemplateCopied} />
        ))}
      </div>
    </div>
  );
};