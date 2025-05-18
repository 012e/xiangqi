import {
  GameResult,
  GameResultDetail,
  ChessState as GameState,
  StateGameEnd,
  StatePlay,
} from '@/lib/online/state';
import Xiangqi from '@/lib/xiangqi';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Move = {
  from: string;
  to: string;
};

type Actions = {
  actions: {
    move(move: Move): boolean;
    init(config: {
      gameId: string;
      player: string;
      playerColor: Color;
      playingColor: Color;
      timeBlack: number;
      timeWhite: number;
      isStarted: boolean;
      initialFen?: string;
      isEnded: boolean;
    }): void;
    setTime({
      blackTime,
      whiteTime,
    }: {
      blackTime?: number;
      whiteTime?: number;
    }): void;
    handleTopicMessage(message: GameState): void;
    setGameEndedDialog(showGameEndedDialog: boolean): void;
  };
};

type Color = 'white' | 'black';

type Data = {
  id: string;

  player: string;
  playerColor: Color;

  playingColor: Color;
  blackTime: number;
  whiteTime: number;
  gameState: Xiangqi;
  isStarted: boolean;
  fen: string;

  showGameEndedDialog: boolean;
  isEnded: boolean;

  gameResult: GameResult | null;
  gameResultDetail: GameResultDetail | null;

  interval: NodeJS.Timeout | null;
};

type GameStore = Data & Actions;

const DEFAULT_STATE: Partial<Data> = {
  id: '',
  player: '',
  playerColor: 'white',
  playingColor: 'white',
  whiteTime: 60 * 10 * 1000,
  blackTime: 60 * 10 * 1000,
  interval: null,
  gameState: new Xiangqi(),
  isStarted: false,
  fen: Xiangqi.DEFAULT_FEN,
  showGameEndedDialog: false,
  isEnded: false,
};

function invertColor(color: Color): Color {
  return color === 'white' ? 'black' : 'white';
}

