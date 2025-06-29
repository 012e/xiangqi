import { Button } from '@/components/ui/button';
import { acceptInvitation, getReceivedInvitations } from '@/lib/friend/invite';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function InvitationsPage() {
  const { data: invitations, isLoading: isLoadingReceivedInvitations } =
    useQuery({
      queryFn: getReceivedInvitations,
      queryKey: ['received-invitations'],
    });

  const acceptInvMutation = useMutation({
    mutationFn: (invitationId: number) => {
      return acceptInvitation(invitationId);
    },

    onSuccess: () => {
      toast.success('Invitation accepted successfully!');
    },
  });

  if (isLoadingReceivedInvitations) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      {invitations?.map((invitation) => (
        <div key={invitation.id}>
          <h2>Invitation from {invitation.inviter.username}</h2>
          <p>Game ID: {invitation.gameId}</p>
          <p>Expires at: {new Date(invitation.expiresAt).toLocaleString()}</p>
          <Button onClick={() => acceptInvMutation.mutate(invitation.id)}>
            Accept
          </Button>
        </div>
      ))}
    </>
  );
}
