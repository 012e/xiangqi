import {
  PicesPlayOkXiangqi,
  PiecesChineseChess,
  PiecesClubXiangqi,
  PiecesXahlee, PiecesXboard,
} from '@/components/chessboard-styles/Pieces.tsx';
import { CustomPieces } from 'react-xiangqiboard/dist/chessboard/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultPieces } from '@/components/chessboard-styles/pieces-styles/xiangqi-default.tsx';
import { XiangqiBoard } from '@/components/chessboard-styles/board-styles/xiangqi-board.tsx';

export type Theme = 'dark' | 'light';

const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';

type SettingState = {
  backendUrl: string;
  theme: Theme;
  accessToken?: string;
  pieceTheme?: CustomPieces;
  pieceThemeName?: ThemeNamesPiece;
  boardTheme?: string;
};


type SettingActions = {
  actions: {
    setBackendUrl: (url: string) => void;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    setToken: (token: string) => void;
    setPieceTheme?: (pieceTheme: ThemeNamesPiece) => void;
    setBoardTheme?: (boardTheme: string) => void;
  };
};

function isObject(val: any): val is Record<string, any> {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function merge(target: any, source: any): any {
  if (Array.isArray(source)) {
    return source.slice();
  }

  if (isObject(source)) {
    const result = { ...target };
    for (const key in source) {
      if (isObject(source[key]) && isObject(target?.[key])) {
        result[key] = merge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  return source;
}

export type SettingStore = SettingState & SettingActions;

export type ThemeNamesPiece = "chinese" | "club" | "playok" | "xahlee" | 'xboard' | 'default';

const THEME_DATA: Record<ThemeNamesPiece, CustomPieces> = {
  chinese: PiecesChineseChess,
  club: PiecesClubXiangqi,
  xahlee: PiecesXahlee,
  xboard: PiecesXboard,
  default: defaultPieces,
  playok: PicesPlayOkXiangqi
};

const BACKEND_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://xiangqi-backend-e4f524a5a2ad.herokuapp.com';

const useSettingStore = create<SettingStore>()(
  persist(
    (set, get) => ({
      backendUrl: BACKEND_URL,
      theme: systemTheme,
      pieceTheme: THEME_DATA.default,
      pieceThemeName: 'default',
      boardTheme: XiangqiBoard,
      actions: {
        setTheme(theme: Theme): void {
          set({ theme });
        },
        toggleTheme(): void {
          const currentTheme = get().theme;
          const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
          set({ theme: newTheme });
        },
        setBackendUrl(url): void {
          set({ backendUrl: url });
        },
        setToken(token): void {
          set({ accessToken: token });
        },
        setPieceTheme(pieceTheme: ThemeNamesPiece): void {
          set({
             pieceTheme: THEME_DATA[pieceTheme] || THEME_DATA.chinese,
             pieceThemeName: pieceTheme,
          });
        },
        setBoardTheme(boardTheme: string): void {
          set({
            boardTheme: boardTheme,
          });
        },
      },
    }),
    {
      name: 'setting-storage',
      version: 1,
      merge: (persistedState, currentState) => {
        return merge(currentState, persistedState);
      },
    },
  ),
);

export const useBackendUrl = () => useSettingStore((state) => state.backendUrl);
export const useTheme = () => useSettingStore((state) => state.theme);

export const useSettingActions = () =>
  useSettingStore((state) => state.actions);

export default useSettingStore;
