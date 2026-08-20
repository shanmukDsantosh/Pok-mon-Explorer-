import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`bg-slate-200 dark:bg-slate-800/80 rounded-lg animate-pulse ${className}`}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm flex flex-col justify-between h-[320px]">
      {/* Top row: ID and Heart */}
      <div className="flex items-center justify-between w-full mb-3">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>

      {/* Central image placeholder */}
      <div className="flex justify-center items-center my-2 relative">
        <Skeleton className="h-32 w-32 rounded-full" />
      </div>

      {/* Title & types */}
      <div className="space-y-2 text-center mt-2">
        <Skeleton className="h-6 w-3/4 mx-auto rounded-md" />
        <div className="flex justify-center gap-2 pt-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <Skeleton className="w-48 h-48 rounded-2xl" />
        <div className="flex-1 space-y-3 w-full">
          <Skeleton className="h-8 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </div>
      <div className="space-y-3 pt-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
};
