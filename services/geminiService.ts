
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_TEXT, GEMINI_API_KEY_ERROR_MESSAGE, PLATFORMS } from '../constants';
import { PlatformID, MediaFile } from "../types";

const getApiKey = (): string | undefined => {
  let key: string | undefined = undefined;
  try {
    // Attempt 1: Standard process.env.API_KEY (and common variants like REACT_APP_API_KEY)
    if (typeof process !== 'undefined' && process.env) {
      key = process.env.API_KEY || process.env.REACT_APP_API_KEY;
    }

    // Attempt 2: Window-injected process.env.API_KEY (for CDN or special environments)
    if ((!key || key.trim() === '') && typeof window !== 'undefined' && (window as any).process?.env?.API_KEY) {
      const windowKey = (window as any).process.env.API_KEY;
      if (typeof windowKey === 'string' && windowKey.trim() !== '') {
        key = windowKey;
      }
    }
    
    if (key && typeof key === 'string' && key.trim() !== '') {
      return key.trim();
    }
  } catch (error) {
    console.error("Error retrieving API key:", error);
    return undefined;
  }
  return undefined;
};


export const generateContentWithGemini = async (
  idea: string,
  selectedPlatforms: PlatformID[],
  mediaFiles: MediaFile[]
): Promise<Array<{ platform: PlatformID; text: string }>> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error(GEMINI_API_KEY_ERROR_MESSAGE);
     return selectedPlatforms.map(platform => ({
      platform,
      text: `Erro: API Key não configurada. Conteúdo para ${platform} não pôde ser gerado. Ideia original: ${idea}`
    }));
  }

  const ai = new GoogleGenAI({ apiKey });

  const platformNames = selectedPlatforms.map(pid => PLATFORMS.find(p => p.id === pid)?.name || pid).join(', ');
  let prompt = `Baseado na ideia principal: "${idea}", gere sugestões de posts para as seguintes plataformas: ${platformNames}.
Para cada plataforma, use o nome EXATO da plataforma como fornecido na lista (ex: Instagram, Twitter).
O formato OBRIGATÓRIO para cada plataforma é:
PLATFORM: [NomeExatoDaPlataforma]
[Conteúdo gerado para esta plataforma aqui]

(Repita o bloco PLATFORM: para cada plataforma solicitada. Certifique-se que cada bloco PLATFORM: comece em uma nova linha.)

---END--- (Coloque esta marca EXATAMENTE no final de TODA a resposta, após o conteúdo de todas as plataformas)
`;
  
  if (mediaFiles.length > 0) {
    const mediaDescriptions = mediaFiles.map(mf => `${mf.type} chamada "${mf.name}"`).join(', ');
    prompt += `\nConsidere também as seguintes mídias que o usuário anexou (apenas nomes e tipos, não o conteúdo da mídia): ${mediaDescriptions}. Se apropriado, sugira como incorporá-las ou mencione-as no texto dos posts.`;
  }


  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
        config: {
          temperature: 0.7, 
          topK: 40,
          topP: 0.95,
        }
    });
    
    const rawText = response.text;

    if (typeof rawText !== 'string' || !rawText.trim()) {
        console.error("Gemini response.text is not a string or is empty:", rawText);
        return selectedPlatforms.map(p => ({
            platform: p,
            text: `Erro: Resposta da IA inválida ou vazia para ${PLATFORMS.find(pf => pf.id === p)?.name || p}.`
        }));
    }

    const results: Array<{ platform: PlatformID; text: string }> = [];
    // Remove ---END--- globally once and trim.
    const cleanText = rawText.replace(/---END---/gi, '').trim();
    
    // Regex to find "PLATFORM: PlatformName" and then capture the content until the next "PLATFORM:" or end of string.
    // (?:\n|^)PLATFORM:\s*([a-zA-ZÀ-ÿ-]+) matches "PLATFORM: PlatformName" ensuring it's at the start of a line or the string
    // ([\s\S]*?) non-greedily captures all characters (including newlines) following it.
    // (?=(?:\n|^)PLATFORM:\s*[a-zA-ZÀ-ÿ-]+|$) positive lookahead to stop before the next PLATFORM or end of string.
    const platformBlockRegex = /(?:\n|^)PLATFORM:\s*([a-zA-ZÀ-ÿ-]+)\n([\s\S]*?)(?=(?:\n|^)PLATFORM:\s*[a-zA-ZÀ-ÿ-]+|$)/gi;
    
    let match;
    while ((match = platformBlockRegex.exec(cleanText)) !== null) {
        const platformNameCandidate = match[1].trim();
        const platformContent = match[2].trim();

        // Find the PlatformID enum key that matches the platformNameCandidate (case-insensitive)
        const platformEnumKey = Object.keys(PlatformID).find(
            key => (PlatformID[key as keyof typeof PlatformID] as string).toLowerCase() === platformNameCandidate.toLowerCase()
        );

        if (platformEnumKey && platformContent) {
            results.push({ platform: PlatformID[platformEnumKey as keyof typeof PlatformID], text: platformContent });
        } else {
            console.warn(`Could not map platform name "${platformNameCandidate}" to a known PlatformID or content was empty.`);
        }
    }
    
    // If specific parsing failed but we have some text, distribute it as a general response.
    if (results.length === 0 && cleanText) {
      console.warn("Failed to parse specific platform blocks. Using raw text as fallback for selected platforms.");
      selectedPlatforms.forEach(pform => {
        results.push({ platform: pform, text: `(Resposta não pôde ser dividida por plataforma)\n${cleanText}` });
      });
    }

    // Ensure all originally selected platforms have an entry in results, even if it's a fallback.
    selectedPlatforms.forEach(sp => {
        if (!results.some(r => r.platform === sp)) {
            const platformName = PLATFORMS.find(p => p.id === sp)?.name || sp;
            results.push({ platform: sp, text: `Não foi possível gerar ou analisar conteúdo específico para ${platformName}. Verifique a resposta bruta da IA se disponível ou tente novamente.` });
        }
    });

    if (results.length === 0) { // Should be caught by above, but as a final safety net
        return selectedPlatforms.map(p => ({
            platform: p,
            text: `Não foi possível analisar a resposta da IA para ${PLATFORMS.find(pf => pf.id === p)?.name || p}. Resposta bruta: ${rawText}`
        }));
    }

    return results;

  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    return selectedPlatforms.map(platform => ({
      platform,
      text: `Erro ao gerar conteúdo para ${PLATFORMS.find(p => p.id === platform)?.name || platform} via IA. Detalhes: ${(error as Error).message}`
    }));
  }
};
