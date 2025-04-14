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
import { Button } from './components/ui/button';
const menuItems = [
  {
    icon: <Signal className="text-yellow-600 w-6 h-6" />,
    title: 'Play Online',
    desc: 'Play vs a person of similar skill',
  },
  {
    icon: <Bot className="text-indigo-700 w-6 h-6" />,
    title: 'Play Bots',
    desc: 'Challenge a bot from Easy to Master',
  },
  {
    icon: <Handshake className="text-amber-600 w-6 h-6" />,
    title: 'Play a Friend',
    desc: 'Invite a friend to a game of chess',
  },
  {
    icon: <Medal className="text-yellow-100 w-6 h-6" />,
    title: 'Tournaments',
    desc: 'Join an Arena where anyone can win',
  },
  {
    icon: <Puzzle className="text-green-400 w-6 h-6" />,
    title: 'Chess Variants',
    desc: 'Find fun new ways to play chess',
  },
];
export default function PlayGame() {
  return (
    <div className="bg-gray-800 grid grid-cols-1 lg:grid-cols-2 ">
      {/* Left */}
      <div className="bg-stone-800 min-h-screen text-white p-4 lg:block hidden ">
        <div className="flex flex-wrap space-x-2 justify-center">
          <span>
            <CircleUser size={30} />
          </span>
          <span>Oponent</span>
        </div>
        <div className="flex justify-center">
          <img
            className="w-140"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Xiangqi_Board.svg/800px-Xiangqi_Board.svg.png"
            alt="Image not found"
          ></img>
        </div>
        <div className="flex flex-wrap space-x-2 justify-center ">
          <span>
            <CircleUser size={30} />
          </span>
          <span>Me</span>
        </div>
      </div>
      {/* Right */}
      <div className="bg-stone-900">
        <div className=" text-white min-h-screen flex flex-col items-center p-6 space-y-6">
          <h1 className="text-4xl font-bold">Play Chess</h1>

          <div className="w-full max-w-md space-y-4">
            {menuItems.map(({ icon, title, desc }, idx) => (
              <div
                key={idx}
                className="flex items-center bg-stone-700 p-4 rounded-md shadow hover:bg-stone-600 cursor-pointer transition"
              >
                <div className="mr-4">{icon}</div>
                <div>
                  <h2 className="text-lg font-bold">{title}</h2>
                  <p className="text-sm text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-10 pt-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Button className="hover:font-bold">
                <Clock className="w-4 h-4 text-yellow-300" />
                Game History
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button className=" hover:font-bold">
                <Trophy className="w-4 h-4 text-yellow-300" />
                <div>
                  <p className="">Leaderboard</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
