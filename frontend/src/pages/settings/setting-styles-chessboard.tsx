import { Tabs, TabsTrigger } from '@/components/ui/tabs';
import SelfPlayBoard from '../play/self-playboard';
import { TabsContent, TabsList } from '@radix-ui/react-tabs';
import { PieceStyleSelector } from '@/components/chessboard-styles/piece-setting';
import useSettingStore from '@/stores/setting-store';

export default function SettingStylesChessboard() {
  const setPieceTheme = useSettingStore((state) => state.actions.setPieceTheme);
  return (
    <div className="flex gap-5">
      <div className="flex w-1/3">
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
            <div className="flex justify-center items-center self-center">
              <PieceStyleSelector pieceTheme={setPieceTheme ?? (() => {})}/>
            </div>
          </TabsContent>
          <TabsContent value="boards">
            <h3 className="">boards Styles</h3>
          </TabsContent>
        </Tabs>
      </div>
      <div className="py-15 px-10 border-2 border-dashed rounded-lg flex items-center justify-center">
        <SelfPlayBoard isDraggablePiece={() => false} />
      </div>
    </div>
  );
}
