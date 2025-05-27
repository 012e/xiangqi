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
import { GameType } from '@/lib/online/game-type.ts';
import { useCallback, useEffect } from 'react';

type ComboboxArgs = {
  gameType: GameType[] | undefined;
  onSelect: (current: GameType) => void;
  defaultSelected?: GameType;
};
const DEFAULT_COMBOBOX_ARGS = {
  gameType: undefined,
  onSelect: () => {},
  defaultSelected: undefined,
};
export default function Combobox({
  gameType,
  onSelect,
  defaultSelected,
}: ComboboxArgs = DEFAULT_COMBOBOX_ARGS) {
  const [open, setOpen] = React.useState(false);
  const [selectedTypeName, setSelectedTypeName] = React.useState('');
  const handleSelect = useCallback(
    (current: GameType) => {
      setSelectedTypeName(
        current.typeName
      );
      setOpen(false);
      onSelect(current);
    },
    [onSelect],
  );
  
  useEffect(() => {
    if (defaultSelected) {
      setSelectedTypeName(defaultSelected.typeName);
      onSelect(defaultSelected);
    }
  }, [defaultSelected, onSelect]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between "
        >
          {selectedTypeName
            ? gameType?.find(
                (currentType) =>
                  currentType.typeName === selectedTypeName)?.typeName
            : gameType?.[4]?.typeName}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Time" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup >
              {gameType?.map((currentType) => (
                <CommandItem
                  className="hover:cursor-pointer"
                  key={currentType.id}
                  value={currentType.typeName}
                  onSelect={() => handleSelect(currentType)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedTypeName === currentType.typeName
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  <span>
                    <Clock />
                  </span>
                  {currentType.typeName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
