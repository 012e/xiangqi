import { ArrowLeft, CircleUser, Search } from 'lucide-react';
import SelfPlayBoard from './self-playboard';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'cmdk';
import { Command } from '@/components/ui/command';
import ChallengeOptions from '@/components/challenge-options';
const listFriend = [
  {
    name: 'teo',
    avatar: null,
  },
  {
    name: 'ti',
  },
  {
    name: 'baby',
  },
  {
    name: 'teo',
    avatar: null,
  },
  {
    name: 'ti',
  },
  {
    name: 'baby',
  },
  {
    name: 'teo',
    avatar: null,
  },
  {
    name: 'ti',
  },
  {
    name: 'baby',
  },
  {
    name: 'teo',
    avatar: null,
  },
  {
    name: 'ti',
  },
  {
    name: 'baby',
  },
  {
    name: 'teo',
    avatar: null,
  },
  {
    name: 'ti',
  },
  {
    name: 'baby',
  },
];
export default function PlayFriend() {
  const [oponent] = React.useState('Oponent');
  // const [listMove, setListMove] = React.useState([]);
  return (
    <div className="w-full">
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
        <div className="bg-stone-900 rounded-4xl my-5 h-180  ">
          <div className=" text-white min-h-screen flex flex-col items-center p-6 space-y-6">
            <div className="flex space-x-3">
              <Button className="group mt-1">
                <ArrowLeft className="scale-200 group-hover:text-gray-300" />
              </Button>
              <h1 className="text-4xl font-bold justify-center">
                Play a Friend
              </h1>
            </div>
            <div className="w-full shadow-2xl px-5">
              <Command className="border shadow">
                <div className="flex group p-2 space-x-2">
                  <Search className="pt-1 " size={20}></Search>
                  <CommandInput
                    placeholder="Type a command or search..."
                    className="focus:border-none w-full "
                  />
                </div>
                <CommandList className="p-2">
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup
                    heading="Suggestions:"
                    className="font-bold overflow-auto h-50"
                  >
                    {listFriend.map((fr, index) => {
                      return (
                        <CommandItem
                          className="hover:bg-gray-100 !text-2 !pl-2 font-normal hover:cursor-pointer"
                          key={index}
                        >
                          {fr.name}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
            <div>
              <ChallengeOptions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
