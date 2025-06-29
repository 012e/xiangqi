import { getInvitationById, Invitation } from '@/lib/friend/invite';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import { Frown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSubscription } from 'react-stomp-hooks';
import { toast } from 'sonner';

export default function WaitingPage() {
  const { id } = useParams<{ id: string }>();

  const auth = useAuth0();
  const navigate = useNavigate();

  const [state, setState] = useState<'waiting' | 'declined'>('waiting');

  const { data: invitation, isLoading } = useQuery({
    queryKey: ['invitation', id],
    enabled: !!id && !isNaN(Number(id)),
    queryFn: () => getInvitationById(Number(id!)),
  });

  useSubscription(`/topic/invitation/${auth.user?.sub}`, (message) => {
    const data = JSON.parse(message.body);
    if (data.type === 'declined') {
      setState('declined');
    }
    if (data.type !== 'accepted' || data.id !== Number(id)) {
      return;
    }
    const invitationData = data as Invitation;
    toast.success('Your invitation has been accepted!');
    navigate(`/game/${invitationData.gameId}`);
  });

  if (!id || isNaN(Number(id))) {
    return <h1>Invalid invitation ID</h1>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader2 className="animate-spin size-10" />
      </div>
    );
  }

  if (state === 'declined') {
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-5xl font-bold tracking-tight">Sorry!</h1>
        <h2 className="text-3xl font-bold tracking-tight">
          Invitation Declined
        </h2>
        <Frown className="size-10" />
      </div>
    </div>;
  }

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-5xl font-bold tracking-tight">Waiting for confirmation...</h1>
        <Loader2 className="animate-spin size-20" />
      </div>
    </div>
  );
}
