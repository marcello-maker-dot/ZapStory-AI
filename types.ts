
export type StoryTheme = 'noir' | 'fantasy' | 'fantascienza' | 'horror' | 'poetico' | 'ironico';

export interface StoryResponse {
  title: string;
  content: string;
  twist: string;
}

export interface HistoryItem {
  id: string;
  input: string;
  theme: StoryTheme;
  story: StoryResponse;
  timestamp: number;
}
