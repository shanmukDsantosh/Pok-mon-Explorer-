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
    showdown?: {
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

// --------------------------------------------------------------------------
// Evolution Chain & Alternate Forms Types
// --------------------------------------------------------------------------

export interface PokemonBasic {
  id: number;
  name: string;
  sprite: string;
  types: PokemonType[];
  stats?: PokemonStat[];
}

export interface EvolutionStage {
  pokemon: PokemonBasic;
  evolutionMethod: string;
  level?: number;
  item?: string;
  condition?: string;
  trigger: string;
  minHappiness?: number;
  timeOfDay?: string;
  heldItem?: string;
  knownMove?: string;
}

export interface MegaEvolution {
  id: number;
  name: string;
  formName: string;
  sprite: string;
  types: PokemonType[];
  megaStone?: string;
  stats: PokemonStat[];
}

export interface GigantamaxData {
  id: number;
  name: string;
  sprite: string;
  gmaxMove: string;
  types: PokemonType[];
  description?: string;
  stats?: PokemonStat[];
}

export interface RegionalVariant {
  id: number;
  region: 'Alola' | 'Galar' | 'Hisui' | 'Paldea';
  name: string;
  sprite: string;
  types: PokemonType[];
  stats: PokemonStat[];
}

export interface AlternateForm {
  id: number;
  name: string;
  formName: string;
  sprite: string;
  types: PokemonType[];
  category: 'gender' | 'shiny' | 'costume' | 'battle' | 'weather' | 'other';
  stats?: PokemonStat[];
}

export interface EvolutionChainData {
  babyPokemon?: PokemonBasic;
  basePokemon: PokemonBasic;
  evolutions: EvolutionStage[];
  megaForms?: MegaEvolution[];
  gigantamaxForm?: GigantamaxData;
  regionalForms?: RegionalVariant[];
  otherForms?: AlternateForm[];
}
