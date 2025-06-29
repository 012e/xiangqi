import { appAxios } from '@/services/AxiosClient';

export async function inviteToGame(userId: number): Promise<void> {
  const response = await appAxios.post(`/invitation/send/${userId}/5`, {
    recipientId: userId,
  });

  if (response.status !== 201) {
    throw new Error(`Failed to send invitation: ${response.statusText}`);
  }
}
