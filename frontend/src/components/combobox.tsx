'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {useGameActions} from "@/stores/online-game-store.ts";

type Frameworks = {
  value: string;
  label: string;
};

export default function Combobox({ frameworks }: { frameworks: Frameworks[] }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const { setTime } = useGameActions();
  const handleSelect = (current: string) => {
    setValue(current === value ? '' : current);
    setOpen(false);
    if(value !== null) {
        setTime({blackTime: parseInt(current)*60*1000, whiteTime: parseInt(current)*60*1000});
    }
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between "
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : 'Select Time'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Time" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  className="hover:cursor-pointer"
                  key={framework.value}
                  value={framework.value}
                  onSelect={(current) => handleSelect(current)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === framework.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span>
                    <Clock></Clock>
                  </span>
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
