export type PlayerColor = 'white' | 'black';
export type GameResult = 'white_win' | 'black_win' | 'draw';
export type GameResultDetail =
  | 'black_resign'
  | 'black_timeout'
  | 'black_checkmate'
  | 'white_resign'
  | 'white_timeout'
  | 'white_checkmate'
  | 'stalemate'
  | 'insufficient_material'
  | 'fifty_move_rule'
  | 'mutual_agreement';

interface BaseState<T extends string, D> {
  type: T;
  data: D;
}

export class StatePlay
  implements
    BaseState<
      'State.Play',
      {
        from: string;
        to: string;
        player: PlayerColor;
        fen: string;
        uciFen: string;
      }
    >
{
  type = 'State.Play' as const;

  constructor(
    public data: {
      from: string;
      to: string;
      player: PlayerColor;
      fen: string;
      uciFen: string;
    },
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any): StatePlay {
    return new StatePlay({
      from: json.data.from,
      to: json.data.to,
      player: json.data.player,
      fen: json.data.fen,
      uciFen: json.data.uciFen,
    });
  }
}

export class StateError
  implements BaseState<'State.Error', { message: string }>
{
  type = 'State.Error' as const;

  constructor(public data: { message: string }) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any): StateError {
    return new StateError({ message: json.data.message });
  }
}

export class StateGameEnd
  implements
    BaseState<
      'State.GameEnd',
      {
        result: GameResult;
        detail: GameResultDetail;
      }
    >
{
  type = 'State.GameEnd' as const;

  constructor(
    public data: {
      result: GameResult;
      detail: GameResultDetail;
    },
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any): StateGameEnd {
    const result = json.data.result;
    const detail = json.data.detail;
    if (!result) {
      throw new Error('Missing result in GameEnd state');
    }
    if (!detail) {
      throw new Error('Missing detail in GameEnd state');
    }
    return new StateGameEnd({
      result: result,
      detail: detail,
    });
  }
}

export type ChessState = StatePlay | StateError | StateGameEnd;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deserializeState(json: any): ChessState {
  switch (json.type) {
    case 'State.Play':
      return StatePlay.fromJSON(json);
    case 'State.Error':
      return StateError.fromJSON(json);
    case 'State.GameEnd':
      return StateGameEnd.fromJSON(json);
    default:
      throw new Error(`Unknown state type: ${json.type}`);
  }
}
