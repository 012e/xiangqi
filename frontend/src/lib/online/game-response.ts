export type Player = {
  id: number,
  sub: string,
  email: string,
  name: string,
  username: string,
  picture: string
};

export type GameResponse = {
  id: string,
  uciFen: string,
  whitePlayer: Player,
  blackPlayer: Player,
  whiteElo: 0.1,
  blackElo: 0.1,
  whiteEloChange: 0.1,
  blackEloChange: 0.1,
  startTime: string,
  endTime: string,
  blackTimeLeft: number,
  whiteTimeLeft: number,
  whiteOfferingDraw: boolean,
  blackOfferingDraw: boolean,
  result: string,
  resultDetail: string
  createdAt: string,
  isGameWithBot: boolean,
  isStarted: boolean,
  gameTypeId: number,
};
