import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getGameTypes } from '@/lib/online/game-type.ts';

/**
 * Hook to prefetch game types data for better performance
 * This will load game types in the background when the hook is used
 */
export function usePrefetchGameTypes() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch game types if not already cached
    queryClient.prefetchQuery({
      queryKey: ['gameTypes'],
      queryFn: getGameTypes,
      // Only prefetch if data is older than 5 minutes
      staleTime: 1000 * 60 * 5,
    });
  }, [queryClient]);
}

/**
 * Hook to ensure game types are always fresh when entering play pages
 */
export function useEnsureGameTypes() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Ensure fresh data for game types, but use cache if available
    queryClient.ensureQueryData({
      queryKey: ['gameTypes'],
      queryFn: getGameTypes,
    });
  }, [queryClient]);
}
