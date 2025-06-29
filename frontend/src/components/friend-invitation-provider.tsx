import { appAxios } from '@/services/AxiosClient';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation } from '@tanstack/react-query';
import { useSubscription } from 'react-stomp-hooks';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';
import { Check, X } from 'lucide-react';

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

async function acceptInvitation(invitationId: number): Promise<Invitation> {
  const response = await appAxios.post(`invitation/accept/${invitationId}`);
  if (response.status !== 200) {
    throw new Error(`Failed to accept invitation: ${response.statusText}`);
  }

  if (!response.data.gameId) {
    throw new Error('Invitation does not contain a valid game ID');
  }

  return response.data;
}

async function declineInvitation(invitationId: number): Promise<void> {
  return await appAxios.post(`invitation/decline/${invitationId}`);
}

function InvitationDialog({ invitation }: { invitation: Invitation }) {
  const navigate = useNavigate();
  const acceptMutation = useMutation({
    mutationFn: () => acceptInvitation(invitation.id),
    onSuccess: (data) => navigate(`/play/online/${data.gameId}`),
  });

  const declineMutation = useMutation({
    mutationFn: () => declineInvitation(invitation.id),
    onError: (error) =>
      toast.error(`Failed to decline invitation: ${error.message}`),
  });

  const isPending = acceptMutation.isPending || declineMutation.isPending;

  return (
    <div className="flex w-10">
      <h2>
        Invitation from{' '}
        {invitation.inviter.displayName || invitation.inviter.username}
      </h2>
      <p>Game Type: {invitation.gameType.typeName}</p>
      <Button onClick={() => acceptMutation.mutate()} disabled={isPending}>
        <Check />
      </Button>
      <Button onClick={() => declineMutation.mutate()} disabled={isPending}>
        <X />
      </Button>
    </div>
  );
}

export default function FriendInvitationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth0();

  useSubscription(`/topic/invitation/${auth.user?.sub}`, (message) => {
    const invitation: Invitation = JSON.parse(message.body);

    if (invitation) {
      console.log('New invitation received:', invitation);
    }
    toast.message(InvitationDialog({ invitation }), {
      duration: Infinity,
    });
  });

  return <>{children}</>;
}
