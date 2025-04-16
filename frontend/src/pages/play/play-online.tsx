import { CircleUser, Play } from 'lucide-react';
import SelfPlayBoard from './self-playboard';
import Combobox from '@/components/combobox';
import { Button } from '@/components/ui/button';
import React from 'react';
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
// type move = {
//   id: number;
//   w: string;
//   b: string;
// };
export default function PlayOnline() {
  const [oponent, setOponent] = React.useState('Oponent');
  // const [listMove, setListMove] = React.useState([]);
  return (
    <div className="w-screen">
      <div className="bg-stone-800 grid grid-cols-1 lg:grid-cols-[550px_400px]">
        {/* Left */}
        <div className="bg-stone-800 min-h-screen text-white p-4 lg:block hidden mt-10">
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
        <div className="bg-stone-900 rounded-4xl my-5 h-165 ">
          <div className=" text-white min-h-screen flex flex-col items-center p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-bold justify-center">Play Online</h1>
            </div>
            <div className="flex items-center text-black">
              <Combobox frameworks={frameworks} />
            </div>
            <div className="text-white">
              <Button
                className="hover:bg-green-400 hover:text-4xl text-3xl h-auto font-bold bg-green-500 w-2xs"
                onClick={() => setOponent('Search ...')}
              >
                <div className="flex items-center">
                  <Play className="!w-7 !h-auto mr-1"></Play>
                  START
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
