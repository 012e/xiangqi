type PlayerColor = 'white' | 'black';
type GameEndStatus = 'white_win' | 'black_win' | 'draw';
type GameEndReason =
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
      }
    >
{
  type = 'State.Play' as const;

  constructor(
    public data: {
      from: string;
      to: string;
      player: PlayerColor;
    },
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any): StatePlay {
    return new StatePlay({
      from: json.data.from,
      to: json.data.to,
      player: json.data.player,
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
        status: GameEndStatus;
        reason: GameEndReason;
      }
    >
{
  type = 'State.GameEnd' as const;

  constructor(
    public data: {
      status: GameEndStatus;
      reason: GameEndReason;
    },
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any): StateGameEnd {
    return new StateGameEnd({
      status: json.data.status,
      reason: json.data.reason,
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
