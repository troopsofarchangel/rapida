
import { Platform, PlatformID, AppTab, TabId, Template, AnalyticsData } from './types';

export const PLATFORMS: Platform[] = [
  { id: PlatformID.Instagram, name: 'Instagram', icon: 'fab fa-instagram' },
  { id: PlatformID.Twitter, name: 'Twitter', icon: 'fab fa-twitter' },
  { id: PlatformID.LinkedIn, name: 'LinkedIn', icon: 'fab fa-linkedin' },
  { id: PlatformID.Facebook, name: 'Facebook', icon: 'fab fa-facebook' },
  { id: PlatformID.TikTok, name: 'TikTok', icon: 'fab fa-tiktok' },
  { id: PlatformID.YouTube, name: 'YouTube', icon: 'fab fa-youtube' },
];

export const TABS: AppTab[] = [
  { id: TabId.Generator, name: 'Gerador de Conteúdo', icon: 'fas fa-magic' },
  { id: TabId.Planner, name: 'Planejador Mensal', icon: 'fas fa-calendar' },
  { id: TabId.Templates, name: 'Templates Virais', icon: 'fas fa-file-alt' },
  { id: TabId.Analytics, name: 'Analytics', icon: 'fas fa-chart-line' },
];

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 't1',
    title: '🔥 Template Viral - Lista',
    content: '[NÚMERO] [CATEGORIA] que vão [BENEFÍCIO]\n\nExemplo: "5 apps que vão revolucionar sua produtividade"',
  },
  {
    id: 't2',
    title: '💡 Template Dica Rápida',
    content: 'Você sabia que [FATO INTERESSANTE]?\n\nIsso pode [BENEFÍCIO] porque [EXPLICAÇÃO]\n\nExperimente e me conta nos comentários!',
  },
  {
    id: 't3',
    title: '⚡ Template Antes vs Depois',
    content: 'ANTES: [SITUAÇÃO RUIM]\nDEPOIS: [SITUAÇÃO BOA]\n\nO que mudou? [SOLUÇÃO]\n\nSalva esse post! 📌',
  },
  {
    id: 't4',
    title: '🎯 Template Pergunta Engajamento',
    content: '[PERGUNTA CONTROVERSA]\n\nEu acredito que [SUA OPINIÃO]\n\nE você? Concorda ou discorda?\nComenta aí embaixo! 👇',
  },
  {
    id: 't5',
    title: '🏆 Template Storytelling',
    content: 'Era [TEMPO], e eu [SITUAÇÃO INICIAL]\n\nEntão descobri [DESCOBERTA]\n\nResultado: [TRANSFORMAÇÃO]\n\nA lição? [MORAL DA HISTÓRIA]',
  },
  {
    id: 't6',
    title: '📊 Template Estatística',
    content: '[ESTATÍSTICA IMPRESSIONANTE]\n\nIsso significa que [INTERPRETAÇÃO]\n\nPara você não ser parte dessa estatística:\n• [DICA 1]\n• [DICA 2]\n• [DICA 3]',
  },
];

export const INITIAL_ANALYTICS: AnalyticsData = {
  postsGenerated: 0,
  platformsUsed: [],
  templatesCopied: 0,
  daysPlanned: 0,
};

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_API_KEY_ERROR_MESSAGE = "API Key for Gemini not found. Please set the API_KEY environment variable.";

export const DEFAULT_PLATFORM_CONTENT_TYPE_OPTIONS: Record<PlatformID, string[]> = {
    [PlatformID.Instagram]: ['Post', 'Story', 'Reel'],
    [PlatformID.Twitter]: ['Tweet', 'Thread'],
    [PlatformID.LinkedIn]: ['Post', 'Article'],
    [PlatformID.Facebook]: ['Post', 'Story', 'Video'],
    [PlatformID.TikTok]: ['Video', 'Story'],
    [PlatformID.YouTube]: ['Video', 'Short', 'Community Post'],
};
