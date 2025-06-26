import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Handshake } from 'lucide-react';

export default function OfferDrawButton({
  onDrawOffer = async () => {
    /* Default no-op */
  },
  onRejectDrawOffer = async () => {
    /* Default no-op */
  },
  showRejectPopup = false,
}: {
  onDrawOffer: () => Promise<void>;
  onRejectDrawOffer: () => Promise<void>;
  showRejectPopup?: boolean;
}) {
  return (
    <Tooltip open={showRejectPopup}>
      <TooltipTrigger asChild>
        <Button className="group" onClick={onDrawOffer}>
          <Handshake className="text-green-500 group-hover:scale-150 transition-tran sform" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-2 items-center p-3">
          <p>The other player is offering you a draw</p>
          <div className="flex justify-around items-center w-full">
            <Button
              onClick={onDrawOffer}
              className="text-white bg-green-600 dark:text-white dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800"
            >
              Accept
            </Button>
            <Button
              variant="outline"
              onClick={onRejectDrawOffer}
              className="text-red-500 border-red-500 dark:text-red-400 dark:border-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:hover:text-red-300"
            >
              Decline
            </Button>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
