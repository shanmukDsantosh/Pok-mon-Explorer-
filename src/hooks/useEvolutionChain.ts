import { useState, useEffect } from 'react';
import type { EvolutionChainData } from '../types/pokemon';
import { fetchEvolutionChain } from '../services/pokemonApi';

export function useEvolutionChain(pokemonId: number | null) {
  const [data, setData] = useState<EvolutionChainData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pokemonId) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchEvolutionChain(pokemonId)
      .then((chainData) => {
        if (isMounted) {
          setData(chainData);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Failed to load evolution chain:', err);
          setError('Could not load evolution chain for this Pokémon.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pokemonId]);

  return { data, isLoading, error };
}
