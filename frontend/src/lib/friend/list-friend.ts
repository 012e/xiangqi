import { appAxios } from '@/services/AxiosClient.ts';

export type FriendList = {
  id: number,
  sub: string,
  email: string,
  displayName: string,
  username: string,
  picture: string
}

export async function getFriendList() {
  const listFriends = await appAxios.get<FriendList[]>('/friend/');
  if (listFriends.status === 200) {
    return listFriends.data;
  }
  throw new Error("Unable to get friend list");
}