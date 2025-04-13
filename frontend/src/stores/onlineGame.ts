import {ChessState as GameState, StatePlay} from '@/lib/online/state';
import Xiangqi from '@/lib/xiangqi';
import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

type Move = {
  from: string;
  to: string;
};

type Actions = {
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
  }): void;
    handleTopicMessage(message: GameState): void;
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
    fen: string;

  interval: NodeJS.Timeout | null;
  actions: Actions;
};

function invertColor(color: Color): Color {
  return color === 'white' ? 'black' : 'white';
}

export const useGameStore = create<Game>()(
    devtools((set, get) => ({
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
        fen: Xiangqi.DEFAULT_FEN,

        actions: {
            move(move): boolean {
                // remove old interval
                const interval = get().interval;
                if (interval) {
                    clearInterval(get().interval as NodeJS.Timeout);
                }

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
                if (playingColor === 'black') {
                    newInterval = setInterval(() => {
                        set(
                            (state) => ({
                                ...state,
                                blackTime: state.blackTime - 1000,
                            }),
                            false,
                            {
                                type: 'board.updateBlackTime',
                            },
                        );
                    }, 1000);
                } else {
                    newInterval = setInterval(() => {
                        set(
                            (state) => ({
                                ...state,
                                whiteTime: state.whiteTime - 1000,
                            }),
                            false,
                            {
                                type: 'board.updateWhiteTime',
                            },
                        );
                    }, 1000);
                }

                set(
                    (state) => ({
                        ...state,
                        move,
                        gameState: newGameState,
                        isStarted: true,
                        interval: newInterval,
                        playingColor: invertColor(state.playingColor),
                        fen: newGameState.exportFen(),
                    }),
                    false,
                    {
                        type: 'board.move',
                    },
                );
                return true;
            },

            handleTopicMessage(message: GameState) {
                const playerColor = get().playerColor;

                switch (message.type) {
                    case 'State.Play':
                        const moveHandler = get().actions.move;
                        const play = message as StatePlay;

                        if (playerColor !== play.data.player) {
                            const move = {
                                from: play.data.from,
                                to: play.data.to,
                            };
                            moveHandler(move);
                        }
                        break;
                    case 'State.Error':
                        console.error('Error from server:', message.data.message);
                        break;
                    case 'State.GameEnd':
                        console.log('Game ended:', message.data.reason);
                        break;
                }
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

                        isStarted,

                        interval,
                    }),
                    false,
                    {
                        type: 'board.init',
                    },
                );

                function beginInterval() {
                    if (isStarted) {
                        if (playingColor === 'black') {
                            interval = setInterval(() => {
                                set(
                                    (state) => ({
                                        blackTime: state.blackTime - 1000,
                                    }),
                                    false,
                                    {
                                        type: 'board.updateBlackTime',
                                    },
                                );
                            }, 1000);
                        } else {
                            interval = setInterval(() => {
                                set(
                                    (state) => ({
                                        whiteTime: state.whiteTime - 1000,
                                    }),
                                    false,
                                    {
                                        type: 'board.updateWhiteTime',
                                    },
                                );
                            }, 1000);
                        }
                    }
                }
            },
        },
    })),
);

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
