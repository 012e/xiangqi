import { CustomPieces } from "react-xiangqiboard/dist/chessboard/types";
import { IconAdvisorBlack, IconAdvisorRed, IconBishopBlack, IconBishopRed, IconCannonBlack, IconCannonRed, IconKingBlack, IconKingRed, IconKnightBlack, IconKnightRed, IconPawnBlack, IconPawnRed, IconRookBlack, IconRookRed } from "./componentPieces";

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
