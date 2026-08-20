import React from 'react';
import type { EvolutionStage } from '../../types/pokemon';
import { TypeBadge } from '../pokemon/TypeBadge';
import { capitalize, formatId } from '../../utils/formatters';
import { Sparkles, ArrowRight } from 'lucide-react';

interface EvolutionStageCardProps {
  stage: EvolutionStage;
  isCurrent?: boolean;
  onSelect?: (pokemonId: number) => void;
  showArrow?: boolean;
}

export const EvolutionStageCard: React.FC<EvolutionStageCardProps> = ({
  stage,
  isCurrent = false,
  onSelect,
  showArrow = false,
}) => {
  const { pokemon, evolutionMethod } = stage;

  return (
    <div className="flex items-center gap-3">
      {/* Stage Card */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect && onSelect(pokemon.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onSelect && onSelect(pokemon.id);
          }
        }}
        className={`relative w-36 sm:w-40 p-4 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center group ${
          isCurrent
            ? 'bg-red-500/10 dark:bg-red-500/20 border-2 border-red-500 shadow-lg shadow-red-500/20 scale-105'
            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-500 hover:-translate-y-1 shadow-sm'
        }`}
      >
        {/* Current Stage Indicator Badge */}
        {isCurrent && (
          <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-red-500 text-white font-mono text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Current
          </span>
        )}

        {/* ID Badge */}
        <span className="font-mono text-[10px] font-extrabold text-slate-400 mb-1">
          {formatId(pokemon.id)}
        </span>

        {/* Sprite */}
        <div className="relative w-20 h-20 my-1 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/60 rounded-full blur-md group-hover:scale-110 transition-transform" />
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="relative z-10 w-20 h-20 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
            }}
          />
        </div>

        {/* Name */}
        <h5 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-red-500 transition-colors">
          {capitalize(pokemon.name)}
        </h5>

        {/* Type Badges */}
        <div className="flex flex-wrap justify-center gap-1 my-2">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} size="sm" />
          ))}
        </div>

        {/* Evolution Requirement Badge */}
        <div className="w-full mt-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 px-2 py-1 rounded-lg truncate">
          {evolutionMethod}
        </div>
      </div>

      {/* Connecting Arrow */}
      {showArrow && (
        <div className="hidden sm:flex flex-col items-center justify-center text-slate-400">
          <ArrowRight className="w-6 h-6 text-red-500 animate-pulse" />
        </div>
      )}
    </div>
  );
};
