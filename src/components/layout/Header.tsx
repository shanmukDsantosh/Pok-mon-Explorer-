import React from 'react';
import { Sun, Moon, Heart, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  favoritesCount: number;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  favoritesCount,
  showFavoritesOnly,
  onToggleFavoritesOnly,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-400 p-0.5 shadow-lg shadow-red-500/30 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center relative overflow-hidden">
              {/* Pokeball Graphic */}
              <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center relative">
                <div className="absolute w-full h-[2px] bg-white top-1/2 -translate-y-1/2" />
                <div className="w-2 h-2 rounded-full bg-white border border-slate-900 z-10" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                Poké<span className="text-red-500">Explorer</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                <Sparkles className="w-3 h-3" /> PokéAPI v2
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
              Discover & explore the Pokémon universe
            </p>
          </div>
        </div>

        {/* Action Controls: Favorites Count & Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Favorites Button */}
          <button
            onClick={onToggleFavoritesOnly}
            aria-pressed={showFavoritesOnly}
            title={showFavoritesOnly ? 'Show All Pokémon' : 'Show Favorites Only'}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm ${
              showFavoritesOnly
                ? 'bg-rose-500 text-white shadow-rose-500/25 scale-105'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white text-white' : 'text-rose-500'}`} />
            <span className="hidden xs:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                showFavoritesOnly
                  ? 'bg-white text-rose-600'
                  : 'bg-rose-500 text-white'
              }`}>
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all duration-200 cursor-pointer shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
