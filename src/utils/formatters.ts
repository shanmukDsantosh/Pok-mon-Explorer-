import type { Pokemon } from '../types/pokemon';

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatId = (id: number): string => {
  return `#${id.toString().padStart(4, '0')}`;
};

export const formatHeight = (decimeters: number): { meters: string; feet: string } => {
  const meters = (decimeters / 10).toFixed(1);
  const totalInches = decimeters * 3.93701;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return {
    meters: `${meters} m`,
    feet: `${feet}'${inches}"`,
  };
};

export const formatWeight = (hectograms: number): { kg: string; lbs: string } => {
  const kg = (hectograms / 10).toFixed(1);
  const lbs = (hectograms * 0.220462).toFixed(1);
  return {
    kg: `${kg} kg`,
    lbs: `${lbs} lbs`,
  };
};

export const getPokemonImage = (pokemon: Pokemon, isShiny = false): string => {
  if (!pokemon || !pokemon.sprites) {
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
  }

  const { sprites } = pokemon;

  if (isShiny) {
    return (
      sprites.other?.['official-artwork']?.front_shiny ||
      sprites.other?.home?.front_shiny ||
      sprites.front_shiny ||
      sprites.other?.['official-artwork']?.front_default ||
      sprites.front_default ||
      ''
    );
  }

  return (
    sprites.other?.['official-artwork']?.front_default ||
    sprites.other?.home?.front_default ||
    sprites.other?.dream_world?.front_default ||
    sprites.front_default ||
    ''
  );
};

export const getStatLabel = (statName: string): string => {
  const labels: Record<string, string> = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    'special-attack': 'Sp. ATK',
    'special-defense': 'Sp. DEF',
    speed: 'SPD',
  };
  return labels[statName] || capitalize(statName);
};

export const getStatColorClass = (value: number): string => {
  if (value < 50) return 'bg-red-500';
  if (value < 80) return 'bg-amber-500';
  if (value < 110) return 'bg-emerald-500';
  if (value < 140) return 'bg-cyan-500';
  return 'bg-purple-500';
};
