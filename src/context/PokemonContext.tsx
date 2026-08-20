import React, { createContext, useContext } from 'react';
import { usePokemon } from '../hooks/usePokemon';

type PokemonContextType = ReturnType<typeof usePokemon>;

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pokemonData = usePokemon();
  return (
    <PokemonContext.Provider value={pokemonData}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemonContext = (): PokemonContextType => {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error('usePokemonContext must be used within a PokemonProvider');
  }
  return context;
};
