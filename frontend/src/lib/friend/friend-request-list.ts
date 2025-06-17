import { appAxios } from '@/services/AxiosClient.ts';
import { Player } from '@/lib/online/game-response.ts';

export async function getRequestPending() {
  const response = await appAxios.get<Player[]>('/friend/requests/pending');
  if (response.status === 200) {
    return response.data;
  }
  throw new Error("Could not get request pending data");
}

export async function getRequestSent() {
  const response = await appAxios.get<Player[]>('/friend/requests/sent');
  if (response.status === 200) {
    return response.data;
  }
  throw new Error("Could not get request pending data");
}

export async function getFriendList() {
  const listFriends = await appAxios.get<Player[]>('/friend');
  if (listFriends.status === 200) {
    return listFriends.data;
  }
  throw new Error('Unable to get friend list');
}