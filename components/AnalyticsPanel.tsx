import React from 'react';
import { AnalyticsData } from '../types';
import { StatCard } from './StatCard.jsx';

interface AnalyticsPanelProps {
  analytics: AnalyticsData;
}

const performanceTips = [
    'Poste no Instagram entre 11h-13h e 19h-21h',
    'No LinkedIn, terça a quinta-feira têm melhor engajamento',
    'Stories geram 3x mais engajamento que posts no feed',
    'Use 3-5 hashtags relevantes para alcance máximo',
    'Perguntas nos posts aumentam comentários em 50%',
];

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ analytics }) => {
  return (
    <div className="bg-white/95 p-5 sm:p-8 rounded-xl shadow-xl backdrop-blur-md border border-white/30">
      <h3 className="text-xl sm:text-2xl font-semibold mb-1 text-gray-700 flex items-center">
        <i className="fas fa-chart-line mr-3 text-indigo-500"></i>Analytics & Insights
      </h3>
      <p className="text-sm text-gray-600 mb-4 sm:mb-6">Acompanhe o desempenho do seu conteúdo.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
        <StatCard label="Posts Gerados" value={analytics.postsGenerated} icon="fas fa-pencil-alt" />
        <StatCard label="Plataformas Usadas" value={analytics.platformsUsed.length} icon="fas fa-share-alt" />
        <StatCard label="Templates Copiados" value={analytics.templatesCopied} icon="fas fa-copy" />
        <StatCard label="Dias Planejados" value={analytics.daysPlanned} icon="fas fa-calendar-check" />
      </div>

      <div className="mt-5 sm:mt-8 p-4 sm:p-5 bg-white rounded-lg shadow border">
        <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-bullseye mr-2 text-green-500"></i>Dicas de Performance
        </h4>
        <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-gray-600">
            {performanceTips.map((tip, index) => (
                <li key={index}>{tip}</li>
            ))}
        </ul>
      </div>
    </div>
  );
};