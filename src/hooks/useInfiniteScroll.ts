import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  onIntersect: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Custom hook to handle infinite scrolling using the IntersectionObserver API.
 * Attaches to a sentinel target ref and triggers `onIntersect` when visible.
 */
export function useInfiniteScroll({
  onIntersect,
  hasMore = true,
  isLoading = false,
  threshold = 0.1,
  rootMargin = '200px',
}: UseInfiniteScrollOptions) {
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target && target.isIntersecting && hasMore && !isLoading) {
        onIntersect();
      }
    },
    [onIntersect, hasMore, isLoading]
  );

  useEffect(() => {
    const element = triggerRef.current;
    if (!element || !hasMore) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin,
      threshold,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver, hasMore, rootMargin, threshold]);

  return triggerRef;
}
