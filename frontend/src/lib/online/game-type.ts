import { appAxios } from '@/services/AxiosClient.ts';

export type GameType = {
  id: number;
  typeName: string;
  timeControl: number;
}

// In-memory cache for immediate fallback
let cachedGameTypes: GameType[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getGameTypes(): Promise<GameType[]> {
  try {
    const response = await appAxios.get<GameType[]>('/game-types/');
    if (response.status === 200) {
      // Update in-memory cache
      cachedGameTypes = response.data;
      cacheTimestamp = Date.now();
      return response.data;
    }
    throw new Error(`API returned status ${response.status}`);
  } catch (error) {
    // If we have cached data and it's not too old, return it
    if (cachedGameTypes && cacheTimestamp && 
        (Date.now() - cacheTimestamp) < CACHE_DURATION * 2) {
      console.warn('Using cached game types due to API error:', error);
      return cachedGameTypes;
    }
    
    // If no cache available or cache is too old, throw the error
    throw new Error(`Failed to load game types: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function getCachedGameTypes(): GameType[] | null {
  if (cachedGameTypes && cacheTimestamp && 
      (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    return cachedGameTypes;
  }
  return null;
}
