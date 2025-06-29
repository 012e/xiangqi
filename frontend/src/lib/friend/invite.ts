import { appAxios } from '@/services/AxiosClient';

export async function inviteToGame(userId: number): Promise<void> {
  const response = await appAxios.post(
    `/invitation/send/${userId}/5`,
    {
      recipientId: userId,
    },
    { validateStatus: (status) => status === 201 },
  );
  return response.data;
}
