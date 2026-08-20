import type {
  FetchPokemonListResult,
  Pokemon,
  PokemonListResponse,
  PokemonType,
  EvolutionChainData,
  EvolutionStage,
  PokemonBasic,
  MegaEvolution,
  GigantamaxData,
  RegionalVariant,
  AlternateForm,
} from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

const pokemonCache = new Map<string | number, Pokemon>();
const evolutionChainCache = new Map<number, EvolutionChainData>();
const basePokemonCache = new Map<number | string, boolean>();

/**
 * Check if a Pokémon is a base stage Pokémon (evolves_from_species === null)
 */
export const isBasePokemon = async (pokemonIdOrName: number | string): Promise<boolean> => {
  const cacheKey = typeof pokemonIdOrName === 'string' ? pokemonIdOrName.toLowerCase().trim() : pokemonIdOrName;
  if (basePokemonCache.has(cacheKey)) {
    return basePokemonCache.get(cacheKey)!;
  }

  try {
    const res = await fetch(`${BASE_URL}/pokemon-species/${cacheKey}`);
    if (!res.ok) return true;
    const data = await res.json();
    const isBase = data.evolves_from_species === null;
    basePokemonCache.set(cacheKey, isBase);
    if (data.id) basePokemonCache.set(data.id, isBase);
    return isBase;
  } catch {
    return true;
  }
};

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
  
  pokemonCache.set(data.id, data);
  pokemonCache.set(data.name.toLowerCase(), data);

  return data;
};

/**
 * Fetch list of base Pokémon only (hiding non-base evolved forms from main grid)
 */
