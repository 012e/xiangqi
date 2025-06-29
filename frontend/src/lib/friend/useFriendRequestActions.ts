import { appAxios } from '@/services/AxiosClient.ts';

export async function addFriend(id: number) {
  return await appAxios.post(`/friend/request/${id}`);
}

export async function rejectFriendRequest(id: number) {
  return await appAxios.post(`/friend/reject/${id}`);
}

export async function acceptFriendRequest(id: number) {
  return await appAxios.post(`/friend/accept/${id}`);
}

export async function removeFriend(id: number) {
  return await appAxios.delete(`/friend/${id}`);
}
