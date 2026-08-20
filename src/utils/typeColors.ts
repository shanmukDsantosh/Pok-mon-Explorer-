import type { PokemonType } from '../types/pokemon';

export interface TypeColorConfig {
  gradient: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  glowColor: string;
}

export const TYPE_COLOR_MAP: Record<PokemonType, TypeColorConfig> = {
  fire: {
    gradient: 'from-red-400 to-orange-500',
    badgeBg: 'bg-red-500 dark:bg-red-600',
    badgeText: 'text-white',
    borderColor: 'border-red-400',
    glowColor: 'shadow-red-500/30',
  },
  water: {
    gradient: 'from-blue-400 to-cyan-500',
    badgeBg: 'bg-blue-500 dark:bg-blue-600',
    badgeText: 'text-white',
    borderColor: 'border-blue-400',
    glowColor: 'shadow-blue-500/30',
  },
  grass: {
    gradient: 'from-green-400 to-emerald-500',
    badgeBg: 'bg-emerald-500 dark:bg-emerald-600',
    badgeText: 'text-white',
    borderColor: 'border-emerald-400',
    glowColor: 'shadow-emerald-500/30',
  },
  electric: {
    gradient: 'from-yellow-300 to-amber-400',
    badgeBg: 'bg-amber-400 dark:bg-amber-500',
    badgeText: 'text-slate-900',
    borderColor: 'border-amber-300',
    glowColor: 'shadow-amber-400/30',
  },
  psychic: {
    gradient: 'from-pink-400 to-fuchsia-500',
    badgeBg: 'bg-pink-500 dark:bg-pink-600',
    badgeText: 'text-white',
    borderColor: 'border-pink-400',
    glowColor: 'shadow-pink-500/30',
  },
  ghost: {
    gradient: 'from-purple-500 to-indigo-600',
    badgeBg: 'bg-purple-600 dark:bg-purple-700',
    badgeText: 'text-white',
    borderColor: 'border-purple-500',
    glowColor: 'shadow-purple-500/30',
  },
  ice: {
    gradient: 'from-cyan-300 to-blue-400',
    badgeBg: 'bg-cyan-400 dark:bg-cyan-500',
    badgeText: 'text-slate-900',
    borderColor: 'border-cyan-300',
    glowColor: 'shadow-cyan-400/30',
  },
  dragon: {
    gradient: 'from-indigo-500 to-purple-600',
    badgeBg: 'bg-indigo-600 dark:bg-indigo-700',
    badgeText: 'text-white',
    borderColor: 'border-indigo-500',
    glowColor: 'shadow-indigo-500/30',
  },
  dark: {
    gradient: 'from-gray-600 to-slate-800',
    badgeBg: 'bg-slate-700 dark:bg-slate-800',
    badgeText: 'text-white',
    borderColor: 'border-slate-600',
    glowColor: 'shadow-slate-700/30',
  },
  fairy: {
    gradient: 'from-pink-300 to-rose-400',
    badgeBg: 'bg-rose-400 dark:bg-rose-500',
    badgeText: 'text-white',
    borderColor: 'border-rose-300',
    glowColor: 'shadow-rose-400/30',
  },
  normal: {
    gradient: 'from-gray-300 to-slate-400',
    badgeBg: 'bg-slate-400 dark:bg-slate-500',
    badgeText: 'text-white',
    borderColor: 'border-slate-300',
    glowColor: 'shadow-slate-400/30',
  },
  poison: {
    gradient: 'from-purple-400 to-pink-600',
    badgeBg: 'bg-purple-500 dark:bg-purple-600',
    badgeText: 'text-white',
    borderColor: 'border-purple-400',
    glowColor: 'shadow-purple-400/30',
  },
  ground: {
    gradient: 'from-amber-600 to-yellow-700',
    badgeBg: 'bg-amber-600 dark:bg-amber-700',
    badgeText: 'text-white',
    borderColor: 'border-amber-600',
    glowColor: 'shadow-amber-600/30',
  },
  rock: {
    gradient: 'from-yellow-600 to-amber-800',
    badgeBg: 'bg-yellow-700 dark:bg-yellow-800',
    badgeText: 'text-white',
    borderColor: 'border-yellow-600',
    glowColor: 'shadow-yellow-600/30',
  },
  bug: {
    gradient: 'from-lime-500 to-emerald-600',
    badgeBg: 'bg-lime-600 dark:bg-lime-700',
    badgeText: 'text-white',
    borderColor: 'border-lime-500',
    glowColor: 'shadow-lime-500/30',
  },
  steel: {
    gradient: 'from-slate-400 to-zinc-500',
    badgeBg: 'bg-zinc-500 dark:bg-zinc-600',
    badgeText: 'text-white',
    borderColor: 'border-zinc-400',
    glowColor: 'shadow-zinc-500/30',
  },
  flying: {
    gradient: 'from-indigo-300 to-sky-400',
    badgeBg: 'bg-sky-400 dark:bg-sky-500',
    badgeText: 'text-white',
    borderColor: 'border-sky-300',
    glowColor: 'shadow-sky-400/30',
  },
  fighting: {
    gradient: 'from-red-600 to-orange-700',
    badgeBg: 'bg-red-700 dark:bg-red-800',
    badgeText: 'text-white',
    borderColor: 'border-red-600',
    glowColor: 'shadow-red-600/30',
  },
};

export const getTypeGradient = (type?: PokemonType): string => {
  if (!type || !TYPE_COLOR_MAP[type]) {
    return TYPE_COLOR_MAP.normal.gradient;
  }
  return TYPE_COLOR_MAP[type].gradient;
};

export const getTypeColorConfig = (type?: PokemonType): TypeColorConfig => {
  if (!type || !TYPE_COLOR_MAP[type]) {
    return TYPE_COLOR_MAP.normal;
  }
  return TYPE_COLOR_MAP[type];
};
