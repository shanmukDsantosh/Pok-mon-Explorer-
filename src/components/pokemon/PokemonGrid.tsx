import React from 'react';
import type { Pokemon } from '../../types/pokemon';
import { PokemonCard } from './PokemonCard';
import { ShimmerCard } from './ShimmerCard';
import { GridSkeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';

interface PokemonGridProps {
  pokemonList: Pokemon[];
  favorites: number[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  onSelectPokemon: (pokemon: Pokemon) => void;
  onToggleFavorite: (pokemonId: number) => void;
  onLoadMore: () => void;
  onRetry: () => void;
  onClearFilters?: () => void;
  onOpen3DViewer?: (pokemon: Pokemon) => void;
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({
  pokemonList,
  favorites,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  onSelectPokemon,
  onToggleFavorite,
  onLoadMore,
  onRetry,
  onClearFilters,
  onOpen3DViewer,
}) => {
  // Infinite scroll trigger hook using IntersectionObserver
  const triggerRef = useInfiniteScroll({
    onIntersect: onLoadMore,
    hasMore,
    isLoading: isLoadingMore,
  });

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (isLoading && pokemonList.length === 0) {
    return <GridSkeleton count={12} />;
  }

  if (!isLoading && pokemonList.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <div className="space-y-10 w-full">
      {/* Cards Grid with Shimmer Effect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pokemonList.map((pokemon) => {
          const isFav = favorites.includes(pokemon.id);
          return (
            <ShimmerCard key={pokemon.id}>
              <PokemonCard
                pokemon={pokemon}
                isFavorite={isFav}
                onToggleFavorite={onToggleFavorite}
                onClick={onSelectPokemon}
                onOpen3DViewer={onOpen3DViewer}
              />
            </ShimmerCard>
          );
        })}
      </div>

      {/* Loading Skeleton / Spinner appended when loading more items */}
      {isLoadingMore && (
        <div className="pt-4 flex flex-col items-center gap-3">
          <GridSkeleton count={4} />
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 py-2">
            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            <span>Fetching more Pokémon...</span>
          </div>
        </div>
      )}

      {/* Sentinel Trigger Element for IntersectionObserver */}
      {hasMore && <div ref={triggerRef} className="h-12 w-full my-4" />}
    </div>
  );
};
