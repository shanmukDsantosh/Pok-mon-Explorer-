import React from 'react';
import type { PokemonType } from '../../types/pokemon';
import { getTypeColorConfig } from '../../utils/typeColors';
import { capitalize } from '../../utils/formatters';

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({
  type,
  size = 'md',
  className = '',
}) => {
  const config = getTypeColorConfig(type);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-3 py-1 text-xs font-bold tracking-wide',
    lg: 'px-4 py-1.5 text-sm font-bold tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full uppercase shadow-sm transition-transform duration-200 hover:scale-105 ${config.badgeBg} ${config.badgeText} ${sizeClasses[size]} ${className}`}
    >
      {capitalize(type)}
    </span>
  );
};
