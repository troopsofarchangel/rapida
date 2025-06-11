
export enum PlatformID {
  Instagram = 'instagram',
  Twitter = 'twitter',
  LinkedIn = 'linkedin',
  Facebook = 'facebook',
  TikTok = 'tiktok',
  YouTube = 'youtube',
}

export interface Platform {
  id: PlatformID;
  name: string;
  icon: string;
}

export enum TabId {
  Generator = 'generator',
  Planner = 'planner',
  Templates = 'templates',
  Analytics = 'analytics',
}

export interface AppTab {
  id: TabId;
  name: string;
  icon: string;
}

export interface Template {
  id: string;
  title: string;
  content: string;
}

export interface ScheduledItem {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  contentIdea: string;
  platform: PlatformID;
  contentType: string; // post, story, reel, video
}

export interface AnalyticsData {
  postsGenerated: number;
  platformsUsed: string[]; // Store PlatformID[]
  templatesCopied: number;
  daysPlanned: number; // Count of days with scheduled items
}

export interface MediaFile {
  name: string;
  type: 'image' | 'video' | 'audio';
  dataUrl: string; // For preview
}

export interface GeneratedContent {
  platform: PlatformID;
  text: string;
}