function isEqualColor(
  color1: Color | 'w' | 'b',
  color2: Color | 'w' | 'b',
): boolean {
  if (color1 === 'w') {
    color1 = 'white';
  }
  if (color2 === 'w') {
    color2 = 'white';
  }
  if (color1 === 'b') {
    color1 = 'black';
  }
  if (color2 === 'b') {
    color2 = 'black';
  }

  return color1 === color2;
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      ...DEFAULT_STATE,

      actions: {
        move(move): boolean {
          if (get().isEnded) {
            return false;
          }

          // remove old interval
          const interval = get().interval;

          // handle game state
          const gameState = get().gameState;
          if (!gameState.isLegalMove(move).ok) {
            return false;
          }
          gameState.move(move);
          const newGameState = Object.assign(gameState, {});

          // begin new interval for the other player
          const playingColor = invertColor(get().playingColor);

          let newInterval: NodeJS.Timeout | null = null;
          if (interval) {
            clearInterval(interval);
          }
          newInterval = beginInterval(set, playingColor);

          set(
            (state) => ({
              move,
              gameState: newGameState,
              isStarted: true,
              interval: newInterval,
              playingColor: invertColor(state.playingColor),
              fen: newGameState.exportFen(),
            }),
            false,
            {
              type: 'game.move',
            },
          );
          return true;
        },

        handleTopicMessage(message: GameState) {
          const playerColor = get().playerColor;

          switch (message.type) {
            case 'State.Play': {
              const moveHandler = get().actions.move;
              const play = message as StatePlay;

              if (isEqualColor(playerColor, play.data.player)) {
                const move = {
                  from: play.data.from,
                  to: play.data.to,
                };
                moveHandler(move);
              }

              // Sync the board (mostly for spectator mode)
              set(
                () => ({
                  fen: message.data.fen,
                  blackTime: message.data.blackTime,
                  whiteTime: message.data.whiteTime,
                }),
                undefined,
                'game.sync',
              );

              break;
            }
            case 'State.Error':
              console.error('Error from server:', message.data.message);
              break;
            case 'State.GameEnd': {
              const gameResult = (message as StateGameEnd).data;
              set(
                () => ({
                  gameResult: gameResult.result,
                  gameResultDetail: gameResult.detail,

                  showGameEndedDialog: true,
                  isEnded: true,
                }),
                undefined,
                'game.end',
              );

              // clear timer interval
              const interval = get().interval;
              if (interval) {
                clearInterval(interval);
              }

              switch (gameResult.result) {
                case 'white_win':
                  console.log('White wins');
                  if (gameResult.detail === 'black_timeout') {
                    set(() => ({
                      blackTime: 0,
                    }));
                  }
                  break;
                case 'black_win':
                  if (gameResult.detail === 'white_timeout') {
                    set(() => ({
                      whiteTime: 0,
                    }));
                  }
                  console.log('Black wins');
                  break;
                case 'draw':
                  console.log('Draw');
                  break;
                default:
                  console.error('Unknown game result:', gameResult.result);
              }
              break;
            }
          }
        },

        setGameEndedDialog(showGameEndedDialog?: boolean): void {
          set(
            () => ({
              showGameEndedDialog: showGameEndedDialog,
            }),
            false,
            {
              type: 'game.setGameEndedDialog',
            },
          );
        },
        // set time in actions
        setTime({ blackTime, whiteTime }) {
          set(
            (state) => ({
              blackTime: blackTime !== undefined ? blackTime : state.blackTime,
              whiteTime: whiteTime !== undefined ? whiteTime : state.whiteTime,
            }),
            false,
            { type: 'game.setTime' },
          );
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
          isEnded = false,
        }) {
          let gameState;

          if (initialFen) {
            gameState = new Xiangqi(initialFen);
          } else {
            gameState = new Xiangqi();
          }

          let oldInterval = get().interval;
          if (oldInterval) {
            clearInterval(oldInterval);
          }

          let interval: NodeJS.Timeout | null = null;
          if (isStarted) {
            interval = beginInterval(set, playingColor);
          }

          set(
            () => ({
              id: gameId,
              player,
              playerColor,
              playingColor,
              blackTime: timeBlack,
              whiteTime: timeWhite,
              gameState,
              fen: gameState.exportFen(),
              showGameEndedDialog: false,
              isStarted,
              interval,
              isEnded,
            }),
            false,
            {
              type: 'game.init',
            },
          );
        },
      },
    }),
    {
      actionsDenylist: ['game.updateWhiteTime', 'game.updateBlackTime'],
    },
  ),
);

type GetType = typeof useGameStore.getState; // typeof get
type SetType = typeof useGameStore.setState; // typeof get

function beginInterval(set: SetType, playingColor: Color | 'w' | 'b') {
  if (isEqualColor(playingColor, 'black')) {
    return setInterval(() => {
      set(
        (state) => ({
          blackTime: state.blackTime - 1000,
        }),
        undefined,
        {
          type: 'game.updateBlackTime',
        },
      );
    }, 1000);
  } else {
    return setInterval(() => {
      set(
        (state) => ({
          whiteTime: state.whiteTime - 1000,
        }),
        undefined,
        {
          type: 'game.updateWhiteTime',
        },
      );
    }, 1000);
  }
}

export const useGameId = () => useGameStore((state) => state.id);
export const usePlayer = () => useGameStore((state) => state.player);
export const usePlayerColor = () => useGameStore((state) => state.playerColor);
export const usePlayingColor = () =>
  useGameStore((state) => state.playingColor);
export const useBlackTime = () => useGameStore((state) => state.blackTime);
export const useWhiteTime = () => useGameStore((state) => state.whiteTime);
export const useGameState = () => useGameStore((state) => state.gameState);
export const useIsStarted = () => useGameStore((state) => state.isStarted);

export const useGameActions = () => useGameStore((state) => state.actions);

export const useGameTimes = () =>
  useGameStore((state) => ({
    blackTime: state.blackTime,
    whiteTime: state.whiteTime,
  }));
