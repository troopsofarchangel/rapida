import React, { useState } from 'react';

interface CopyButtonProps {
  textToCopy: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Não foi possível copiar o texto.');
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`mt-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200
        ${copied 
          ? 'bg-green-500 text-white' 
          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
        }`}
    >
      {copied ? <><i className="fas fa-check mr-1"></i>Copiado!</> : <><i className="fas fa-copy mr-1"></i>Copiar</>}
    </button>
  );
};