import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Pokémon found',
  message = 'We couldn\'t find any Pokémon matching your search criteria or selected type filter. Try adjusting your query or resetting filters.',
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl max-w-md mx-auto my-12 backdrop-blur-sm shadow-md">
      <div className="w-16 h-16 bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
        {message}
      </p>
      {onClearFilters && (
        <Button variant="secondary" onClick={onClearFilters} leftIcon={<RotateCcw className="w-4 h-4" />}>
          Clear All Filters
        </Button>
      )}
    </div>
  );
};
