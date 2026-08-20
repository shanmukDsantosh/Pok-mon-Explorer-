export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export type PokemonStatName =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed';

export interface PokemonTypeSlot {
  slot: number;
  type: {
    name: PokemonType;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: PokemonStatName;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
      front_shiny?: string | null;
    };
    dream_world?: {
      front_default: string | null;
    };
    home?: {
      front_default: string | null;
      front_shiny?: string | null;
    };
  };
}

export interface PokemonCries {
  latest?: string;
  legacy?: string;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number; // in decimeters
  weight: number; // in hectograms
  base_experience: number;
  types: PokemonTypeSlot[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
  cries?: PokemonCries;
  species?: {
    name: string;
    url: string;
  };
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export type SortOption = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc' | 'hp-high-low';

export interface PokemonFilterOptions {
  search: string;
  selectedType: PokemonType | 'all';
  sortBy: SortOption;
  showFavoritesOnly: boolean;
}

export interface FetchPokemonListResult {
  pokemonList: Pokemon[];
  totalCount: number;
  hasMore: boolean;
}
