'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Clock, Loader2 } from 'lucide-react';

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
import { GameType, getCachedGameTypes } from '@/lib/online/game-type.ts';
import { useCallback, useEffect } from 'react';

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
  gameType,
  onSelect,
  defaultSelected,
  isLoading = false,
}: ComboboxArgs = DEFAULT_COMBOBOX_ARGS) {
  const [open, setOpen] = React.useState(false);
  const [selectedTypeName, setSelectedTypeName] = React.useState('');
  
  // Try to get cached data if main data is not available
  const effectiveGameTypes = gameType || getCachedGameTypes();
  
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

  // Show loading state or disabled state when no data
  const isDisabled = isLoading || !effectiveGameTypes || effectiveGameTypes.length === 0;
  const displayText = isLoading 
    ? "Loading..." 
    : selectedTypeName
      ? effectiveGameTypes?.find(
          (currentType) => currentType.typeName === selectedTypeName
        )?.typeName
      : effectiveGameTypes?.[4]?.typeName || "Select game type";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={isDisabled}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {displayText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Time" />
          <CommandList>
            <CommandEmpty>No game types found.</CommandEmpty>
            <CommandGroup>
              {effectiveGameTypes?.map((currentType) => (
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
