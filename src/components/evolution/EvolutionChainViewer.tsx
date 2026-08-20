import React from 'react';
import { useEvolutionChain } from '../../hooks/useEvolutionChain';
import { TypeBadge } from '../pokemon/TypeBadge';
import { capitalize, formatId } from '../../utils/formatters';
import { ArrowRight, Loader2, Gem, Compass } from 'lucide-react';
import type { PokemonType } from '../../types/pokemon';

interface EvolutionChainViewerProps {
  pokemonId: number;
  currentPokemonId: number;
  onSelectPokemon?: (id: number) => void;
}

export const EvolutionChainViewer: React.FC<EvolutionChainViewerProps> = ({
  pokemonId,
  currentPokemonId,
  onSelectPokemon,
}) => {
  const { data, isLoading, error } = useEvolutionChain(pokemonId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        <span className="text-xs font-bold font-mono">Loading Evolution Chain & Forms...</span>
      </div>
    );
  }

  if (error || !data || data.evolutions.length === 0) {
    return null;
  }

  const getTypeBgColor = (typeName: string, isMega?: boolean, region?: string) => {
    if (isMega) {
      return 'bg-gradient-to-b from-purple-100/90 to-amber-100/90 dark:from-purple-950/80 dark:to-amber-950/80 text-purple-900 dark:text-purple-100 border-purple-300 dark:border-purple-700';
    }
    if (region) {
      return 'bg-gradient-to-b from-sky-100/90 to-teal-100/90 dark:from-sky-950/80 dark:to-teal-950/80 text-sky-900 dark:text-sky-100 border-sky-300 dark:border-sky-700';
    }
    switch (typeName) {
      case 'grass':
        return 'bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 border-emerald-300 dark:border-emerald-800';
      case 'fire':
        return 'bg-amber-100/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-100 border-amber-300 dark:border-amber-800';
      case 'water':
        return 'bg-sky-100/90 dark:bg-sky-950/60 text-sky-900 dark:text-sky-100 border-sky-300 dark:border-sky-800';
      case 'electric':
        return 'bg-yellow-100/90 dark:bg-yellow-950/60 text-yellow-900 dark:text-yellow-100 border-yellow-300 dark:border-yellow-800';
      case 'psychic':
        return 'bg-pink-100/90 dark:bg-pink-950/60 text-pink-900 dark:text-pink-100 border-pink-300 dark:border-pink-800';
      default:
        return 'bg-slate-100/90 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700';
    }
  };

  // Combine standard evolution stages + Mega forms + Regional forms into unified chain list
  const fullChainList: {
    id: number;
    name: string;
    sprite: string;
    types: PokemonType[];
    evolutionMethod: string;
    isMega?: boolean;
    region?: string;
  }[] = [];

  // Add standard evolution stages
  data.evolutions.forEach((stage, idx) => {
    fullChainList.push({
      id: stage.pokemon.id,
      name: stage.pokemon.name,
      sprite: stage.pokemon.sprite,
      types: stage.pokemon.types,
      evolutionMethod: idx === 0 ? 'Base Form' : stage.evolutionMethod,
    });
  });

  // Append Mega Evolutions if present for this species
  if (data.megaForms && data.megaForms.length > 0) {
    data.megaForms.forEach((mega) => {
      fullChainList.push({
        id: mega.id,
        name: mega.name,
        sprite: mega.sprite,
        types: mega.types,
        evolutionMethod: mega.megaStone || 'Mega Stone',
        isMega: true,
      });
    });
  }

  // Append Regional Variants if present for this species
  if (data.regionalForms && data.regionalForms.length > 0) {
    data.regionalForms.forEach((reg) => {
      fullChainList.push({
        id: reg.id,
        name: reg.name,
        sprite: reg.sprite,
        types: reg.types,
        evolutionMethod: `${reg.region} Form`,
        region: reg.region,
      });
    });
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h4 className="text-base font-black tracking-tight text-slate-800 dark:text-slate-200">
          Evolution Chain & Alternate Forms
        </h4>
        <span className="text-[11px] font-bold text-slate-400">
          Click any card to select
        </span>
      </div>

      {/* Horizontal Chain Flow Container */}
      <div className="flex items-center justify-start gap-3 sm:gap-5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        {fullChainList.map((item, idx) => {
          const isSelected = item.id === currentPokemonId;
          const primaryType = item.types[0] || 'normal';
          const typeBg = getTypeBgColor(primaryType, item.isMega, item.region);

          return (
            <React.Fragment key={`${item.id}-${item.name}-${idx}`}>
              {/* Vertical Pill Card matching reference Image 2 */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => onSelectPokemon && onSelectPokemon(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectPokemon && onSelectPokemon(item.id);
                  }
                }}
                className={`relative min-w-[125px] sm:min-w-[140px] p-4 rounded-3xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center group border ${typeBg} ${
                  isSelected
                    ? 'ring-4 ring-emerald-400/60 shadow-lg scale-105 font-bold'
                    : 'hover:scale-105 hover:shadow-md'
                }`}
              >
                {/* Mega or Regional Badge */}
                {item.isMega && (
                  <span className="absolute -top-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 text-white font-mono text-[9px] font-black uppercase shadow flex items-center gap-1">
                    <Gem className="w-2.5 h-2.5" /> Mega
                  </span>
                )}
                {item.region && (
                  <span className="absolute -top-2 px-2 py-0.5 rounded-full bg-sky-500 text-white font-mono text-[9px] font-black uppercase shadow flex items-center gap-1">
                    <Compass className="w-2.5 h-2.5" /> {item.region}
                  </span>
                )}

                {/* Sprite Image */}
                <div className="relative w-20 h-20 my-1 flex items-center justify-center">
                  <img
                    src={item.sprite}
                    alt={item.name}
                    className="relative z-10 w-20 h-20 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                    }}
                  />
                </div>

                {/* ID & Name */}
                <span className="font-mono text-[11px] font-extrabold opacity-70">
                  {formatId(item.id)}
                </span>
                <h5 className="text-xs sm:text-sm font-black tracking-tight my-1 line-clamp-1">
                  {capitalize(item.name)}
                </h5>

                {/* Type Badges */}
                <div className="flex flex-wrap justify-center gap-1 mt-1.5">
                  {item.types.map((type) => (
                    <TypeBadge key={type} type={type} size="sm" />
                  ))}
                </div>
              </div>

              {/* Connecting Arrow with Evolution Level / Requirement */}
              {idx < fullChainList.length - 1 && (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-1 px-0.5">
                  <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <span className="font-mono text-[10px] font-extrabold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {fullChainList[idx + 1].evolutionMethod}
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
