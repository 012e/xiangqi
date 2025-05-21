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
class Player {
  constructor(
    private _id: string,
    private _username: string,
    private _picture: string,
    private _color: Color,
    private _time: number = 60 * 10 * 1000
  ) {}

  public get id() { return this._id; }
  public get username() { return this._username; }
  public get picture() { return this._picture; }
  public get color() { return this._color; }
  public get time() { return this._time; }

  public set time(value: number) {
    this._time = value;
  }
}
const DEFAULT_STATE: Partial<Data> = {
  id: '',
  selfPlayer: new Player('', '', '','white', 60 * 10 * 1000),
  enemyPlayer: new Player('', '', '','black', 60 * 10 * 1000),
  playingColor: 'white',
  interval: null,
  gameState: new Xiangqi(),
  isStarted: false,
  fen: Xiangqi.DEFAULT_FEN,
  showGameEndedDialog: false,
  isEnded: false,
};


function clonePlayer(player: Player, time?: number): Player {
  return new Player(
    player.id,
    player.username,
    player.picture,
    player.color,
    time !== undefined ? time : player.time,
  );
}
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
          // const gameState = get().gameState;
          const gameState = new Xiangqi(get().gameState.exportFen());
          if (!gameState.isLegalMove(move).ok) {
            return false;
          }
          gameState.move(move);
          // const newGameState = Object.assign(gameState, {});

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

              if (playerColor && isEqualColor(playerColor, play.data.player)) {
                const move = {
                  from: play.data.from,
                  to: play.data.to,
                };
                moveHandler(move);
              }

              // Sync the board (mostly for spectator mode)
              set(state => ({
                  ...state,
                  fen: message.data.fen,
                  selfPlayer: state.selfPlayer
                    ? clonePlayer(state.selfPlayer, state.selfPlayer.color === 'black' ? message.data.blackTime : message.data.whiteTime)
                    : undefined,
                  enemyPlayer: state.enemyPlayer
                    ? clonePlayer(state.enemyPlayer, state.enemyPlayer.color === 'black' ? message.data.blackTime : message.data.whiteTime)
                    : undefined,
              }), undefined, 'game.sync');
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
                    set({
                      selfPlayer: self?.color === 'black' ? clonePlayer(self, 0) : self,
                      enemyPlayer: enemy?.color === 'black' ? clonePlayer(enemy, 0) : enemy,
                    });
                  }
                  break;
                case 'black_win':
                  if (gameResult.detail === 'white_timeout') {
                    const self = get().selfPlayer;
                    const enemy = get().enemyPlayer;
                    set({
                      selfPlayer: self?.color === 'white' ? clonePlayer(self, 0) : self,
                      enemyPlayer: enemy?.color === 'white' ? clonePlayer(enemy, 0) : enemy,
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
          // let gameState;
          //
          // if (initialFen) {
          //   gameState = new Xiangqi(initialFen);
          // } else {
          //   gameState = new Xiangqi();
          // }
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
      actionsDenylist: ['game.updateSelfPlayer', 'game.updateEnemyPlayer'],
    },
  ),
);

type GetType = typeof useGameStore.getState; // typeof get
type SetType = typeof useGameStore.setState; // typeof get

function beginInterval(set: SetType, playingColor: Color | 'w' | 'b') {
  return setInterval(() => {
    set((state) => {
      const self = state.selfPlayer;
      const enemy = state.enemyPlayer;

      if (!self || !enemy) return {};

      if (isEqualColor(self.color, playingColor)) {
        return { selfPlayer: clonePlayer(self, self.time - 1000) };
      } else if (isEqualColor(enemy.color, playingColor)) {
        return { enemyPlayer: clonePlayer(enemy, enemy.time - 1000) };
      }

      return {};
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
