import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  Flag,
  Handshake,
  Play,
} from 'lucide-react';
import SelfPlayBoard from './self-playboard';
import Combobox from '@/components/combobox';
import { Button } from '@/components/ui/button';
import React from 'react';
import MovePosition from '@/components/move-position';
const frameworks = [
  {
    value: '10',
    label: '10 Minute',
  },
  {
    value: '15',
    label: '15 Minute',
  },
  {
    value: '20',
    label: '20 Minute',
  },
  {
    value: '25',
    label: '25 Minute',
  },
  {
    value: '30',
    label: '30 Minute',
  },
  {
    value: '40',
    label: '40 Minute',
  },
  {
    value: '50',
    label: '50 Minute',
  },
  {
    value: '60',
    label: '1 Hours',
  },
  {
    value: '120',
    label: '1h30',
  },
  {
    value: '999999999',
    label: 'None have time',
  },
];

export default function PlayBot() {
  const [oponent, setOponent] = React.useState('Oponent');
  // const [listMove, setListMove] = React.useState([]);
  return (
    <div className="w-full text-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-[550px_400px] bg-background">
        {/* Left */}
        <div className="min-h-screen p-4 lg:block hidden mt-10">
          <div className="flex flex-wrap space-x-2 justify-center">
            <span>
              <CircleUser size={30} />
            </span>
            <span>{oponent}</span>
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
        <div className="rounded-4xl my-5 h-165 bg-muted">
          <div className="min-h-screen flex flex-col items-center p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-bold justify-center">
                Play With Bot
              </h1>
            </div>
            <div className="flex items-center">
              <Combobox frameworks={frameworks} />
            </div>
            <div className="">
              <Button
                className="hover:text-4xl text-3xl h-auto font-bold w-2xs"
                onClick={() => setOponent('Search ...')}
              >
                <div className="flex items-center">
                  <Play className="!w-7 !h-auto mr-1"></Play>
                  START
                </div>
              </Button>
            </div>
            <div className="bg-background rounded-2xl">
              <MovePosition></MovePosition>
            </div>
            <div className="flex space-x-3">
              <Button className="group">
                <Handshake className="transition-transform group-hover:scale-150" />
              </Button>
              <Button className="group">
                <Flag className="transition-transform group-hover:scale-150"></Flag>
              </Button>
              <Button className="group">
                <ChevronLeft className="transition-transform group-hover:scale-150" />
              </Button>
              <Button className="group">
                <ChevronRight className="transition-transform group-hover:scale-150" />
              </Button>
              <Button className="group">
                <ArrowUpDown className="transition-transform group-hover:scale-150" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
