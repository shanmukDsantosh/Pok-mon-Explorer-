import React, { useState } from 'react';
import type { Pokemon } from '../../types/pokemon';
import { Modal } from '../ui/Modal';
import { TypeBadge } from './TypeBadge';
import {
  capitalize,
  formatHeight,
  formatId,
  formatWeight,
  getPokemonImage,
  getStatColorClass,
  getStatLabel,
} from '../../utils/formatters';
import { getTypeGradient } from '../../utils/typeColors';
import { Heart, Volume2, Sparkles, ChevronLeft, ChevronRight, Zap, Shield, Heart as HpIcon, Flame, Gauge } from 'lucide-react';

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (pokemonId: number) => void;
  onPrevPokemon?: () => void;
  onNextPokemon?: () => void;
}

export const PokemonModal: React.FC<PokemonModalProps> = ({
  pokemon,
  isOpen,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  onPrevPokemon,
  onNextPokemon,
}) => {
  const [isShiny, setIsShiny] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!pokemon) return null;

  const primaryType = pokemon.types[0]?.type.name;
  const gradientClass = getTypeGradient(primaryType);
  const imageUrl = getPokemonImage(pokemon, isShiny);
  const { meters, feet } = formatHeight(pokemon.height);
  const { kg, lbs } = formatWeight(pokemon.weight);

  const baseStatTotal = pokemon.stats.reduce((acc, curr) => acc + curr.base_stat, 0);

  const handlePlayCry = () => {
    const cryUrl = pokemon.cries?.latest || pokemon.cries?.legacy;
    if (!cryUrl) return;

    try {
      setIsPlayingAudio(true);
      const audio = new Audio(cryUrl);
      audio.volume = 0.5;
      audio.play().catch((err) => console.warn('Cry play error:', err));
      audio.onended = () => setIsPlayingAudio(false);
    } catch (err) {
      console.warn('Audio play failure:', err);
      setIsPlayingAudio(false);
    }
  };

  const getStatIcon = (statName: string) => {
    switch (statName) {
      case 'hp':
        return <HpIcon className="w-3.5 h-3.5 text-rose-500" />;
      case 'attack':
        return <Flame className="w-3.5 h-3.5 text-orange-500" />;
      case 'defense':
        return <Shield className="w-3.5 h-3.5 text-blue-500" />;
      case 'special-attack':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'special-defense':
        return <Shield className="w-3.5 h-3.5 text-indigo-500" />;
      case 'speed':
        return <Gauge className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="3xl" showCloseButton={false}>
      <div className="-m-6 overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {/* Top Header Card Banner with Type Gradient */}
        <div className={`relative bg-gradient-to-br ${gradientClass} p-6 sm:p-8 flex flex-col justify-between`}>
          {/* Top Controls: Prev, Next, Close, Favorite, Shiny */}
          <div className="flex items-center justify-between text-white z-20">
            <div className="flex items-center gap-2">
              {onPrevPokemon && (
                <button
                  onClick={onPrevPokemon}
                  title="Previous Pokémon"
                  aria-label="Previous Pokémon"
                  className="p-2 rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-md transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
              )}
              {onNextPokemon && (
                <button
                  onClick={onNextPokemon}
                  title="Next Pokémon"
                  aria-label="Next Pokémon"
                  className="p-2 rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-md transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              )}
              <span className="font-mono font-black text-sm px-3 py-1 rounded-full bg-black/20 backdrop-blur-md tracking-wider">
                {formatId(pokemon.id)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Play Cry Sound */}
              {(pokemon.cries?.latest || pokemon.cries?.legacy) && (
                <button
                  onClick={handlePlayCry}
                  title="Play Cry"
                  aria-label="Play sound cry"
                  className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-amber-400 text-slate-950 scale-110 animate-bounce'
                      : 'bg-black/20 hover:bg-black/30 text-white'
                  }`}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              )}

              {/* Shiny Toggle */}
              <button
                onClick={() => setIsShiny((prev) => !prev)}
                title={isShiny ? 'Show Normal Artwork' : 'Show Shiny Artwork'}
                aria-label="Toggle shiny sprite"
                className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  isShiny
                    ? 'bg-amber-300 text-slate-950 shadow-lg scale-105'
                    : 'bg-black/20 hover:bg-black/30 text-white'
                }`}
              >
                <Sparkles className="w-5 h-5" />
              </button>

              {/* Favorite Heart */}
              {onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(pokemon.id)}
                  title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  aria-label="Favorite button"
                  className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                    isFavorite
                      ? 'bg-rose-500 text-white shadow-lg scale-110'
                      : 'bg-black/20 hover:bg-black/30 text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                </button>
              )}

              {/* Close Modal X button */}
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-md text-white transition-colors cursor-pointer ml-2"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Large Hero Artwork display */}
          <div className="relative my-4 flex items-center justify-center min-h-[220px]">
            <div className="absolute w-56 h-56 rounded-full bg-white/20 blur-2xl transform scale-110" />
            <img
              src={imageUrl}
              alt={pokemon.name}
              className="relative z-10 w-52 h-52 sm:w-60 sm:h-60 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  pokemon.sprites.front_default ||
                  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
              }}
            />
          </div>

          {/* Pokémon Title & Type Chips */}
          <div className="text-center text-white space-y-2 z-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-md">
              {capitalize(pokemon.name)}
            </h2>
            <div className="flex justify-center gap-2 pt-1">
              {pokemon.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} size="lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Physical Attributes Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Height
              </span>
              <p className="text-base font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                {meters} <span className="text-xs font-medium text-slate-400">({feet})</span>
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Weight
              </span>
              <p className="text-base font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                {kg} <span className="text-xs font-medium text-slate-400">({lbs})</span>
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Base Exp
              </span>
              <p className="text-base font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                {pokemon.base_experience || 'N/A'} XP
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Base Stat Total
              </span>
              <p className="text-base font-extrabold text-red-500 dark:text-red-400 mt-0.5">
                {baseStatTotal}
              </p>
            </div>
          </div>

          {/* Abilities Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Abilities
            </h4>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((abilitySlot) => (
                <span
                  key={abilitySlot.ability.name}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm border ${
                    abilitySlot.is_hidden
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {capitalize(abilitySlot.ability.name)}
                  {abilitySlot.is_hidden && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200">
                      Hidden
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Base Stats Progress Bars */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Base Stats (Max 255)
              </h4>
              <span className="text-xs font-bold text-slate-400">
                BST: <strong className="text-slate-800 dark:text-slate-200">{baseStatTotal}</strong>
              </span>
            </div>

            <div className="space-y-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              {pokemon.stats.map((statSlot) => {
                const statValue = statSlot.base_stat;
                const percentage = Math.min(100, Math.round((statValue / 255) * 100));
                const barColorClass = getStatColorClass(statValue);
                const statLabel = getStatLabel(statSlot.stat.name);
                const icon = getStatIcon(statSlot.stat.name);

                return (
                  <div key={statSlot.stat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2 w-28 text-slate-600 dark:text-slate-400">
                        {icon}
                        <span>{statLabel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-900 dark:text-slate-100 w-8 text-right font-mono font-extrabold">
                          {statValue}
                        </span>
                        <span className="text-[10px] text-slate-400 w-10 text-right font-mono">
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${barColorClass}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
