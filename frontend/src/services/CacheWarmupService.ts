import { getGameTypes } from '@/lib/online/game-type.ts';

/**
 * Service to warm up critical caches during app initialization
 */
class CacheWarmupService {
  private static instance: CacheWarmupService;
  private warmedUp = false;

  private constructor() {}

  public static getInstance(): CacheWarmupService {
    if (!CacheWarmupService.instance) {
      CacheWarmupService.instance = new CacheWarmupService();
    }
    return CacheWarmupService.instance;
  }

  /**
   * Warm up all critical caches
   */
  public async warmupCaches(): Promise<void> {
    if (this.warmedUp) {
      return;
    }

    try {
      // Warm up game types cache
      await this.warmupGameTypes();
      this.warmedUp = true;
      console.log('Cache warmup completed successfully');
    } catch (error) {
      console.warn('Cache warmup failed, but app will continue normally:', error);
    }
  }

  /**
   * Warm up game types cache
   */
  private async warmupGameTypes(): Promise<void> {
    try {
      await getGameTypes();
      console.log('Game types cache warmed up');
    } catch (error) {
      console.warn('Failed to warm up game types cache:', error);
    }
  }

  /**
   * Reset warmup state (useful for testing)
   */
  public reset(): void {
    this.warmedUp = false;
  }
}

export const cacheWarmupService = CacheWarmupService.getInstance();
