import React, { useState } from 'react';
import { ScheduledItem } from '../types';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  scheduledItems: ScheduledItem[];
}

export const CalendarComponent: React.FC<CalendarProps> = ({ onDateSelect, scheduledItems }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)

  const calendarDays: Array<Date | null> = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const hasScheduledContent = (date: Date | null): boolean => {
    if (!date) return false;
    const dateString = date.toISOString().split('T')[0];
    return scheduledItems.some(item => item.date === dateString);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
          <i className="fas fa-chevron-left text-gray-600"></i>
        </button>
        <h4 className="text-lg font-semibold text-gray-700">
          {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h4>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
          <i className="fas fa-chevron-right text-gray-600"></i>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm">
        {daysOfWeek.map(day => (
          <div key={day} className="font-medium text-gray-500 py-1 sm:py-2">{day}</div>
        ))}
        {calendarDays.map((date, index) => (
          <div
            key={index}
            onClick={() => date && onDateSelect(date)}
            className={`py-2 sm:py-3 border border-transparent rounded-md cursor-pointer transition-all duration-150
              ${!date ? 'bg-transparent' : 'hover:bg-indigo-100 hover:border-indigo-300'}
              ${hasScheduledContent(date) ? 'bg-gradient-to-br from-purple-400 to-indigo-500 text-white font-semibold shadow' : 'bg-gray-50 text-gray-700'}
              ${date && new Date().toDateString() === date.toDateString() && !hasScheduledContent(date) ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''}
            `}
          >
            {date ? date.getDate() : ''}
          </div>
        ))}
      </div>
    </div>
  );
};