import { z } from 'zod';

// Enums
export const PlayerColorSchema = z.enum(['white', 'black']);
export type PlayerColor = z.infer<typeof PlayerColorSchema>;

export const GameResultSchema = z.enum(['white_win', 'black_win', 'draw']);
export type GameResult = z.infer<typeof GameResultSchema>;

export const GameResultDetailSchema = z.enum([
  'black_resign',
  'black_timeout',
  'black_checkmate',
  'white_resign',
  'white_timeout',
  'white_checkmate',
  'stalemate',
  'insufficient_material',
  'fifty_move_rule',
  'mutual_agreement',
]);
export type GameResultDetail = z.infer<typeof GameResultDetailSchema>;

// State schemas
export const StatePlaySchema = z.object({
  type: z.literal('State.Play'),
  data: z.object({
    from: z.string(),
    to: z.string(),
    player: PlayerColorSchema,
    fen: z.string(),
    uciFen: z.string(),
    blackTime: z.number(),
    whiteTime: z.number(),
  }),
});

export const StateErrorSchema = z.object({
  type: z.literal('State.Error'),
  data: z.object({
    message: z.string(),
  }),
});

export const GameEndResult = z.object({
  result: GameResultSchema,
  detail: GameResultDetailSchema,
});

export const GameEndData = z.object({
  result: GameEndResult,
  whiteEloChange: z.number(),
  blackEloChange: z.number(),
});

export const StateGameEndSchema = z.object({
  type: z.literal('State.GameEnd'),
  data: GameEndData,
});

export const StateDrawOfferSchema = z.object({
  type: z.literal('State.DrawOffer'),
  data: z.object({
    whiteOfferingDraw: z.boolean(),
    blackOfferingDraw: z.boolean(),
  }),
});

export const StateDrawOfferDeclinedSchema = z.object({
  type: z.literal('State.DrawOfferDeclined'),
  data: z.object({}),
});

export const ChessStateSchema = z.discriminatedUnion('type', [
  StatePlaySchema,
  StateErrorSchema,
  StateGameEndSchema,
  StateDrawOfferSchema,
  StateDrawOfferDeclinedSchema,
]);

// State classes
export class StatePlay implements z.infer<typeof StatePlaySchema> {
  type = 'State.Play' as const;

  constructor(public data: z.infer<typeof StatePlaySchema>['data']) {}

  static fromJSON(json: unknown): StatePlay {
    const parsed = StatePlaySchema.parse(json);
    return new StatePlay(parsed.data);
  }
}

export class StateError implements z.infer<typeof StateErrorSchema> {
  type = 'State.Error' as const;

  constructor(public data: z.infer<typeof StateErrorSchema>['data']) {}

  static fromJSON(json: unknown): StateError {
    const parsed = StateErrorSchema.parse(json);
    return new StateError(parsed.data);
  }
}

export class StateGameEnd implements z.infer<typeof StateGameEndSchema> {
  type = 'State.GameEnd' as const;

  constructor(public data: z.infer<typeof StateGameEndSchema>['data']) {}

  static fromJSON(json: unknown): StateGameEnd {
    const parsed = StateGameEndSchema.parse(json);
    return new StateGameEnd(parsed.data);
  }
}

export class StateDrawOffer implements z.infer<typeof StateDrawOfferSchema> {
  type = 'State.DrawOffer' as const;

  constructor(public data: z.infer<typeof StateDrawOfferSchema>['data']) {}

  static fromJSON(json: unknown): StateDrawOffer {
    const parsed = StateDrawOfferSchema.parse(json);
    return new StateDrawOffer(parsed.data);
  }
}

export class StateDrawOfferDeclined
  implements z.infer<typeof StateDrawOfferDeclinedSchema>
{
  type = 'State.DrawOfferDeclined' as const;

  constructor(
    public data: z.infer<typeof StateDrawOfferDeclinedSchema>['data'],
  ) {}

  static fromJSON(json: unknown): StateDrawOfferDeclined {
    const parsed = StateDrawOfferDeclinedSchema.parse(json);
    return new StateDrawOfferDeclined(parsed.data);
  }
}

export type ChessState =
  | StatePlay
  | StateError
  | StateGameEnd
  | StateDrawOffer
  | StateDrawOfferDeclined;

// Deserialization
export function deserializeState(json: unknown): ChessState {
  const parsed = ChessStateSchema.parse(json);

  switch (parsed.type) {
    case 'State.Play':
      return new StatePlay(parsed.data);
    case 'State.Error':
      return new StateError(parsed.data);
    case 'State.GameEnd':
      return new StateGameEnd(parsed.data);
    case 'State.DrawOffer':
      return new StateDrawOffer(parsed.data);
    case 'State.DrawOfferDeclined':
      return new StateDrawOfferDeclined(parsed.data);
    default:
      throw new Error(`Unknown state type: ${(parsed as any).type}`);
  }
}
