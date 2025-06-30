import { appAxios } from '@/services/AxiosClient.ts';
import { GameResponse } from '@/lib/online/game-response.ts';
import { ProfileMe } from '@/stores/profile-me.ts';


export async function getGamesByUserId(id: number) {
  const response = await appAxios.get<GameResponse[]>(`/user/${id}/games`);

  if (response.status === 200) {
    return response.data;
  }
  throw new Error("Can't get games");
}

export async function getProfileById(id: number) {
  const response = await appAxios.get<ProfileMe>(`/user/${id}`);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error("Can't get profile");
}