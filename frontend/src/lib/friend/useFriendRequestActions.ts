import { appAxios } from '@/services/AxiosClient.ts';

export function postAddFriend(id: number) {
  return appAxios.post(`/friend/request/${id}`);
}

export function postRejectFriend(id: number) {
  return appAxios.post(`/friend/reject/${id}`);
}

export function postAcceptFriend(id: number) {
  return appAxios.post(`/friend/accept/${id}`);
}

export function friendDelete(id: number) {
  return appAxios.delete(`/friend/${id}`);
}