import { CustomPieces } from "react-xiangqiboard/dist/chessboard/types";
import { IconAdvisorBlack, IconAdvisorRed, IconBishopBlack, IconBishopRed, IconCannonBlack, IconCannonRed, IconKingBlack, IconKingRed, IconKnightBlack, IconKnightRed, IconPawnBlack, IconPawnRed, IconRookBlack, IconRookRed } from "./pieces-styles/chinese-pieces.tsx";
import { BlackAdvisorPiece, BlackBishopPiece, BlackCannonPiece, BlackKingPiece, BlackKnightPiece, BlackPawnPiece, BlackRookPiece, RedAdvisorPiece, RedBishopPiece, RedCannonPiece, RedKingPiece, RedKnightPiece, RedPawnPiece, RedRookPiece } from "./pieces-styles/clubxiangqi-pieces.tsx";
import { BlackAdvisorPieceOk, BlackBishopPieceOk, BlackCannonPieceOk, BlackKingPieceOk, BlackKnightPieceOk, BlackPawnPieceOk, BlackRookPieceOk, RedAdvisorPieceOk, RedBishopPieceOk, RedCannonPieceOk, RedKingPieceOk, RedKnightPieceOk, RedPawnPieceOk, RedRookPieceOk } from "./pieces-styles/playok-pieces.tsx";


// theme 1 chinese chess
export const PiecesChineseChess: CustomPieces = {
  wP: IconPawnRed,
  wC: IconCannonRed,
  wB: IconBishopRed,
  wN: IconKnightRed,
  wR: IconRookRed,
  wA: IconAdvisorRed,
  wK: IconKingRed,

  bP: IconPawnBlack,
  bC: IconCannonBlack,
  bB: IconBishopBlack,
  bN: IconKnightBlack,
  bR: IconRookBlack,
  bA: IconAdvisorBlack,
  bK: IconKingBlack,
};

// theme 2 club xiangqi
export const PiecesClubXiangqi: CustomPieces = {
  wP: RedPawnPiece,
  wC: RedCannonPiece,
  wB: RedBishopPiece,
  wN: RedKnightPiece,
  wR: RedRookPiece,
  wA: RedAdvisorPiece,
  wK: RedKingPiece,

  bP: BlackPawnPiece,
  bC: BlackCannonPiece,
  bB: BlackBishopPiece,
  bN: BlackKnightPiece,
  bR: BlackRookPiece,
  bA: BlackAdvisorPiece,
  bK: BlackKingPiece,
};

// theme 3 playok xiangqi
export const PicesPlayOkXiangqi: CustomPieces = {
  wP: RedPawnPieceOk,
  wC: RedCannonPieceOk,
  wB: RedBishopPieceOk,
  wN: RedKnightPieceOk,
  wR: RedRookPieceOk,
  wA: RedAdvisorPieceOk,
  wK: RedKingPieceOk,

  bP: BlackPawnPieceOk,
  bC: BlackCannonPieceOk,
  bB: BlackBishopPieceOk,
  bN: BlackKnightPieceOk,
  bR: BlackRookPieceOk,
  bA: BlackAdvisorPieceOk,
  bK: BlackKingPieceOk,
};

//theme 4 zigavn
export const PiecesZigavn: CustomPieces = {
  wP: RedPawnPieceOk,
  wC: RedCannonPieceOk,
  wB: RedBishopPieceOk,
  wN: RedKnightPieceOk,
  wR: RedRookPieceOk,
  wA: RedAdvisorPieceOk,
  wK: RedKingPieceOk,

  bP: BlackPawnPieceOk,
  bC: BlackCannonPieceOk,
  bB: BlackBishopPieceOk,
  bN: BlackKnightPieceOk,
  bR: BlackRookPieceOk,
  bA: BlackAdvisorPieceOk,
  bK: BlackKingPieceOk,
};