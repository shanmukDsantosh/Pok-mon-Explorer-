import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while communicating with the PokéAPI. Please check your internet connection and try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-3xl max-w-md mx-auto my-12 backdrop-blur-sm shadow-xl">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="danger" onClick={onRetry} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};
