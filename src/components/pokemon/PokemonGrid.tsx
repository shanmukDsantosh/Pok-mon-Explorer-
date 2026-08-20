import React from 'react';
import type { Pokemon } from '../../types/pokemon';
import { PokemonCard } from './PokemonCard';
import { GridSkeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { ChevronDown } from 'lucide-react';

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
}) => {
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
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pokemonList.map((pokemon) => {
          const isFav = favorites.includes(pokemon.id);
          return (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isFavorite={isFav}
              onToggleFavorite={onToggleFavorite}
              onClick={onSelectPokemon}
            />
          );
        })}
      </div>

      {/* Load More button & skeleton append area */}
      {isLoadingMore && (
        <div className="pt-4">
          <GridSkeleton count={4} />
        </div>
      )}

      {hasMore && !isLoadingMore && (
        <div className="flex justify-center pt-6 pb-12">
          <Button
            size="lg"
            variant="secondary"
            onClick={onLoadMore}
            isLoading={isLoadingMore}
            rightIcon={<ChevronDown className="w-5 h-5" />}
            className="shadow-lg hover:scale-105 transition-transform font-bold px-8 py-3.5 rounded-2xl"
          >
            Load More Pokémon
          </Button>
        </div>
      )}
    </div>
  );
};
