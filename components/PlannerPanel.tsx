import React, { useState, useEffect } from 'react';
import { CalendarComponent } from './CalendarComponent.jsx';
import { ScheduledItem, PlatformID } from '../types';
import { PLATFORMS, DEFAULT_PLATFORM_CONTENT_TYPE_OPTIONS } from '../constants';

interface PlannerPanelProps {
  scheduledItems: ScheduledItem[];
  setScheduledItems: React.Dispatch<React.SetStateAction<ScheduledItem[]>>;
  onScheduleChange: () => void;
}

export const PlannerPanel: React.FC<PlannerPanelProps> = ({ scheduledItems, setScheduledItems, onScheduleChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [contentIdea, setContentIdea] = useState('');
  const [contentTime, setContentTime] = useState('10:00');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformID>(PlatformID.Instagram);
  const [contentType, setContentType] = useState<string>(DEFAULT_PLATFORM_CONTENT_TYPE_OPTIONS[PlatformID.Instagram][0]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDate) {
      const itemToLoad = scheduledItems.find(item => item.date === selectedDate.toISOString().split('T')[0]);
      if (itemToLoad) {
        setContentIdea(itemToLoad.contentIdea);
        setContentTime(itemToLoad.time);
        setSelectedPlatform(itemToLoad.platform);
        setContentType(itemToLoad.contentType);
        setEditingItemId(itemToLoad.id);
      } else {
        resetForm();
      }
    } else {
      resetForm();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, scheduledItems]);

  const resetForm = () => {
    setContentIdea('');
    setContentTime('10:00');
    setSelectedPlatform(PlatformID.Instagram);
    setContentType(DEFAULT_PLATFORM_CONTENT_TYPE_OPTIONS[PlatformID.Instagram][0]);
    setEditingItemId(null);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const itemOnDate = scheduledItems.find(item => item.date === date.toISOString().split('T')[0]);
    if (itemOnDate) {
        setContentIdea(itemOnDate.contentIdea);
        setContentTime(itemOnDate.time);
        setSelectedPlatform(itemOnDate.platform);
        setContentType(itemOnDate.contentType);
        setEditingItemId(itemOnDate.id);
    } else {
        resetForm();
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !contentIdea.trim()) {
      alert('Por favor, selecione uma data e insira uma ideia de conteúdo.');
      return;
    }
    const dateStr = selectedDate.toISOString().split('T')[0];
    
    if (editingItemId) { 
      setScheduledItems(prevItems => 
        prevItems.map(item => 
          item.id === editingItemId 
          ? { ...item, contentIdea, time: contentTime, platform: selectedPlatform, contentType, date: dateStr }
          : item
        )
      );
    } else { 
      const existingItemOnDate = scheduledItems.find(item => item.date === dateStr);
      if(existingItemOnDate) {
         setScheduledItems(prevItems => 
            prevItems.map(item => 
            item.id === existingItemOnDate.id
            ? { ...item, contentIdea, time: contentTime, platform: selectedPlatform, contentType, date: dateStr }
            : item
            )
        );
      } else {
        const newItem: ScheduledItem = {
            id: Date.now().toString(), 
            date: dateStr,
            time: contentTime,
            contentIdea,
            platform: selectedPlatform,
            contentType,
        };
        setScheduledItems(prevItems => [...prevItems, newItem]);
      }
    }
    onScheduleChange();
    resetForm(); 
    setSelectedDate(null); 
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      setScheduledItems(prevItems => prevItems.filter(item => item.id !== itemId));
      onScheduleChange();
      if (editingItemId === itemId) { 
        resetForm();
        setSelectedDate(null);
      }
    }
  };
  
  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPlatform = e.target.value as PlatformID;
    setSelectedPlatform(newPlatform);
    const platformContentTypes = DEFAULT_PLATFORM_CONTENT_TYPE_OPTIONS[newPlatform];
    if (platformContentTypes && platformContentTypes.length > 0) {
      setContentType(platformContentTypes[0]);
    } else {
      setContentType('Post'); // Fallback, though current constants should prevent this
    }
  };

  const currentPlatformContentTypes = DEFAULT_PLATFORM_CONTENT_TYPE_OPTIONS[selectedPlatform] || ['Post'];


  return (
    <div className="bg-white/95 p-5 sm:p-8 rounded-xl shadow-xl backdrop-blur-md border border-white/30">
      <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-5 text-gray-700 flex items-center">
        <i className="fas fa-calendar-alt mr-3 text-indigo-500"></i>Planejador de Conteúdo Mensal
      </h3>
      <p className="text-sm text-gray-600 mb-4">Organize seu conteúdo para o mês inteiro. Clique em um dia para adicionar ou editar uma ideia.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow border">
          <CalendarComponent onDateSelect={handleDateSelect} scheduledItems={scheduledItems} />
        </div>
        
        <form onSubmit={handleScheduleSubmit} className="bg-white p-4 rounded-lg shadow border space-y-3 sm:space-y-4">
          <h4 className="text-lg font-medium text-gray-700 border-b pb-2">
            {editingItemId ? 'Editar Agendamento' : 'Agendar Conteúdo'}
          </h4>
          {selectedDate && (
            <p className="text-sm font-semibold text-indigo-600">
              Data: {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          )}
          {!selectedDate && <p className="text-sm text-gray-500">Selecione um dia no calendário.</p>}

          {selectedDate && (
            <>
            <div>
              <label htmlFor="contentIdea" className="block text-sm font-medium text-gray-600 mb-1">Ideia/Conteúdo</label>
              <input type="text" id="contentIdea" value={contentIdea} onChange={(e) => setContentIdea(e.target.value)}
                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="contentTime" className="block text-sm font-medium text-gray-600 mb-1">Horário</label>
                <input type="time" id="contentTime" value={contentTime} onChange={(e) => setContentTime(e.target.value)}
                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm" required />
              </div>
              <div>
                <label htmlFor="contentPlatform" className="block text-sm font-medium text-gray-600 mb-1">Plataforma</label>
                <select id="contentPlatform" value={selectedPlatform} onChange={handlePlatformChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white">
                  {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="contentType" className="block text-sm font-medium text-gray-600 mb-1">Tipo de Conteúdo</label>
              <select id="contentType" value={contentType} onChange={(e) => setContentType(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white">
                {currentPlatformContentTypes.map(type => <option key={type} value={type.toLowerCase()}>{type}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors text-sm">
              {editingItemId ? 'Atualizar Agendamento' : 'Agendar Conteúdo'}
            </button>
            {editingItemId && (
                <button type="button" onClick={() => { resetForm(); setSelectedDate(null); }} className="w-full mt-2 py-2.5 px-4 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors text-sm">
                    Limpar Formulário / Cancelar Edição
                </button>
            )}
            </>
          )}
        </form>
      </div>

      {scheduledItems.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow border">
          <h4 className="text-lg font-medium text-gray-700 mb-3">Conteúdos Agendados</h4>
          <div className="space-y-3 max-h-80 overflow-y-auto fancy-scrollbar">
            {scheduledItems.sort((a,b) => new Date(a.date+'T'+a.time).getTime() - new Date(b.date+'T'+b.time).getTime()).map(item => (
              <div key={item.id} className="p-3 border border-gray-200 rounded-md bg-gray-50 flex justify-between items-start">
                <div>
                  <p className="font-semibold text-indigo-700 text-sm">
                    {new Date(item.date+'T00:00:00').toLocaleDateString('pt-BR', {day: '2-digit', month: 'short', year:'numeric'})} às {item.time}
                  </p>
                  <p className="text-gray-800 text-sm mt-0.5">{item.contentIdea}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {PLATFORMS.find(p=>p.id === item.platform)?.name} - {item.contentType}
                  </p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => {
                        setSelectedDate(new Date(item.date+'T00:00:00')); 
                        setContentIdea(item.contentIdea);
                        setContentTime(item.time);
                        setSelectedPlatform(item.platform);
                        setContentType(item.contentType);
                        setEditingItemId(item.id);
                    }} className="text-indigo-600 hover:text-indigo-800 text-xs p-1"><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700 text-xs p-1"><i className="fas fa-trash"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};