export const fetchPokemonList = async (
  offset: number = 0,
  limit: number = 20
): Promise<FetchPokemonListResult> => {
  const fetchLimit = limit * 3;
  const response = await fetch(`${BASE_URL}/pokemon?limit=${Math.round(fetchLimit)}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokémon list.');
  }

  const listData: PokemonListResponse = await response.json();

  const baseChecks = await Promise.all(
    listData.results.map(async (item) => {
      const isBase = await isBasePokemon(item.name);
      return { name: item.name, isBase };
    })
  );

  const baseItems = baseChecks.filter((item) => item.isBase).slice(0, limit);

  const detailPromises = baseItems.map((item) =>
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
  
  // Filter base Pokémon entries
  const baseEntries = await Promise.all(
    allEntries.map(async (entry) => {
      const isBase = await isBasePokemon(entry.pokemon.name);
      return isBase ? entry : null;
    })
  );

  const filteredEntries = baseEntries.filter((e): e is { pokemon: { name: string; url: string } } => e !== null);
  const totalCount = filteredEntries.length;
  const paginatedEntries = filteredEntries.slice(offset, offset + limit);

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

/**
 * Format raw evolution details into human-readable description
 */
const formatEvolutionMethod = (details: any[]): { method: string; level?: number; item?: string } => {
  if (!details || details.length === 0) {
    return { method: 'Base Stage' };
  }

  const d = details[0];
  const trigger = d.trigger?.name || 'level-up';

  if (d.min_level) {
    return { method: `Level ${d.min_level}`, level: d.min_level };
  }
  if (d.item) {
    const itemName = d.item.name.replace(/-/g, ' ');
    return { method: `Use ${itemName.toUpperCase()}`, item: itemName };
  }
  if (trigger === 'trade') {
    if (d.held_item) {
      return { method: `Trade holding ${d.held_item.name.replace(/-/g, ' ')}` };
    }
    return { method: 'Trade' };
  }
  if (d.min_happiness) {
    const time = d.time_of_day ? ` (${d.time_of_day})` : '';
    return { method: `High Friendship${time}` };
  }
  if (d.known_move) {
    return { method: `Knows ${d.known_move.name.replace(/-/g, ' ')}` };
  }
  if (d.location) {
    return { method: `At ${d.location.name.replace(/-/g, ' ')}` };
  }

  return { method: 'Special Condition' };
};

/**
 * Fetch complete evolution chain, mega forms, gigantamax forms, and regional variants
 */
export const fetchEvolutionChain = async (pokemonId: number): Promise<EvolutionChainData> => {
  if (evolutionChainCache.has(pokemonId)) {
    return evolutionChainCache.get(pokemonId)!;
  }

  const speciesRes = await fetch(`${BASE_URL}/pokemon-species/${pokemonId}`);
  if (!speciesRes.ok) {
    throw new Error(`Failed to fetch species data for ID ${pokemonId}`);
  }
  const speciesData = await speciesRes.json();

  const evoChainUrl = speciesData.evolution_chain?.url;
  let chainData = null;
  if (evoChainUrl) {
    const chainRes = await fetch(evoChainUrl);
    if (chainRes.ok) {
      chainData = await chainRes.json();
    }
  }

  const basePokemonFull = await fetchPokemonByNameOrId(speciesData.name);
  const basePokemon: PokemonBasic = {
    id: basePokemonFull.id,
    name: basePokemonFull.name,
    sprite:
      basePokemonFull.sprites.other?.['official-artwork']?.front_default ||
      basePokemonFull.sprites.front_default ||
      '',
    types: basePokemonFull.types.map((t) => t.type.name),
    stats: basePokemonFull.stats,
  };

  const evolutions: EvolutionStage[] = [];
  let babyPokemon: PokemonBasic | undefined = undefined;

  const parseNode = async (node: any) => {
    if (!node) return;

    const pokemonDetails = await fetchPokemonByNameOrId(node.species.name).catch(() => null);
    if (pokemonDetails) {
      const basic: PokemonBasic = {
        id: pokemonDetails.id,
        name: pokemonDetails.name,
        sprite:
          pokemonDetails.sprites.other?.['official-artwork']?.front_default ||
          pokemonDetails.sprites.front_default ||
          '',
        types: pokemonDetails.types.map((t) => t.type.name),
        stats: pokemonDetails.stats,
      };

      if (node.is_baby) {
        babyPokemon = basic;
      }

      const methodInfo = formatEvolutionMethod(node.evolution_details);
      evolutions.push({
        pokemon: basic,
        evolutionMethod: methodInfo.method,
        level: methodInfo.level,
        item: methodInfo.item,
        trigger: node.evolution_details?.[0]?.trigger?.name || 'level-up',
      });
    }

    if (node.evolves_to && node.evolves_to.length > 0) {
      for (const nextNode of node.evolves_to) {
        await parseNode(nextNode);
      }
    }
  };

  if (chainData?.chain) {
    await parseNode(chainData.chain);
  }

  const megaForms: MegaEvolution[] = [];
  let gigantamaxForm: GigantamaxData | undefined = undefined;
  const regionalForms: RegionalVariant[] = [];
  const otherForms: AlternateForm[] = [];

  const varieties = speciesData.varieties || [];
  for (const variety of varieties) {
    if (variety.is_default) continue;

    const formPokemon = await fetchPokemonByNameOrId(variety.pokemon.name).catch(() => null);
    if (!formPokemon) continue;

    const formName = formPokemon.name.toLowerCase();
    const sprite =
      formPokemon.sprites.other?.['official-artwork']?.front_default ||
      formPokemon.sprites.front_default ||
      '';
    const types = formPokemon.types.map((t) => t.type.name);

    if (formName.includes('-mega')) {
      const isX = formName.includes('-mega-x');
      const isY = formName.includes('-mega-y');
      const formTitle = isX ? 'Mega Form X' : isY ? 'Mega Form Y' : 'Mega Evolution';
      const stoneName = `${basePokemon.name.toUpperCase()}ITE${isX ? ' X' : isY ? ' Y' : ''}`;

      megaForms.push({
        id: formPokemon.id,
        name: formPokemon.name,
        formName: formTitle,
        sprite,
        types,
        megaStone: stoneName,
        stats: formPokemon.stats,
      });
    } else if (formName.includes('-gmax')) {
      gigantamaxForm = {
        id: formPokemon.id,
        name: formPokemon.name,
        sprite,
        gmaxMove: `G-Max ${basePokemon.name.toUpperCase()} Wildfire`,
        types,
        description: 'Gigantamax form with colossal stats and exclusive G-Max Move.',
        stats: formPokemon.stats,
      };
    } else if (formName.includes('-alola')) {
      regionalForms.push({
        id: formPokemon.id,
        region: 'Alola',
        name: formPokemon.name,
        sprite,
        types,
        stats: formPokemon.stats,
      });
    } else if (formName.includes('-galar')) {
      regionalForms.push({
        id: formPokemon.id,
        region: 'Galar',
        name: formPokemon.name,
        sprite,
        types,
        stats: formPokemon.stats,
      });
    } else if (formName.includes('-hisui')) {
      regionalForms.push({
        id: formPokemon.id,
        region: 'Hisui',
        name: formPokemon.name,
        sprite,
        types,
        stats: formPokemon.stats,
      });
    } else if (formName.includes('-paldea')) {
      regionalForms.push({
        id: formPokemon.id,
        region: 'Paldea',
        name: formPokemon.name,
        sprite,
        types,
        stats: formPokemon.stats,
      });
    } else {
      otherForms.push({
        id: formPokemon.id,
        name: formPokemon.name,
        formName: formPokemon.name.replace(`${basePokemon.name}-`, ''),
        sprite,
        types,
        category: 'battle',
        stats: formPokemon.stats,
      });
    }
  }

  const result: EvolutionChainData = {
    babyPokemon,
    basePokemon,
    evolutions: evolutions.length > 0 ? evolutions : [{ pokemon: basePokemon, evolutionMethod: 'Single Form', trigger: 'none' }],
    megaForms: megaForms.length > 0 ? megaForms : undefined,
    gigantamaxForm,
    regionalForms: regionalForms.length > 0 ? regionalForms : undefined,
    otherForms: otherForms.length > 0 ? otherForms : undefined,
  };

  evolutionChainCache.set(pokemonId, result);
  return result;
};
