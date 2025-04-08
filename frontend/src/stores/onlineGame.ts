import Xiangqi from '@/lib/xiangqi';
import { create } from 'zustand';

type Move = {
  from: string;
  to: string;
};

type Actions = {
  move(move: Move): void;
  init(config: {
    gameId: string;
    player: string;
    playerColor: Color;
    playingColor: Color;
    timeBlack: number;
    timeWhite: number;
    isStarted: boolean;
    initialFen?: string;
  }): void;
};

type Color = 'white' | 'black';
type Game = {
  id: string;

  player: string;
  playerColor: Color;

  playingColor: Color;
  blackTime: number;
  whiteTime: number;
  gameState: Xiangqi;
  isStarted: boolean;

  interval: NodeJS.Timeout | null;
  actions: Actions;
};

function invertColor(color: Color): Color {
  return color === 'white' ? 'black' : 'white';
}

export const useGameStore = create<Game>((set, get) => ({
  id: '',
  player: '',
  playerColor: 'white',
  playingColor: 'white',
  blackTime: 60 * 3 * 1000,
  whiteTime: 60 * 3 * 1000,
  interval: null,
  gameState: new Xiangqi(),
  playing: false,
  isStarted: false,
  actions: {
    move(move) {

      // remove old interval
      const interval = get().interval;
      if (interval) {
        clearInterval(get().interval as NodeJS.Timeout);
      }

      // handle game state
      const gameState = get().gameState;
      gameState.move(move);
      const newGameState = Object.assign(gameState, {});

      // begin new interval for the other player
      const playingColor = invertColor(get().playingColor);
      let newInterval: NodeJS.Timeout | null = null;
      if (playingColor === 'black') {
        newInterval = setInterval(() => {
          set((state) => ({
            blackTime: state.blackTime - 1000,
          }));
        }, 1000);
      } else {
        newInterval = setInterval(() => {
          set((state) => ({
            whiteTime: state.whiteTime - 1000,
          }));
        }, 1000);
      }


      set((state) => ({
        ...state,
        move,
        gameState: newGameState,
        isStarted: true,
        interval: newInterval,
        playingColor: invertColor(state.playingColor),
      }));
    },

    init({
      gameId,
      player,
      playerColor,
      playingColor,
      timeBlack,
      timeWhite,
      initialFen,
      isStarted = false,
    }) {
      let gameState;

      if (initialFen) {
        gameState = new Xiangqi(initialFen);
      } else {
        gameState = new Xiangqi();
      }

      let interval: NodeJS.Timeout | null = null;
      beginInterval();

      set(() => ({
        id: gameId,
        player,
        playerColor,

        playingColor,
        blackTime: timeBlack,
        whiteTime: timeWhite,
        gameState,

        isStarted,

        interval,
      }));

      function beginInterval() {
        if (isStarted) {
          if (playingColor === 'black') {
            interval = setInterval(() => {
              set((state) => ({
                blackTime: state.blackTime - 1000,
              }));
            }, 1000);
          } else {
            interval = setInterval(() => {
              set((state) => ({
                whiteTime: state.whiteTime - 1000,
              }));
            }, 1000);
          }
        }
      }
    },
  },
}));

export const useGameId = () => useGameStore((state) => state.id);
export const usePlayer = () => useGameStore((state) => state.player);
export const usePlayerColor = () => useGameStore((state) => state.playerColor);
export const usePlayingColor = () => useGameStore((state) => state.playingColor);
export const useBlackTime = () => useGameStore((state) => state.blackTime);
export const useWhiteTime = () => useGameStore((state) => state.whiteTime);
export const useGameState = () => useGameStore((state) => state.gameState);
export const useIsStarted = () => useGameStore((state) => state.isStarted);

export const useGameActions = () => useGameStore((state) => state.actions);

export const useGameTimes = () => useGameStore((state) => ({
  blackTime: state.blackTime,
  whiteTime: state.whiteTime,
}));

