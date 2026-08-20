import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Pokemon, PokemonType, SortOption } from '../types/pokemon';
import {
  fetchPokemonList,
  fetchPokemonByType,
  fetchPokemonByNameOrId,
} from '../services/pokemonApi';
import { useDebounce } from './useDebounce';
import { useLocalStorage } from './useLocalStorage';

export function usePokemon() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [limit] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedType, setSelectedType] = useState<PokemonType | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('id-asc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useLocalStorage<number[]>('pokedex-favorites', [25, 6, 150]);

  // Selected Pokemon for Modal
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // Initial Load & Type Switch
  const loadInitialPokemon = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setOffset(0);

    try {
      if (selectedType === 'all') {
        const result = await fetchPokemonList(0, limit);
        setPokemonList(result.pokemonList);
        setHasMore(result.hasMore);
      } else {
        const result = await fetchPokemonByType(selectedType, limit, 0);
        setPokemonList(result.pokemonList);
        setHasMore(result.hasMore);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while loading Pokémon.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [selectedType, limit]);

  useEffect(() => {
    loadInitialPokemon();
  }, [loadInitialPokemon]);

  // Search logic (Search API directly if single specific search term entered)
  useEffect(() => {
    const handleSearch = async () => {
      const query = debouncedSearch.trim().toLowerCase();
      if (!query) return;

      // Check if already in loaded list
      const alreadyLoaded = pokemonList.some(
        (p) => p.name.toLowerCase() === query || p.id.toString() === query
      );

      if (!alreadyLoaded && query.length >= 2) {
        try {
          const directMatch = await fetchPokemonByNameOrId(query);
          if (directMatch) {
            setPokemonList((prev) => {
              if (prev.some((p) => p.id === directMatch.id)) return prev;
              return [directMatch, ...prev];
            });
          }
        } catch {
          // Ignore search lookup errors; filtering handled client-side
        }
      }
    };

    handleSearch();
  }, [debouncedSearch, pokemonList]);

  // Load More Handler
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextOffset = offset + limit;

    try {
      if (selectedType === 'all') {
        const result = await fetchPokemonList(nextOffset, limit);
        setPokemonList((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newItems = result.pokemonList.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newItems];
        });
        setHasMore(result.hasMore);
      } else {
        const result = await fetchPokemonByType(selectedType, limit, nextOffset);
        setPokemonList((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newItems = result.pokemonList.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newItems];
        });
        setHasMore(result.hasMore);
      }
      setOffset(nextOffset);
    } catch (err: unknown) {
      console.warn('Failed to load more Pokémon:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Toggle Favorite
  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Filtered & Sorted Pokémon list computation
  const filteredAndSortedPokemon = useMemo(() => {
    let result = [...pokemonList];

    // Search query filter
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.id.toString() === q || `#${p.id}`.includes(q)
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      result = result.filter((p) => p.types.some((t) => t.type.name === selectedType));
    }

    // Favorites filter
    if (showFavoritesOnly) {
      result = result.filter((p) => favorites.includes(p.id));
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'id-asc':
          return a.id - b.id;
        case 'id-desc':
          return b.id - a.id;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'hp-high-low': {
          const hpA = a.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0;
          const hpB = b.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0;
          return hpB - hpA;
        }
        default:
          return a.id - b.id;
      }
    });

    return result;
  }, [pokemonList, debouncedSearch, selectedType, showFavoritesOnly, favorites, sortBy]);

  // Prev / Next Modal navigation handlers
  const handlePrevPokemon = () => {
    if (!selectedPokemon || filteredAndSortedPokemon.length === 0) return;
    const currentIndex = filteredAndSortedPokemon.findIndex((p) => p.id === selectedPokemon.id);
    if (currentIndex > 0) {
      setSelectedPokemon(filteredAndSortedPokemon[currentIndex - 1]);
    } else {
      setSelectedPokemon(filteredAndSortedPokemon[filteredAndSortedPokemon.length - 1]);
    }
  };

  const handleNextPokemon = () => {
    if (!selectedPokemon || filteredAndSortedPokemon.length === 0) return;
    const currentIndex = filteredAndSortedPokemon.findIndex((p) => p.id === selectedPokemon.id);
    if (currentIndex < filteredAndSortedPokemon.length - 1) {
      setSelectedPokemon(filteredAndSortedPokemon[currentIndex + 1]);
    } else {
      setSelectedPokemon(filteredAndSortedPokemon[0]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setShowFavoritesOnly(false);
    setSortBy('id-asc');
  };

  return {
    pokemonList: filteredAndSortedPokemon,
    rawCount: pokemonList.length,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    sortBy,
    setSortBy,
    showFavoritesOnly,
    setShowFavoritesOnly,
    favorites,
    toggleFavorite,
    selectedPokemon,
    setSelectedPokemon,
    handleLoadMore,
    reload: loadInitialPokemon,
    clearFilters,
    handlePrevPokemon,
    handleNextPokemon,
  };
}
