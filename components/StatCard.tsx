import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-white p-3 sm:p-5 rounded-lg shadow-md text-center border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="text-2xl sm:text-3xl text-indigo-600 mb-1 sm:mb-2">
        <i className={icon}></i>
      </div>
      <div className="text-xl sm:text-3xl font-bold text-gray-800">{value}</div>
      <small className="text-xs sm:text-sm text-gray-500">{label}</small>
    </div>
  );
};