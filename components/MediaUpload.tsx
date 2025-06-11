import React from 'react';
import { MediaFile } from '../types';

interface MediaUploadProps {
  mediaFiles: MediaFile[];
  setMediaFiles: React.Dispatch<React.SetStateAction<MediaFile[]>>;
}

interface UploadBoxProps {
  id: string;
  label: string;
  icon: string;
  accept: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio') => void;
  type: 'image' | 'video' | 'audio';
}

const UploadBox: React.FC<UploadBoxProps> = ({ id, label, icon, accept, onFileChange, type}) => (
  <div className="border-2 border-dashed border-gray-300 p-3 text-center rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
    <input 
      type="file" 
      id={id} 
      accept={accept} 
      multiple 
      className="hidden"
      onChange={(e) => onFileChange(e, type)}
    />
    <label htmlFor={id} className="cursor-pointer flex flex-col items-center">
      <i className={`${icon} text-2xl text-indigo-500`}></i>
      <p className="mt-1 text-xs text-gray-600">{label}</p>
    </label>
  </div>
);


export const MediaUpload: React.FC<MediaUploadProps> = ({ mediaFiles, setMediaFiles }) => {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio') => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newMediaFiles: MediaFile[] = [];

      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newMediaFiles.push({
            name: file.name,
            type: type,
            dataUrl: e.target?.result as string,
          });
          // Update state after all files in current batch are processed
          if (newMediaFiles.length === filesArray.length) {
            setMediaFiles(prev => [...prev, ...newMediaFiles].slice(0, 5)); // Limit to 5 previews for simplicity
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMediaFile = (fileName: string) => {
    setMediaFiles(prev => prev.filter(mf => mf.name !== fileName));
  };

  return (
    <div className="my-3 sm:my-4 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h4 className="text-base sm:text-lg font-medium text-gray-600 mb-2 sm:mb-3 flex items-center">
        <i className="fas fa-images mr-2 text-indigo-500"></i>Mídia para sua Postagem (Opcional)
      </h4>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <UploadBox id="imageUpload" label="Imagens" icon="fas fa-image" accept="image/*" onFileChange={handleFileChange} type="image"/>
        <UploadBox id="videoUpload" label="Vídeo" icon="fas fa-video" accept="video/*" onFileChange={handleFileChange} type="video"/>
        <UploadBox id="audioUpload" label="Áudio" icon="fas fa-music" accept="audio/*" onFileChange={handleFileChange} type="audio"/>
      </div>
      {mediaFiles.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {mediaFiles.map(mf => (
            <div key={mf.name} className="relative group border rounded-md p-1 bg-white shadow-sm">
              {mf.type === 'image' && <img src={mf.dataUrl} alt={mf.name} className="w-full h-16 object-cover rounded-sm"/>}
              {mf.type === 'video' && <video src={mf.dataUrl} className="w-full h-16 object-cover rounded-sm" />}
              {mf.type === 'audio' && (
                <div className="w-full h-16 flex flex-col items-center justify-center bg-gray-100 rounded-sm">
                  <i className="fas fa-music text-2xl text-indigo-400"></i>
                </div>
              )}
              <p className="text-xs text-gray-700 truncate mt-1 px-1" title={mf.name}>{mf.name}</p>
              <button 
                onClick={() => removeMediaFile(mf.name)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};