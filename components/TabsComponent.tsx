import React from 'react';
import { AppTab, TabId } from '../types';

interface TabsProps {
  tabs: AppTab[];
  activeTab: TabId;
  onTabClick: (tabId: TabId) => void;
}

export const TabsComponent: React.FC<TabsProps> = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-5 sm:mb-8 bg-white/10 p-1 sm:p-1.5 rounded-xl">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          className={`flex-1 py-2 sm:py-3 px-3 sm:px-5 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400
            ${activeTab === tab.id 
              ? 'bg-white/20 text-white backdrop-blur-sm shadow-md' 
              : 'text-white/70 hover:bg-white/15 hover:text-white'
            }`}
        >
          <i className={`${tab.icon} mr-2`}></i>
          {tab.name}
        </button>
      ))}
    </div>
  );
};