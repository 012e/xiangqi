import { Tabs, TabsTrigger } from '@/components/ui/tabs';
import SelfPlayBoard from '../play/self-playboard';
import { TabsContent, TabsList } from '@radix-ui/react-tabs';
import { Button } from '@/components/ui/button';
import useSettingStore, { ThemeNames } from '@/stores/setting-store';

export default function SettingStylesChessboard() {
  const setPieceTheme = useSettingStore((state) => state.actions.setPieceTheme);
  const themePieces: ThemeNames[] = [
    'chinese',
    'club',
    'playok',
    'xahlee',
    'xboard',
  ];
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex">
        <Tabs defaultValue="pieces" className="w-full">
          <TabsList>
            <TabsTrigger value="pieces" className=" font-semibold">
              Pieces
            </TabsTrigger>
            <TabsTrigger value="boards" className="font-semibold">
              Boards
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pieces">
            <div className="flex flex-wrap gap-2">
              {themePieces.map((theme) => (
                <Button key={theme} onClick={() => setPieceTheme?.(theme)}>
                  {theme}
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="boards">
            <h3 className="">boards Styles</h3>
          </TabsContent>
        </Tabs>
      </div>
      <div className="p-5 border-2 border-dashed rounded-lg flex items-center justify-center">
        <SelfPlayBoard isDraggablePiece={() => false} />
      </div>
    </div>
  );
}
