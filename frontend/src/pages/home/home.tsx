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
import { SiLichess } from "react-icons/si";
import SelfPlayBoard from '../play/self-playboard.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useNavigate } from 'react-router';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog.tsx';
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
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
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const handleNavigate = (link: string) => {
    if (!isAuthenticated) {
      setShowAlert(true); 
      return;
    }
    navigate(link)
  }

  return (
    <div className="w-full h-fulltext-foreground ">
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to access this feature. Would you like to log in now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => loginWithRedirect()}>
              Log In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="bg-background grid grid-cols-1 lg:grid-cols-[550px_400px]">
        {/* Left */}
        <div className="p-4 lg:block hidden mt-30">
          <div className="text-foreground flex flex-wrap space-x-2 justify-center">
            <span className=''>
              <SquareUser size={30} />
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
              <SquareUser size={30} />
            </span>
            <span>Me</span>
          </div>
        </div>
        {/* Right */}
        <div className="rounded-4xl my-5 h-auto bg-muted shadow-lg shadow-ring">
          <div className="h-auto flex flex-col items-center p-6 space-y-6">
            <div className="h-auto flex gap-1">
              <span className=''>
                <SiLichess className='font-bold w-10 h-auto'/>
              </span>
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
                <Button className="hover:font-bold" onClick={() => handleNavigate('/')}>
                  <Clock className="w-4 h-4 text-yellow-600" />
                  Game History
                </Button>
                <Button className=" hover:font-bold" onClick={() => handleNavigate('/')}>
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
