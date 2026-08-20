import React from 'react';
import type { PokemonType } from '../../types/pokemon';
import { getTypeColorConfig } from '../../utils/typeColors';
import { capitalize } from '../../utils/formatters';

const ALL_TYPES: (PokemonType | 'all')[] = [
  'all',
  'normal',
  'fire',
  'water',
  'grass',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

interface TypeFilterProps {
  selectedType: PokemonType | 'all';
  onSelectType: (type: PokemonType | 'all') => void;
}

export const TypeFilter: React.FC<TypeFilterProps> = ({
  selectedType,
  onSelectType,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
      <div className="flex items-center gap-2 min-w-max md:flex-wrap md:min-w-0">
        {ALL_TYPES.map((type) => {
          const isSelected = selectedType === type;
          
          if (type === 'all') {
            return (
              <button
                key="all"
                type="button"
                onClick={() => onSelectType('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md scale-105'
                    : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                All Types
              </button>
            );
          }

          const config = getTypeColorConfig(type);

          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelectType(type)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                isSelected
                  ? `${config.badgeBg} ${config.badgeText} ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-600 shadow-md scale-105`
                  : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {capitalize(type)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
