import { CustomPieces } from "react-xiangqiboard/dist/chessboard/types";
import { IconAdvisorBlack, IconAdvisorRed, IconBishopBlack, IconBishopRed, IconCannonBlack, IconCannonRed, IconKingBlack, IconKingRed, IconKnightBlack, IconKnightRed, IconPawnBlack, IconPawnRed, IconRookBlack, IconRookRed } from "./pieces-styles/chinese-pieces.tsx";
import { BlackAdvisorPiece, BlackBishopPiece, BlackCannonPiece, BlackKingPiece, BlackKnightPiece, BlackPawnPiece, BlackRookPiece, RedAdvisorPiece, RedBishopPiece, RedCannonPiece, RedKingPiece, RedKnightPiece, RedPawnPiece, RedRookPiece } from "./pieces-styles/clubxiangqi-pieces.tsx";
import { BlackAdvisorPieceOk, BlackBishopPieceOk, BlackCannonPieceOk, BlackKingPieceOk, BlackKnightPieceOk, BlackPawnPieceOk, BlackRookPieceOk, RedAdvisorPieceOk, RedBishopPieceOk, RedCannonPieceOk, RedKingPieceOk, RedKnightPieceOk, RedPawnPieceOk, RedRookPieceOk } from "./pieces-styles/playok-pieces.tsx";
import {
  BlackAdvisorPiecexahlee,
  BlackBishopPiecexahlee,
  BlackCannonPiecexahlee,
  BlackKingPiecexahlee,
  BlackKnightPiecexahlee,
  BlackPawnPiecexahlee,
  BlackRookPiecexahlee,
  RedAdvisorPiecexahlee,
  RedBishopPiecexahlee,
  RedCannonPiecexahlee,
  RedKingPiecexahlee,
  RedKnightPiecexahlee,
  RedPawnPiecexahlee,
  RedRookPiecexahlee,
} from './pieces-styles/xahlee-pieces.tsx';
import {
  BlackAdvisorPieceXboard,
  BlackBishopPieceXboard, BlackCannonPieceXboard, BlackKingPieceXboard, BlackKnightPieceXboard,
  BlackPawnPieceXboard,
  BlackRookPieceXboard,
  RedAdvisorPieceXboard,
  RedBishopPieceXboard,
  RedCannonPieceXboard,
  RedKingPieceXboard,
  RedKnightPieceXboard,
  RedPawnPieceXboard,
  RedRookPieceXboard,
} from '@/components/chessboard-styles/pieces-styles/xboard-pieces.tsx';

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

//theme 4 xahlee
export const PiecesXahlee: CustomPieces = {
  wP: RedPawnPiecexahlee,
  wC: RedCannonPiecexahlee,
  wB: RedBishopPiecexahlee,
  wN: RedKnightPiecexahlee,
  wR: RedRookPiecexahlee,
  wA: RedAdvisorPiecexahlee,
  wK: RedKingPiecexahlee,

  bP: BlackPawnPiecexahlee,
  bC: BlackCannonPiecexahlee,
  bB: BlackBishopPiecexahlee,
  bN: BlackKnightPiecexahlee,
  bR: BlackRookPiecexahlee,
  bA: BlackAdvisorPiecexahlee,
  bK: BlackKingPiecexahlee,
};

// theme 5 xboard
export const PiecesXboard: CustomPieces = {
  wP: RedPawnPieceXboard,
  wC: RedCannonPieceXboard,
  wB: RedBishopPieceXboard,
  wN: RedKnightPieceXboard,
  wR: RedRookPieceXboard,
  wA: RedAdvisorPieceXboard,
  wK: RedKingPieceXboard,

  bP: BlackPawnPieceXboard,
  bC: BlackCannonPieceXboard,
  bB: BlackBishopPieceXboard,
  bN: BlackKnightPieceXboard,
  bR: BlackRookPieceXboard,
  bA: BlackAdvisorPieceXboard,
  bK: BlackKingPieceXboard,
};