import {
  Clock,
  Handshake,
  Medal,
  Puzzle,
  Trophy,
  Bot,
  Signal,
  SquareUser,
} from 'lucide-react';
import { SiLichess } from 'react-icons/si';
import SelfPlayBoard from '../play/self-playboard.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useNavigate } from 'react-router';

import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import AlertLogin from '@/components/popups/alert-login.tsx';
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
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const handleNavigate = (link: string) => {
    if (!isAuthenticated) {
      setShowAlert(true);
      return;
    }
    navigate(link);
  };

  return (
    <div className="w-full h-full text-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full justify-center items-center p-10">
        {/* Left */}
        <div className="w-full h-full">
          <AlertLogin showAlert={showAlert} setShowAlert={setShowAlert} />
          <div className="flex flex-col justify-center items-center bg-background w-full h-full gap-3 ">
            <div className="flex justify-center items-center">
              <span>
                <SquareUser size={30} />
              </span>
              <span>Opponent</span>
            </div>
            <div className="flex justify-center items-center">
              <div className="border-2">
                <SelfPlayBoard boardOrientation="white" />
              </div>
            </div>
            <div className="flex flex-wrap justify-center space-x-2">
              <span>
                <SquareUser size={30} />
              </span>
              <span>Me</span>
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="m-20 w-auto h-auto select-none shadow-lg rounded-4xl bg-muted shadow-ring">
          <div className="h-auto flex flex-col items-center p-6 space-y-6">
            <div className="h-auto flex gap-1">
              <span className="">
                <SiLichess className="font-bold w-10 h-auto" />
              </span>
              <h1 className="text-4xl font-bold justify-center text-foreground tracking-tight">
                Play Chess
              </h1>
            </div>
            <div className="">
              <div className="min-h-60 p-6 space-y-4 overflow-auto w-auto">
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
            <div className="w-auto">
              <div className="w-auto flex gap-2 text-sm items-center">
                <Button
                  className="hover:font-bold"
                  onClick={() => handleNavigate('/')}
                >
                  <Clock className="w-4 h-4 text-yellow-600" />
                  Game History
                </Button>
                <Button
                  className=" hover:font-bold"
                  onClick={() => handleNavigate('/')}
                >
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
