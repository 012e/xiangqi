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
import { immer } from 'zustand/middleware/immer';

type Move = {
  from: string;
  to: string;
};

type Actions = {
  actions: {
    move(move: Move): boolean;
    init(config: {
      gameId: string;
      selfPlayer: Player;
      enemyPlayer: Player;
      playingColor: Color;

      isStarted: boolean;
      initialFen?: string;
      isEnded: boolean;
    }): void;
    handleTopicMessage(message: GameState): void;
    setGameEndedDialog(showGameEndedDialog: boolean): void;
  };
};

type Color = 'white' | 'black';

// TODO: group types
type Data = {
  id: string;

  selfPlayer: Player;
  enemyPlayer: Player;

  playingColor: Color;

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

export type Player = {
  id: number;
  username: string;
  color: Color;
  time: number;
  picture: string;
  name: string;
  sub: string;
  email: string;
};

const DEFAULT_STATE: Partial<Data> = {
  id: '',
  selfPlayer: {
    id: 0,
    username: '',
    color: 'white',
    time: 60 * 10 * 1000,
    picture: '',
    name: '',
    sub: '',
    email: '',
  },
  enemyPlayer: {
    id: 0,
    username: '',
    color: 'black',
    time: 60 * 10 * 1000,
    picture: '',
    name: '',
    sub: '',
    email: '',
  },
  playingColor: 'white',
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
  const normalize = (c: Color | 'w' | 'b') =>
    c === 'w' ? 'white' : c === 'b' ? 'black' : c;

  return normalize(color1) === normalize(color2);
}

export const useGameStore = create<GameStore>()(
  immer(
    devtools(
      (set, get) => ({
        ...DEFAULT_STATE,

        actions: {
          move(move): boolean {
            if (get().isEnded) {
              return false;
            }

            // remove an old interval
            const interval = get().interval;

            // handle game state
            const gameState = new Xiangqi(get().gameState.exportFen());
            if (!gameState.isLegalMove(move).ok) {
              return false;
            }
            gameState.move(move);

            // begin a new interval for the other player
            const playingColor = invertColor(get().playingColor);

            let newInterval: NodeJS.Timeout | null = null;
            if (interval) {
              clearInterval(interval);
            }
            newInterval = beginInterval(set, playingColor);

            set(
              (state) => ({
                move,
                gameState,
                isStarted: true,
                interval: newInterval,
                playingColor: invertColor(state.playingColor),
                fen: gameState.exportFen(),
              }),
              false,
              {
                type: 'game.move',
              },
            );
            return true;
          },

          handleTopicMessage(message: GameState) {
            const playerColor = get().selfPlayer?.color;
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
                set(state => {
                  state.fen = play.data.fen;
                  if (state.selfPlayer.color === 'black') {
                    state.selfPlayer.time = play.data.blackTime;
                    state.enemyPlayer.time = play.data.whiteTime;
                  } else {
                    state.selfPlayer.time = play.data.whiteTime;
                    state.enemyPlayer.time = play.data.blackTime;
                  }
                }, undefined, 'game.sync');
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
                      const self = get().selfPlayer;
                      const enemy = get().enemyPlayer;
                      if (self.color === 'black') {
                        self.time = 0;
                      } else {
                        enemy.time = 0;
                      }
                      set((state) => {
                        state.selfPlayer = self;
                        state.enemyPlayer = enemy;
                      });
                    }
                    break;
                  case 'black_win':
                    if (gameResult.detail === 'white_timeout') {
                      const self = get().selfPlayer;
                      const enemy = get().enemyPlayer;
                      if (self.color === 'white') {
                        self.time = 0;
                      } else {
                        enemy.time = 0;
                      }
                      set((state) => {
                        state.selfPlayer = self;
                        state.enemyPlayer = enemy;
                      });
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
          init({
                 gameId,
                 selfPlayer,
                 enemyPlayer,
                 playingColor,

                 initialFen,
                 isStarted = false,
                 isEnded = false,
               }) {
            const gameState = initialFen ? new Xiangqi(initialFen) : new Xiangqi();

            const oldInterval = get().interval;
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
                selfPlayer,
                enemyPlayer,
                playingColor,
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
        actionsDenylist: ['game.updatePlayerTime'],
      },
    ),
  ));

type GetType = typeof useGameStore.getState; // typeof get
type SetType = typeof useGameStore.setState; // typeof get

function beginInterval(set: SetType, playingColor: Color | 'w' | 'b'): NodeJS.Timeout {
  return setInterval(() => {
    set((state) => {
      const self = state.selfPlayer;
      const enemy = state.enemyPlayer;

      if (!self || !enemy) return {};

      if (isEqualColor(self.color, playingColor)) {
        state.selfPlayer.time -= 1000;
        return;
      }
      state.enemyPlayer.time -= 1000;
    }, undefined, {
      type: 'game.updatePlayerTime',
    });
  }, 1000);
}

export const useGameId = () => useGameStore((state) => state.id);
export const useSelfPlayer = () => useGameStore((state) => state.selfPlayer);
export const useEnemyPlayer = () => useGameStore((state) => state.enemyPlayer);
export const usePlayerColor = () => useGameStore((state) => state.selfPlayer?.color);
export const usePlayingColor = () =>
  useGameStore((state) => state.playingColor);
export const useSelfPlayerTime = () => useGameStore((state) => state.selfPlayer?.time);
export const useEnemyPlayerTime = () => useGameStore((state) => state.enemyPlayer?.time);
export const useGameState = () => useGameStore((state) => state.gameState);
export const useIsStarted = () => useGameStore((state) => state.isStarted);

export const useGameActions = () => useGameStore((state) => state.actions);

export const usePlayerTimes = () =>
  useGameStore((state) => ({
    selfTime: state.selfPlayer?.time ?? 0,
    enemyTime: state.enemyPlayer?.time ?? 0,
  }));
