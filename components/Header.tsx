import React from 'react';
import { FeatureCard } from './FeatureCard.jsx';

const features = [
  { icon: 'fas fa-calendar-alt', text: 'Planeje todo o mês em minutos' },
  { icon: 'fas fa-recycle', text: 'Reutilize conteúdo com poucos cliques' },
  { icon: 'fas fa-rocket', text: 'Publique automaticamente nos horários ideais' },
  { icon: 'fas fa-brain', text: 'Você só precisa da ideia. O resto é automação!' },
];

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-5 sm:mb-10 p-5 sm:p-10 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl">
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 sm:mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
          <i className="fas fa-magic mr-2"></i> QuickTransform
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 font-light">
        Transforme qualquer ideia na postagem perfeita! Seja o melhor!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        {features.map((feature, index) => (
          <FeatureCard key={index} icon={feature.icon} text={feature.text} />
        ))}
      </div>
    </header>
  );
};