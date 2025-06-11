import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.jsx';
import { TabsComponent } from './components/TabsComponent.jsx';
import { GeneratorPanel } from './components/GeneratorPanel.jsx';
import { PlannerPanel } from './components/PlannerPanel.jsx';
import { TemplatesPanel } from './components/TemplatesPanel.jsx';
import { AnalyticsPanel } from './components/AnalyticsPanel.jsx';
import { TABS, INITIAL_ANALYTICS, GEMINI_API_KEY_ERROR_MESSAGE, INITIAL_TEMPLATES } from './constants';
import { TabId, AnalyticsData, ScheduledItem, Template, PlatformID, GeneratedContent } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>(TabId.Generator);
  const [apiKeyExists, setApiKeyExists] = useState<boolean | null>(null);

  const [analyticsData, setAnalyticsData] = useLocalStorage<AnalyticsData>('quicktransform-analytics', INITIAL_ANALYTICS);
  const [scheduledItems, setScheduledItems] = useLocalStorage<ScheduledItem[]>('quicktransform-scheduled', []);
  const [templates] = useLocalStorage<Template[]>('quicktransform-templates', INITIAL_TEMPLATES);

  useEffect(() => {
    let keyValue: string | undefined = undefined;
    try {
      // Attempt 1: Standard process.env.API_KEY (and common variants like REACT_APP_API_KEY)
      if (typeof process !== 'undefined' && process.env) {
        keyValue = process.env.API_KEY || process.env.REACT_APP_API_KEY;
      }

      // Attempt 2: Window-injected process.env.API_KEY
      // Use this if the primary process.env check didn't yield a key.
      if ((!keyValue || keyValue.trim() === '') && typeof window !== 'undefined' && (window as any).process?.env?.API_KEY) {
        const windowKey = (window as any).process.env.API_KEY;
        if (typeof windowKey === 'string' && windowKey.trim() !== '') {
          keyValue = windowKey;
        }
      }
    } catch (e) {
      console.error("Error accessing API key for existence check:", e);
      keyValue = undefined;
    }
    setApiKeyExists(!!keyValue && typeof keyValue === 'string' && keyValue.trim() !== '');
  }, []);


  const updateAnalytics = useCallback((type: keyof AnalyticsData, value?: PlatformID) => {
    setAnalyticsData(prev => {
      const newAnalytics = { ...prev };
      if (type === 'postsGenerated') {
        newAnalytics.postsGenerated += 1;
      } else if (type === 'templatesCopied') {
        newAnalytics.templatesCopied += 1;
      } else if (type === 'platformsUsed' && value) {
        if (!newAnalytics.platformsUsed.includes(value)) {
          newAnalytics.platformsUsed = [...newAnalytics.platformsUsed, value];
        }
      }
      // daysPlanned is updated based on scheduledItems
      newAnalytics.daysPlanned = new Set(scheduledItems.map(item => item.date)).size;
      return newAnalytics;
    });
  }, [setAnalyticsData, scheduledItems]);


  const handleContentGenerated = (generatedContents: GeneratedContent[], platforms: PlatformID[]) => {
    updateAnalytics('postsGenerated');
    platforms.forEach(p => updateAnalytics('platformsUsed', p));
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case TabId.Generator:
        return <GeneratorPanel 
                  onContentGenerated={handleContentGenerated} 
                  apiKeyExists={apiKeyExists} 
                />;
      case TabId.Planner:
        return <PlannerPanel 
                  scheduledItems={scheduledItems} 
                  setScheduledItems={setScheduledItems}
                  onScheduleChange={() => updateAnalytics('daysPlanned')} 
                />;
      case TabId.Templates:
        return <TemplatesPanel templates={templates} onTemplateCopied={() => updateAnalytics('templatesCopied')} />;
      case TabId.Analytics:
        return <AnalyticsPanel analytics={analyticsData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-5 text-gray-800">
      <Header />
      {apiKeyExists === false && activeTab === TabId.Generator && (
         <div className="my-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            <strong>Atenção:</strong> {GEMINI_API_KEY_ERROR_MESSAGE} A funcionalidade de geração de conteúdo por IA pode não funcionar.
          </div>
      )}
      <TabsComponent tabs={TABS} activeTab={activeTab} onTabClick={setActiveTab} />
      <div className="mt-2 sm:mt-5">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default App;