import React, { useState, useCallback } from 'react';
import { PLATFORMS, GEMINI_API_KEY_ERROR_MESSAGE } from '../constants';
import { PlatformButton } from './PlatformButton.jsx';
import { PlatformID, GeneratedContent, MediaFile } from '../types';
import { generateContentWithGemini } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner.jsx';
import { MediaUpload } from './MediaUpload.jsx';
import { CopyButton } from './CopyButton.jsx';

interface GeneratorPanelProps {
  onContentGenerated: (generatedContents: GeneratedContent[], platforms: PlatformID[]) => void;
  apiKeyExists: boolean | null;
}

export const GeneratorPanel: React.FC<GeneratorPanelProps> = ({ onContentGenerated, apiKeyExists }) => {
  const [idea, setIdea] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformID[]>([PlatformID.Instagram]);
  const [generatedContents, setGeneratedContents] = useState<GeneratedContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [bestTimes, setBestTimes] = useState<string[]>([]);


  const handlePlatformToggle = useCallback((platformId: PlatformID) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  }, []);

  const handleGenerateClick = async () => {
    console.log('[GeneratorPanel] handleGenerateClick called.');
    console.log('[GeneratorPanel] Idea:', idea, 'Selected Platforms:', selectedPlatforms.length, 'API Key Exists:', apiKeyExists);

    if (!idea.trim()) {
      alert('Por favor, digite uma ideia primeiro!');
      console.log('[GeneratorPanel] No idea, returning.');
      return;
    }
    if (selectedPlatforms.length === 0) {
      alert('Selecione pelo menos uma plataforma!');
      console.log('[GeneratorPanel] No platforms selected, returning.');
      return;
    }
    if (apiKeyExists === null) {
        alert("Verificando a chave de API. Por favor, tente novamente em um momento.");
        console.log('[GeneratorPanel] API key status unknown (null), returning.');
        return; 
    }
    if (apiKeyExists === false) {
      alert(GEMINI_API_KEY_ERROR_MESSAGE + " A geração de conteúdo não funcionará.");
      console.log('[GeneratorPanel] API key does not exist. Alerted user. Will proceed to show errors from service.');
      // It will proceed, and geminiService should return specific error messages for each platform.
    }

    setIsLoading(true);
    console.log('[GeneratorPanel] isLoading set to true.');
    setGeneratedContents([]); // Clear previous results
    setBestTimes([]); // Clear previous best times
    console.log('[GeneratorPanel] generatedContents and bestTimes cleared.');

    try {
      console.log('[GeneratorPanel] Calling generateContentWithGemini...');
      const results = await generateContentWithGemini(idea, selectedPlatforms, mediaFiles);
      console.log('[GeneratorPanel] Received results from service:', JSON.stringify(results, null, 2));

      setGeneratedContents(results);
      console.log('[GeneratorPanel] setGeneratedContents called with new results.');

      onContentGenerated(results, selectedPlatforms);
      console.log('[GeneratorPanel] onContentGenerated callback called.');

      if (results.some(r => r.text && !r.text.toLowerCase().includes("erro"))) {
        showBestPostingTimes(selectedPlatforms);
        console.log('[GeneratorPanel] showBestPostingTimes called.');
      } else {
        console.log('[GeneratorPanel] Skipping best times due to errors in generated content.');
      }

    } catch (error) {
      console.error("[GeneratorPanel] Error in handleGenerateClick's try block (should be caught by service):", error);
      const errorResults = selectedPlatforms.map(p => ({platform: p, text: `Erro crítico ao gerar conteúdo para ${PLATFORMS.find(pf => pf.id === p)?.name || p}. Detalhes: ${(error as Error).message}`}));
      setGeneratedContents(errorResults);
      console.log('[GeneratorPanel] setGeneratedContents called with critical error results from catch block.');
    } finally {
      setIsLoading(false);
      console.log('[GeneratorPanel] isLoading set to false in finally block.');
    }
  };
  
  const showBestPostingTimes = (platforms: PlatformID[]) => {
    const timesByPlatform: Record<PlatformID, string[]> = {
        [PlatformID.Instagram]: ['11:00', '13:00', '19:00', '21:00'],
        [PlatformID.Twitter]: ['09:00', '12:00', '15:00', '18:00'],
        [PlatformID.LinkedIn]: ['08:00', '12:00', '17:00', '18:00'],
        [PlatformID.Facebook]: ['13:00', '15:00', '20:00', '21:00'],
        [PlatformID.TikTok]: ['18:00', '19:00', '20:00', '21:00'],
        [PlatformID.YouTube]: ['14:00', '16:00', '20:00', '21:00']
    };
    let allTimes = new Set<string>();
    platforms.forEach(platform => {
        if (timesByPlatform[platform]) {
            timesByPlatform[platform].forEach(time => allTimes.add(time));
        }
    });
    setBestTimes(Array.from(allTimes).sort());
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
      <div className="bg-white/95 p-5 sm:p-8 rounded-xl shadow-xl backdrop-blur-md border border-white/30">
        <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-5 text-gray-700 flex items-center">
          <i className="fas fa-lightbulb mr-3 text-yellow-400"></i>Sua Ideia
        </h3>
        <textarea
          className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-lg text-base mb-3 sm:mb-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors duration-200 resize-vertical min-h-[120px]"
          placeholder="Digite sua ideia aqui... Ex: 'Dicas de produtividade para trabalho remoto'"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />

        <MediaUpload mediaFiles={mediaFiles} setMediaFiles={setMediaFiles} />
        
        <h4 className="text-lg font-medium mb-2 sm:mb-3 text-gray-600 mt-3 sm:mt-4">Escolha as plataformas:</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {PLATFORMS.map(platform => (
            <PlatformButton
              key={platform.id}
              platform={platform}
              isSelected={selectedPlatforms.includes(platform.id)}
              onClick={() => handlePlatformToggle(platform.id)}
            />
          ))}
        </div>
        <button
          onClick={handleGenerateClick}
          disabled={isLoading || apiKeyExists === null}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base sm:text-lg"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : <span className="mr-2 text-lg">✨</span>}
          Gerar Conteúdo Viral
        </button>
      </div>

      <div className="bg-white/95 p-5 sm:p-8 rounded-xl shadow-xl backdrop-blur-md border border-white/30">
        <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-5 text-gray-700 flex items-center">
          <i className="fas fa-star mr-3 text-yellow-400"></i>Conteúdo Gerado
        </h3>
        <div className="bg-gray-100 p-3 sm:p-4 rounded-lg min-h-[300px] border-2 border-dashed border-gray-300 overflow-y-auto max-h-[500px] fancy-scrollbar">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <LoadingSpinner />
              <p className="mt-2">Gerando seu conteúdo viral...</p>
            </div>
          )}
          {!isLoading && generatedContents.length === 0 && (
            <p className="text-center text-gray-500 mt-[100px]">
              <i className="fas fa-arrow-left mr-2"></i> Digite sua ideia e clique em "Gerar Conteúdo Viral"
            </p>
          )}
          {!isLoading && generatedContents.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              {generatedContents.map((content, index) => {
                const platformInfo = PLATFORMS.find(p => p.id === content.platform);
                const iconClass = platformInfo?.icon || 'fas fa-question-circle'; // Fallback icon
                const platformName = platformInfo?.name || content.platform || 'Plataforma Desconhecida';

                return (
                  <div key={`${content.platform}-${index}`} className="bg-white p-3 sm:p-4 rounded-lg shadow border border-gray-200">
                    <h4 className="text-md sm:text-lg font-semibold text-indigo-600 mb-1 sm:mb-2 flex items-center">
                      <i className={`${iconClass} mr-2`}></i>
                      {platformName}
                    </h4>
                    <pre className="whitespace-pre-wrap text-sm sm:text-base text-gray-700 font-sans">{content.text}</pre>
                    <CopyButton textToCopy={content.text} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
         {bestTimes.length > 0 && !isLoading && (
            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h4 className="text-sm font-semibold text-indigo-700 mb-2"><i className="fas fa-clock mr-1"></i> Melhores horários para postar:</h4>
                <div className="flex flex-wrap gap-2">
                    {bestTimes.map(time => (
                        <span key={time} className="px-2.5 py-1 bg-indigo-500 text-white text-xs rounded-full">{time}</span>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};