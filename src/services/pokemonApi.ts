import type {
  FetchPokemonListResult,
  Pokemon,
  PokemonListResponse,
  PokemonType,
} from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// In-memory cache for fetched Pokemon details to minimize network requests and rate-limiting
const pokemonCache = new Map<string | number, Pokemon>();

/**
 * Fetch detailed data for a single Pokemon by name or numeric ID
 */
export const fetchPokemonByNameOrId = async (nameOrId: string | number): Promise<Pokemon> => {
  const cacheKey = typeof nameOrId === 'string' ? nameOrId.toLowerCase().trim() : nameOrId;

  if (pokemonCache.has(cacheKey)) {
    return pokemonCache.get(cacheKey)!;
  }

  const response = await fetch(`${BASE_URL}/pokemon/${cacheKey}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Pokémon "${nameOrId}" not found.`);
    }
    throw new Error(`Failed to fetch Pokémon (${response.statusText})`);
  }

  const data: Pokemon = await response.json();
  
  // Cache by both ID and Name
  pokemonCache.set(data.id, data);
  pokemonCache.set(data.name.toLowerCase(), data);

  return data;
};

/**
 * Fetch a paginated list of Pokemon and resolve their full details concurrently using Promise.all
 */
export const fetchPokemonList = async (
  offset: number = 0,
  limit: number = 20
): Promise<FetchPokemonListResult> => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokémon list.');
  }

  const listData: PokemonListResponse = await response.json();

  // Fetch individual details in parallel using Promise.all
  const detailPromises = listData.results.map((item) =>
    fetchPokemonByNameOrId(item.name).catch((err) => {
      console.warn(`Could not load details for ${item.name}:`, err);
      return null;
    })
  );

  const pokemonList = (await Promise.all(detailPromises)).filter(
    (item): item is Pokemon => item !== null
  );

  return {
    pokemonList,
    totalCount: listData.count,
    hasMore: Boolean(listData.next),
  };
};

/**
 * Fetch all Pokemon of a specific type
 */
export const fetchPokemonByType = async (
  type: PokemonType | 'all',
  limit: number = 20,
  offset: number = 0
): Promise<{ pokemonList: Pokemon[]; totalCount: number; hasMore: boolean }> => {
  if (type === 'all') {
    return fetchPokemonList(offset, limit);
  }

  const response = await fetch(`${BASE_URL}/type/${type}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon of type ${type}`);
  }

  const typeData = await response.json();
  const allEntries: { pokemon: { name: string; url: string } }[] = typeData.pokemon || [];
  const totalCount = allEntries.length;

  const paginatedEntries = allEntries.slice(offset, offset + limit);

  const detailPromises = paginatedEntries.map((entry) =>
    fetchPokemonByNameOrId(entry.pokemon.name).catch(() => null)
  );

  const pokemonList = (await Promise.all(detailPromises)).filter(
    (item): item is Pokemon => item !== null
  );

  return {
    pokemonList,
    totalCount,
    hasMore: offset + limit < totalCount,
  };
};
