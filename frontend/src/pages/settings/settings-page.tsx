import SettingForm from '@/pages/settings/setting-form.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useTheme } from '@/styles/ThemeContext.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Archive, Command, Palette, Settings } from 'lucide-react';
import SettingStylesChessboard from './setting-styles-chessboard';
type TabType = {
  name: string;
  value: string;
  icon: React.ElementType;
  element?: React.ReactNode;
};
const tabs: TabType[] = [
  {
    name: 'Backend',
    value: 'backend',
    icon: Archive,
    element: <SettingForm />,
  },
  {
    name: 'Theme',
    value: 'theme',
    icon: Palette,
    element: <SettingTheme />,
  },
  {
    name: 'Chessboard Styles',
    value: 'chessboard',
    icon: Command,
    element: <SettingChessboard />,
  },
];
function SettingTheme() {
  const { setThemeByName } = useTheme();
  return (
    <section className="">
      <h3 className="text-lg font-bold mb-4">Theme</h3>
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
  );
}

function SettingChessboard() {
  return (
    <section className="mt-4">
      <h3 className="text-lg font-bold mb-4">Chessboard Styles</h3>
      <p className="mb-4">Customize the look and feel of your chess set.</p>
      <SettingStylesChessboard />
    </section>
  );
}
export default function SettingsPage() {
  return (
    <div className="flex flex-col border border-border rounded-lg p-7 bg-background text-foreground m-6">
      <div className="mb-10 flex justify-start items-center gap-1">
        <span>
          <Settings className="w-6"></Settings>
        </span>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <div className="h-full w-auto">
        <Tabs orientation="vertical" defaultValue={tabs[0].value} className="">
          <div className="flex w-full h-full">
            <div className="h-full w-auto">
              <TabsList className="shrink-0 grid grid-cols-1 gap-1 p-0 bg-background h-full w-auto">
                {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="w-full transition-all hover:bg-muted data-[state=active]:bg-muted  border-r-[3px] border-l-0 border-y-0 data-[state=active]:border-primary rounded-none justify-start px-4 py-3"
                    >
                      <tab.icon className="h-5 w-5 me-2" />
                      <span className="flex self-start w-full">{tab.name}</span>
                    </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="flex-1 border rounded-md font-medium text-muted-foreground px-7 py-3">
              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  <div>{tab.element}</div>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          className="font-semibold"
          onClick={() => alert('Settings saved!')}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
