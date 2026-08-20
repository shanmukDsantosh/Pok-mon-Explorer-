import React from 'react';
import { Heart, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80 py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <a
            href="https://pokeapi.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-800 dark:text-slate-200 hover:text-red-500 dark:hover:text-red-400 transition-colors inline-flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5" /> PokéAPI v2
          </a>
        </div>

        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>using React & Tailwind CSS</span>
        </div>

        <div>
          <span>© {new Date().getFullYear()} Pokémon Explorer. Nintendo / Game Freak / Creatures Inc.</span>
        </div>
      </div>
    </footer>
  );
};
