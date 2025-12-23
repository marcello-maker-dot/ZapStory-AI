
import React, { useState, useCallback, useEffect } from 'react';
import { THEMES, SUGGESTIONS } from './constants';
import { StoryTheme, StoryResponse, HistoryItem } from './types';
import { generateStory } from './services/geminiService';
import StoryCard from './components/StoryCard';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [activeTheme, setActiveTheme] = useState<StoryTheme>('poetico');
  const [loading, setLoading] = useState(false);
  const [currentStory, setCurrentStory] = useState<StoryResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Initial load of history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('microfavola_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  const saveToHistory = useCallback((story: StoryResponse, input: string, theme: StoryTheme) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      input,
      theme,
      story,
      timestamp: Date.now()
    };
    const updated = [newItem, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('microfavola_history', JSON.stringify(updated));
  }, [history]);

  const handleGenerate = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    setCurrentStory(null);
    try {
      const themeConfig = THEMES.find(t => t.id === activeTheme);
      const story = await generateStory(input, activeTheme, themeConfig?.prompt || '');
      setCurrentStory(story);
      saveToHistory(story, input, activeTheme);
    } catch (error) {
      alert("Ops! Qualcosa è andato storto. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!currentStory) return;
    const text = `${currentStory.title}\n\n${currentStory.content}\n\n${currentStory.twist}`;
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleSuggestion = (txt: string) => {
    setInput(txt);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 font-serif">
            MicroFavola AI
          </h1>
          <p className="text-indigo-200 text-lg font-light tracking-wide max-w-xl mx-auto">
            Trasforma poche parole in storie brevi e spiazzanti. 
            Inserisci un'idea, scegli un'atmosfera e lasciati sorprendere.
          </p>
        </header>

        {/* Input Section */}
        <div className="glass p-8 rounded-3xl space-y-8 shadow-xl">
          <div className="space-y-4">
            <label className="block text-sm font-semibold uppercase tracking-widest text-indigo-300">
              Di cosa vuoi parlare?
            </label>
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Esempio: un astronauta malinconico..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/20 group-hover:bg-white/10"
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !input.trim()}
                className={`absolute right-3 top-2 bottom-2 px-6 rounded-xl font-bold flex items-center gap-2 transition-all ${
                  loading || !input.trim() 
                  ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20'
                }`}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Crea
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
            
            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 pt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 text-indigo-200 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold uppercase tracking-widest text-indigo-300">
              Scegli l'atmosfera
            </label>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 gap-2 ${
                    activeTheme === theme.id 
                    ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-400/20 shadow-lg' 
                    : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  <span className="text-2xl">{theme.icon}</span>
                  <span className="text-xs font-medium uppercase tracking-tighter">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Section */}
        {(currentStory || loading) && (
          <div className="py-8">
            <StoryCard 
              story={currentStory || { title: '', content: '', twist: '' }} 
              theme={activeTheme} 
              onCopy={handleCopy}
              isLoading={loading}
            />
            {copyFeedback && (
              <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce">
                Copiato negli appunti! 📋
              </div>
            )}
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="space-y-6 pt-12 border-t border-white/10">
            <h3 className="text-xl font-bold font-serif text-indigo-300">I tuoi ultimi racconti</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentStory(item.story);
                    setInput(item.input);
                    setActiveTheme(item.theme);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="glass p-4 rounded-2xl text-left border border-white/5 hover:border-indigo-500/30 transition-all hover:bg-white/10 group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                      {THEMES.find(t => t.id === item.theme)?.label}
                    </span>
                    <span className="text-[10px] text-white/30">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-100 mb-1 truncate group-hover:text-indigo-300 transition-colors">
                    {item.story.title}
                  </h4>
                  <p className="text-sm text-gray-400 line-clamp-2 italic">
                    "{item.input}"
                  </p>
                </button>
              ))}
            </div>
            <button 
              onClick={() => { setHistory([]); localStorage.removeItem('microfavola_history'); }}
              className="text-xs text-white/30 hover:text-red-400 transition-colors"
            >
              Cancella cronologia
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center pt-12 text-white/20 text-sm">
          <p>© 2024 MicroFavola AI • Alimentato da Gemini 3</p>
          <p className="mt-1">Le storie sono generate dall'IA e possono contenere elementi fittizi.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
