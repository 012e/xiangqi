import { appAxios } from '@/services/AxiosClient.ts';

export type ProfileMe = {
  displayName: string;
  username: string;
  email: string;
  picture: string;
}

export async function getProfileMe() {
  const response = await appAxios.get<ProfileMe>('/me');
  if (response.status === 200) {
    console.log(response.data);
    return response.data;
  }
  throw new Error("Can't get profile");
}