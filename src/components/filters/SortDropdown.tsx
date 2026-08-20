import React from 'react';
import { ArrowUpDown, Heart } from 'lucide-react';
import type { SortOption } from '../../types/pokemon';

interface SortDropdownProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  favoritesCount?: number;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  sortBy,
  onSortChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount = 0,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
      {/* Show Favorites Only toggle button */}
      <button
        type="button"
        onClick={onToggleFavoritesOnly}
        aria-pressed={showFavoritesOnly}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer border shadow-sm ${
          showFavoritesOnly
            ? 'bg-rose-500 text-white border-rose-500 shadow-rose-500/20'
            : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <Heart
          className={`w-4 h-4 ${
            showFavoritesOnly ? 'fill-white text-white' : 'text-rose-500'
          }`}
        />
        <span>Favorites</span>
        {favoritesCount > 0 && (
          <span
            className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
              showFavoritesOnly
                ? 'bg-white text-rose-600'
                : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
            }`}
          >
            {favoritesCount}
          </span>
        )}
      </button>

      {/* Sort selection dropdown */}
      <div className="relative flex-1 sm:flex-initial">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <ArrowUpDown className="w-4 h-4" />
        </div>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Sort Pokémon"
          className="w-full sm:w-auto pl-9 pr-8 py-2.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-sm backdrop-blur-md"
        >
          <option value="id-asc">Sort: ID (Low to High)</option>
          <option value="id-desc">Sort: ID (High to Low)</option>
          <option value="name-asc">Sort: Name (A to Z)</option>
          <option value="name-desc">Sort: Name (Z to A)</option>
          <option value="hp-high-low">Sort: HP (High to Low)</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
