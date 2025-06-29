import { appAxios } from '@/services/AxiosClient.ts';

export type GameType = {
  id: number;
  typeName: string;
  timeControl: number;
}

export async function getGameTypes(): Promise<GameType[]> {
  try {
    const response = await appAxios.get<GameType[]>('/game-types/');
    if (response.status === 200) {
      return response.data;
    }
    throw new Error(`API returned status ${response.status}`);
  } catch (error) {
    throw new Error(`Failed to load game types: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
