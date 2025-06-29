import { useAuth0 } from '@auth0/auth0-react';
import { useMutation } from '@tanstack/react-query';
import { useSubscription } from 'react-stomp-hooks';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';
import { Check, X, User, Gamepad2 } from 'lucide-react';
import {
  acceptInvitation,
  declineInvitation,
  Invitation,
} from '@/lib/friend/invite';
import { Avatar, AvatarImage } from './ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';

function InvitationDialog({
  invitation,
  navigate,
}: {
  invitation: Invitation;
  navigate: (path: string) => void;
}) {
  function dismissCurrent() {
    toast.dismiss(`invitation-${invitation.id}`);
  }

  const acceptMutation = useMutation({
    mutationFn: () => acceptInvitation(invitation.id),
    onSuccess: (data) => {
      dismissCurrent();
      navigate(`/game/${data.gameId}`);
    },
    onError: (error) => {
      toast.error(`Failed to accept invitation: ${error.message}`);
      dismissCurrent();
    },
  });

  const declineMutation = useMutation({
    mutationFn: () => declineInvitation(invitation.id),
    onSuccess: () => dismissCurrent(),
    onError: (error) => {
      toast.error(`Failed to decline invitation: ${error.message}`);
      dismissCurrent();
    },
  });

  const isPending = acceptMutation.isPending || declineMutation.isPending;

  return (
    <div className="flex flex-col p-4 space-y-4 max-w-sm min-w-80">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Avatar>
          <AvatarImage src={invitation.inviter.picture} />
          <AvatarFallback>
            <User className="w-6 h-6 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold leading-tight text-foreground">
            Game Invitation
          </h3>
          <p className="text-sm text-muted-foreground">
            from {invitation.inviter.displayName || invitation.inviter.username}
          </p>
        </div>
      </div>

      {/* Game info */}
      <div className="flex items-center p-3 space-x-2 rounded-lg bg-muted">
        <Gamepad2 className="w-4 h-4 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">Game Type</p>
          <p className="text-sm text-muted-foreground">
            {invitation.gameType.typeName}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-3">
        <Button
          onClick={() => acceptMutation.mutate()}
          disabled={isPending}
          className="flex-1"
        >
          <Check className="mr-2 w-4 h-4" />
          Accept
        </Button>
        <Button
          onClick={() => declineMutation.mutate()}
          disabled={isPending}
          variant="outline"
          className="flex-1"
        >
          <X className="mr-2 w-4 h-4" />
          Decline
        </Button>
      </div>
    </div>
  );
}

export default function FriendInvitationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth0();
  const navigate = useNavigate();

  useSubscription(`/topic/invitation/${auth.user?.sub}`, (message) => {
    const data = JSON.parse(message.body);
    console.log('received notification', data);
    if (data.type === 'accepted' || data.type === 'declined') {
      return;
    }
    const invitation: Invitation = data;

    toast.message(
      <InvitationDialog invitation={invitation} navigate={navigate} />,
      {
        id: `invitation-${invitation.id}`,
        duration: Infinity,
        style: {
          padding: 0,
          width: 'fit-content',
          maxWidth: '90vw',
          background: 'var(--popover)',
          borderColor: 'var(--foreground)',
          borderWidth: '1px',
          borderRadius: '12px',
          boxShadow:
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    );
  });

  return <>{children}</>;
}
