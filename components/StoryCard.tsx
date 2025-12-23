
import React from 'react';
import { StoryResponse, StoryTheme } from '../types';

interface StoryCardProps {
  story: StoryResponse;
  theme: StoryTheme;
  onCopy: () => void;
  isLoading?: boolean;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, theme, onCopy, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl glass animate-pulse flex flex-col gap-4">
        <div className="h-8 bg-white/10 rounded w-1/2"></div>
        <div className="h-24 bg-white/5 rounded"></div>
        <div className="h-12 bg-white/10 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl glass shadow-2xl relative group overflow-hidden border border-white/20 transition-all duration-500 hover:border-white/40">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl pointer-events-none">
        {theme === 'noir' && '🕵️'}
        {theme === 'fantasy' && '🧙‍♂️'}
        {theme === 'fantascienza' && '🚀'}
        {theme === 'horror' && '👻'}
        {theme === 'poetico' && '✨'}
        {theme === 'ironico' && '🎭'}
      </div>

      <h2 className="text-2xl font-bold mb-6 text-indigo-300 font-serif tracking-tight">
        {story.title}
      </h2>

      <div className="text-lg leading-relaxed text-gray-200 font-serif mb-6 whitespace-pre-wrap">
        {story.content}
      </div>

      <div className="text-xl font-bold text-white italic border-l-4 border-indigo-500 pl-4 py-2 bg-white/5 rounded-r-lg font-serif">
        {story.twist}
      </div>

      <div className="mt-8 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onCopy}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors flex items-center gap-2 border border-white/10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copia Testo
        </button>
      </div>
    </div>
  );
};

export default StoryCard;
