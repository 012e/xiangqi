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
import { GameType, getGameTypes } from '@/lib/online/game-type.ts';
import { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

type ComboboxArgs = {
  gameType: GameType[] | undefined;
  onSelect: (current: GameType) => void;
  defaultSelected?: GameType;
  isLoading?: boolean;
};
const DEFAULT_COMBOBOX_ARGS = {
  gameType: undefined,
  onSelect: () => {},
  defaultSelected: undefined,
  isLoading: false,
};
export default function Combobox({
  onSelect,
  defaultSelected,
}: ComboboxArgs = DEFAULT_COMBOBOX_ARGS) {
  const [open, setOpen] = React.useState(false);
  const [selectedTypeName, setSelectedTypeName] = React.useState('');

  const {
    data: gameTypes,
    isFetched
  } = useQuery({
    queryFn: getGameTypes,
    queryKey: ['gameTypes'],
    staleTime: 1000 * 60 * 10,
  });

  const handleSelect = useCallback(
    (current: GameType) => {
      setSelectedTypeName(current.typeName);
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
          className="justify-between w-[200px]"
          disabled={!isFetched}
        >
          {selectedTypeName}
          <ChevronsUpDown className="ml-2 w-4 h-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[200px]">
        {isFetched && (
          <Command>
            <CommandInput placeholder="Time" />
            <CommandList>
              <CommandEmpty>No game types found.</CommandEmpty>
              <CommandGroup>
                {gameTypes!.map((currentType) => (
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
        )}
      </PopoverContent>
    </Popover>
  );
}
