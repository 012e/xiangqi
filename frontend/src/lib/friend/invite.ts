import { appAxios } from '@/services/AxiosClient';

export type GameTypeResponse = {
  id: number;
  typeName: string;
  timeControl: number;
};

export type UserDto = {
  id: number;
  sub: string;
  email: string;
  displayName?: string;
  username?: string;
  picture?: string;
};

export type Invitation = {
  id: number;
  gameType: GameTypeResponse;
  inviter: UserDto;
  recipient: UserDto;
  createdAt: string;
  expiresAt: string;
  message: string;
  gameId: number;
};

export type InvitationDetail = {
  isAccepted: boolean;
  isDeclined: boolean;
} & Invitation;

export async function getReceivedInvitations(): Promise<InvitationDetail[]> {
  const response = await appAxios.get<InvitationDetail[]>(
    '/invitation/received',
    {
      validateStatus: (status) => status === 200,
    },
  );

  return response.data;
}

export async function getSentInvitations(): Promise<InvitationDetail[]> {
  const response = await appAxios.get<InvitationDetail[]>('/invitation/sent', {
    validateStatus: (status) => status === 200,
  });

  return response.data;
}

export async function inviteToGame(userId: number): Promise<InvitationDetail> {
  const response = await appAxios.post(
    `/invitation/send/${userId}/5`,
    {
      recipientId: userId,
    },
    { validateStatus: (status) => status === 201 },
  );
  return response.data;
}

export async function cancelInvitation(invitationId: number): Promise<void> {
  const response = await appAxios.delete(`/invitation/${invitationId}`, {
    validateStatus: (status) => status === 204,
  });
  return response.data;
}

export async function declineInvitation(invitationId: number): Promise<void> {
  const response = await appAxios.post(`/invitation/decline/${invitationId}`, {
    validateStatus: (status: number) => status === 204,
  });
  return response.data;
}

export async function getInvitationById(
  invitationId: number,
): Promise<InvitationDetail> {
  const response = await appAxios.get<InvitationDetail>(
    `/invitation/${invitationId}`,
    {
      validateStatus: (status) => status === 200,
    },
  );
  return response.data;
}

export async function acceptInvitation(
  invitationId: number,
): Promise<Invitation> {
  const response = await appAxios.post(
    `/invitation/accept/${invitationId}`,
    {},
    {
      validateStatus: (status) => status === 200,
    },
  );
  return response.data;
}
