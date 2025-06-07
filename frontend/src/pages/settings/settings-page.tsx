import SettingForm from '@/pages/profile/setting-form.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useTheme } from '@/styles/ThemeContext.tsx';

export default function SettingsPage() {
  const { setThemeByName } = useTheme();
  return (
    <div className="">
      <header>
        <div>
          <h1 className="text-2xl font-bold my-2">Settings</h1>
        </div>
      </header>

      <section>
        <div className="flex py-5">
          <SettingForm />
        </div>
      </section>

      {/* Theme */}
      <section className="mb-8">
        <h3 className="text-lg font-bold ">Theme</h3>
        <div className="flex gap-4">
          <Button
            onClick={() => setThemeByName('light')}
            className="px-4 py-2 border border-border rounded-lg text-background bg-foreground hover:bg-primary/90"
          >
            Light Theme
          </Button>
          <Button
            onClick={() => setThemeByName('dark')}
            className="px-4 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-secondary/90"
          >
            Dark Theme
          </Button>
        </div>
      </section>
    </div>
  )
}