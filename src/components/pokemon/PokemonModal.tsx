import React, { useState } from 'react';
import type { Pokemon } from '../../types/pokemon';
import { Modal } from '../ui/Modal';
import { TypeBadge } from './TypeBadge';
import { EvolutionChainViewer } from '../evolution/EvolutionChainViewer';
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
import { Star, Volume2, Sparkles, ChevronLeft, ChevronRight, Zap, Shield, Heart as HpIcon, Flame, Gauge } from 'lucide-react';
import { fetchPokemonByNameOrId } from '../../services/pokemonApi';

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (pokemonId: number) => void;
  onPrevPokemon?: () => void;
  onNextPokemon?: () => void;
  onSelectPokemon?: (pokemon: Pokemon) => void;
}

export const PokemonModal: React.FC<PokemonModalProps> = ({
  pokemon,
  isOpen,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  onPrevPokemon,
  onNextPokemon,
  onSelectPokemon,
}) => {
  const [isShiny, setIsShiny] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!pokemon) return null;

  const primaryType = pokemon.types[0]?.type.name || 'grass';
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

  const handleSelectStageId = (id: number) => {
    if (onSelectPokemon) {
      fetchPokemonByNameOrId(id)
        .then((p) => onSelectPokemon(p))
        .catch(() => null);
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
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl" showCloseButton={false}>
      <div className="-m-6 overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        
        {/* Top Header Card Banner matching Image 2 */}
        <div className={`relative bg-gradient-to-br ${gradientClass} p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6`}>
          
          {/* Left Header Info */}
          <div className="space-y-3 flex-1 text-white">
            {/* Nav controls */}
            <div className="flex items-center gap-2 mb-2">
              {onPrevPokemon && (
                <button
                  onClick={onPrevPokemon}
                  title="Previous Pokémon"
                  aria-label="Previous Pokémon"
                  className="p-1.5 rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-md transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
              )}
              {onNextPokemon && (
                <button
                  onClick={onNextPokemon}
                  title="Next Pokémon"
                  aria-label="Next Pokémon"
                  className="p-1.5 rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-md transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              )}

              {/* Sound cry */}
              {(pokemon.cries?.latest || pokemon.cries?.legacy) && (
                <button
                  onClick={handlePlayCry}
                  title="Play Cry"
                  aria-label="Play sound cry"
                  className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-amber-400 text-slate-950 scale-110 animate-bounce'
                      : 'bg-black/20 hover:bg-black/30 text-white'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}

              {/* Shiny toggle */}
              <button
                onClick={() => setIsShiny((prev) => !prev)}
                title={isShiny ? 'Show Normal Artwork' : 'Show Shiny Artwork'}
                aria-label="Toggle shiny sprite"
                className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  isShiny
                    ? 'bg-amber-300 text-slate-950 shadow-lg scale-105'
                    : 'bg-black/20 hover:bg-black/30 text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </button>

              {/* Favorite Star */}
              {onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(pokemon.id)}
                  title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  aria-label="Favorite button"
                  className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                    isFavorite
                      ? 'bg-amber-400 text-slate-950 shadow-lg scale-110'
                      : 'bg-black/20 hover:bg-black/30 text-white'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-950' : ''}`} />
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-md text-white transition-colors cursor-pointer ml-auto md:ml-2"
              >
                ✕
              </button>
            </div>

            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-md">
                {capitalize(pokemon.name)}
              </h2>
              <span className="font-mono font-extrabold text-lg opacity-80">
                {formatId(pokemon.id)}
              </span>
            </div>

            <p className="text-xs font-semibold opacity-80">
              {capitalize(pokemon.name)} • Height: {meters} ({feet}) • Weight: {kg} ({lbs})
            </p>

            <div className="flex gap-2 pt-2">
              {pokemon.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} size="md" />
              ))}
            </div>
          </div>

          {/* Right Sprite Image Circle */}
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl transform scale-110" />
            <img
              src={imageUrl}
              alt={pokemon.name}
              className="relative z-10 w-44 h-44 sm:w-48 sm:h-48 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  pokemon.sprites.front_default ||
                  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
              }}
            />
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* STATS SUMMARY TOTAL BADGE */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs font-extrabold">
            <span className="uppercase text-slate-400 tracking-wider">Base Stat Total</span>
            <span className="text-lg font-mono font-black text-emerald-600 dark:text-emerald-400">
              TOTAL {baseStatTotal}
            </span>
          </div>

          {/* EVOLUTION CHAIN COMPONENT MATCHING IMAGE 2 */}
          <EvolutionChainViewer
            pokemonId={pokemon.id}
            currentPokemonId={pokemon.id}
            onSelectPokemon={handleSelectStageId}
          />

          {/* Base Stats Progress Bars */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Base Stats
            </h4>

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
