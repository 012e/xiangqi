import SettingForm from '@/pages/settings/setting-form.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useTheme } from '@/styles/ThemeContext.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SettingStylesChessboard from './setting-styles-chessboard';

export default function SettingsPage() {
  const { setThemeByName } = useTheme();
  return (
    <div className="border border-border rounded-lg p-7 bg-background text-foreground m-6">
      <div className='mb-10'>
          <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue='backend' className="w-full">
        <TabsList >
          <TabsTrigger value="backend" className='text-lg font-semibold p-5 '>Backend URL</TabsTrigger>
          <TabsTrigger value="theme" className='text-lg font-semibold p-5 '>Theme</TabsTrigger>
          <TabsTrigger value="chessboard" className='text-lg font-semibold p-5 '>Board & Pieces</TabsTrigger>
        </TabsList>
        <TabsContent value="backend">
          <section>
              <SettingForm />
          </section>
        </TabsContent>
        <TabsContent value="theme">
          {/* Theme */}
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
        </TabsContent>
        <TabsContent value="chessboard">
          <section className="mt-4">
            <h3 className="text-lg font-bold mb-4">Chessboard Styles</h3>
            <p className="mb-4">Customize the look and feel of your chess set.</p>
          </section>
          <SettingStylesChessboard />
        </TabsContent>
      </Tabs>

      <div className='flex justify-end mt-6'>
        <Button className='font-semibold' onClick={() => alert('Settings saved!')}>
          Save
        </Button>
      </div>
    </div>
  );
}
