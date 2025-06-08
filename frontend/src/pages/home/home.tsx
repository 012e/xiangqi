import {
  CircleUser,
  Clock,
  Handshake,
  Medal,
  Puzzle,
  Trophy,
  Bot,
  Signal,
} from 'lucide-react';
import SelfPlayBoard from '../play/self-playboard.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useNavigate } from 'react-router';
const menuItems = [
  {
    icon: <Signal className="text-yellow-600 w-10 h-10" />,
    title: 'Play Online',
    desc: 'Play vs a person of similar skill',
    link: '/play/online',
  },
  {
    icon: <Bot className="text-indigo-700 w-10 h-10" />,
    title: 'Play Bots',
    desc: 'Challenge a bot from Easy to Master',
    link: '/play/bot',
  },
  {
    icon: <Handshake className="text-amber-600 w-10 h-10" />,
    title: 'Play a Friend',
    desc: 'Invite a friend to a game of chess',
    link: '/play/friend',
  },
  {
    icon: <Medal className="text-yellow-100 w-10 h-10" />,
    title: 'Tournaments',
    desc: 'Join an Arena where anyone can win',
    link: '/#',
  },
  {
    icon: <Puzzle className="text-green-400 w-10 h-10" />,
    title: 'Chess Variants',
    desc: 'Find fun new ways to play chess',
    link: '/#',
  },
];
export default function Home() {
  const navigate = useNavigate();
  const handleNavigate = (link: string) => {
    navigate(link)
  }
  return (
    <div className="w-full h-fulltext-foreground ">
      <div className="bg-background grid grid-cols-1 lg:grid-cols-[550px_400px]">
        {/* Left */}
        <div className="p-4 lg:block hidden mt-30">
          <div className="text-foreground flex flex-wrap space-x-2 justify-center">
            <span>
              <CircleUser size={30} />
            </span>
            <span>Opponent</span>
          </div>
          <div className="flex justify-center p-3">
            <div className="border-2">
              <SelfPlayBoard boardOrientation="white" />
            </div>
          </div>
          <div className="flex flex-wrap space-x-2 justify-center ">
            <span>
              <CircleUser size={30} />
            </span>
            <span>Me</span>
          </div>
        </div>
        {/* Right */}
        <div className="rounded-4xl my-5 h-auto bg-muted shadow-lg shadow-ring">
          <div className="h-auto flex flex-col items-center p-6 space-y-6">
            <div className="h-auto">
              <h1 className="text-4xl font-bold justify-center text-foreground tracking-tight">
                Play Chess
              </h1>
            </div>
            <div className="">
              <div className="min-h-60 p-6 space-y-4 overflow-auto w-75">
                {menuItems.map((item, index) => (
                  <div
                    onClick={() => handleNavigate(item.link)}
                    key={index}
                    className="hover:bg-ring bg-background flex items-center p-4 rounded-lg shadow transition cursor-pointer"
                  >
                    <div className="text-3xl mr-4">{item.icon}</div>
                    <div>
                      <div className="text-lg font-semibold">{item.title}</div>
                      <div className="text-sm ">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='w-auto'>
              <div className="w-auto flex gap-2 text-sm items-center">
                <Button className="hover:font-bold">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  Game History
                </Button>
                <Button className=" hover:font-bold">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <div>
                    <p className="">Leaderboard</p>
                  </div>
                </Button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
