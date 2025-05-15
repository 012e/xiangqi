import { appAxios } from '@/services/AxiosClient.ts';

export type GameType = {
  id: number;
  typeName: string;
  timeControl: number;
}

export async function getGameTypes() {
   const response = await appAxios.get<GameType[]>('/game-types/');
   if (response.status === 200) {
     return response.data;
   }
   throw new Error("Fuck");
}
