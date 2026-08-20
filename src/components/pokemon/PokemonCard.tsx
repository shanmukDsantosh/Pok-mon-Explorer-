import React, { useState } from 'react';
import { Heart, Volume2, Sparkles } from 'lucide-react';
import type { Pokemon } from '../../types/pokemon';
import { getTypeGradient } from '../../utils/typeColors';
import { capitalize, formatId, getPokemonImage } from '../../utils/formatters';
import { TypeBadge } from './TypeBadge';

interface PokemonCardProps {
  pokemon: Pokemon;
  isFavorite?: boolean;
  onToggleFavorite?: (pokemonId: number) => void;
  onClick: (pokemon: Pokemon) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isFavorite = false,
  onToggleFavorite,
  onClick,
}) => {
  const [isShiny, setIsShiny] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const primaryType = pokemon.types[0]?.type.name;
  const gradientClass = getTypeGradient(primaryType);
  const imageUrl = getPokemonImage(pokemon, isShiny);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(pokemon.id);
    }
  };

  const handleShinyToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShiny((prev) => !prev);
  };

  const handlePlayCry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cryUrl = pokemon.cries?.latest || pokemon.cries?.legacy;
    if (!cryUrl) return;

    try {
      setIsPlayingAudio(true);
      const audio = new Audio(cryUrl);
      audio.volume = 0.5;
      audio.play().catch((err) => console.warn('Cry audio play error:', err));
      audio.onended = () => setIsPlayingAudio(false);
    } catch (err) {
      console.warn('Audio play failure:', err);
      setIsPlayingAudio(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(pokemon);
    }
  };

  // Get HP, Attack, Defense stats for quick display
  const hpStat = pokemon.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0;
  const atkStat = pokemon.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0;
  const defStat = pokemon.stats.find((s) => s.stat.name === 'defense')?.base_stat || 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(pokemon)}
      onKeyDown={handleKeyDown}
      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradientClass} p-0.5 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-red-400/50 flex flex-col justify-between`}
    >
      {/* Inner glass card backdrop */}
      <div className="h-full w-full bg-white/85 dark:bg-slate-900/90 backdrop-blur-md rounded-[22px] p-5 flex flex-col justify-between relative z-10">
        
        {/* Top Header: ID, Audio Cry, Shiny & Favorite Buttons */}
        <div className="flex items-center justify-between gap-2 z-20">
          <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-inner">
            {formatId(pokemon.id)}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Audio Cry Button */}
            {(pokemon.cries?.latest || pokemon.cries?.legacy) && (
              <button
                type="button"
                onClick={handlePlayCry}
                title="Play Pokémon Cry"
                aria-label={`Play ${pokemon.name} sound cry`}
                className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-amber-400 text-slate-900 scale-110 animate-bounce'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}

            {/* Shiny Sprite Toggle */}
            <button
              type="button"
              onClick={handleShinyToggle}
              title={isShiny ? 'Show Normal Sprite' : 'Show Shiny Sprite'}
              aria-label="Toggle shiny sprite"
              className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                isShiny
                  ? 'bg-amber-300 dark:bg-amber-400 text-amber-950 shadow-md scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Favorite Heart Button */}
            <button
              type="button"
              onClick={handleFavoriteClick}
              title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              aria-label="Favorite button"
              className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                isFavorite
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-500 scale-110 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Center Pokémon Image */}
        <div className="relative my-4 flex items-center justify-center min-h-[140px]">
          {/* Subtle background glow circle */}
          <div className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-slate-200/40 dark:bg-slate-800/40 blur-xl group-hover:scale-125 transition-transform duration-500" />
          
          <img
            src={imageUrl}
            alt={pokemon.name}
            loading="lazy"
            className="relative z-10 w-32 h-32 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                pokemon.sprites.front_default ||
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
            }}
          />
        </div>

        {/* Bottom Section: Name & Type Badges */}
        <div className="space-y-3 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
            {capitalize(pokemon.name)}
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
            ))}
          </div>

          {/* Quick Stats Bar Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-slate-400">HP</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">{hpStat}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-slate-400">ATK</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">{atkStat}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-slate-400">DEF</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">{defStat}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
