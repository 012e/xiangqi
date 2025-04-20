// ChallengeOptions.tsx
import {
  Link as LinkIcon,
  Mail,
  Facebook,
  Copy,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router';
import { Button } from './ui/button';

const ChallengeOptions = () => {
  return (
    <div className="rounded-lg w-full max-w-sm mx-auto space-y-4">
      <Button className="w-full flex items-center justify-between px-4 py-3 rounded-md transition">
        <span className="flex items-center space-x-3">
          <LinkIcon size={18} />
          <span className="font-semibold">Create Challenge Link</span>
        </span>
        <ChevronRight size={20} />
      </Button>

      <Button className="w-full flex items-center justify-between px-4 py-3 rounded-md transition">
        <span className="flex items-center space-x-3">
          <Mail size={18} />
          <span className="font-semibold">Send Email Invite</span>
        </span>
        <ChevronRight size={20} />
      </Button>

      <Button className="w-full flex items-center justify-between px-4 py-3 rounded-md transition">
        <span className="flex items-center space-x-3">
          <Facebook size={18} />
          <span className="font-semibold">Find Facebook Friends</span>
        </span>
        <ChevronRight size={20} />
      </Button>

      <div className="text-center text-sm mt-6">
        Friends can directly challenge you anytime at:
        <div className="flex items-center justify-center mt-2 space-x-2">
          <Link
            to="https://chess.com/play/xiaobiao"
            className="underline "
            target="_blank"
            rel="noopener noreferrer"
          >
            https://chess.com/play/xiaobiao
          </Link>
          <Copy className="cursor-pointer" size={16} />
        </div>
      </div>
    </div>
  );
};

export default ChallengeOptions;
