import { Moon, Sun } from 'lucide-react';
import { useSettingActions, useTheme } from '@/stores/setting-store';

export function ModeToggle() {
  const theme = useTheme();
  const { toggleTheme } = useSettingActions();

  return (
    <div
      className="flex flex-row gap-1 items-center w-full"
      onClick={toggleTheme}
      aria-label={
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      }
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span>Toggle theme</span>
    </div>
  );
}
