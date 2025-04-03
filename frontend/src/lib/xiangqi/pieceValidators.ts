import { BoardContext, Result, OK_RESULT, crossedRiver, sameColor } from '.';

export function validPawnMoveValidator(
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board }: BoardContext,
): Result {
  const piece = board[fromRow][fromCol];
  if (!piece) {
    return { ok: false, message: 'No piece at the starting position.' };
  }
  const isPieceRed = piece === piece.toUpperCase();
  const direction = isPieceRed ? -1 : 1; // Red moves up, Black moves down
  // Pawn can move forward one step
  if (toRow === fromRow + direction && toCol === fromCol) {
    return OK_RESULT;
  }
  // Pawn can move diagonally one step after crossing the river
  if (crossedRiver([fromRow, fromCol], isPieceRed)) {
    if (
      (toRow === fromRow && toCol === fromCol - 1) ||
      (toRow === fromRow && toCol === fromCol + 1)
    ) {
      return OK_RESULT;
    }
  }
  return { ok: false, message: 'Invalid pawn move.' };
}

export function validRookMoveValidator(
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board }: BoardContext,
): Result {
  if (fromRow !== toRow && fromCol !== toCol) {
    return { ok: false, message: 'Rooks move only in straight lines.' };
  }

  const piece = board[fromRow][fromCol];
  if (!piece)
    return { ok: false, message: 'No piece at the starting position' };

  const rowDirection = fromRow === toRow ? 0 : toRow > fromRow ? 1 : -1;
  const colDirection = fromCol === toCol ? 0 : toCol > fromCol ? 1 : -1;

  let currentRow = fromRow + rowDirection;
  let currentCol = fromCol + colDirection;

  while (currentRow !== toRow || currentCol !== toCol) {
    if (board[currentRow][currentCol]) {
      return {
        ok: false,
        message: 'Invalid rook move: Path is blocked.',
      };
    }
    currentRow += rowDirection;
    currentCol += colDirection;
  }
  const destinationPiece = board[toRow][toCol];

  if (destinationPiece && sameColor(piece, destinationPiece)) {
    return {
      ok: false,
      message: 'Invalid rook move: Cannot capture own piece.',
    };
  }

  return { ok: true };
}
export function validKingMoveValidator(
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board: _ }: BoardContext,
): Result {
  throw new Error('Function not implemented.');
}
export function validKnightMoveValidator(
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board }: BoardContext,
): Result {
  const piece = board[fromRow][fromCol];
  if (!piece) {
    return { ok: false, message: 'No piece at the starting position' };
  }

  // Define all valid knight moves as relative positions
  const knightMoves = [
    [-2, -1, -1, 0], // Up-left
    [-2, 1, -1, 0], // Up-right
    [2, -1, 1, 0], // Down-left
    [2, 1, 1, 0], // Down-right
    [-1, -2, 0, -1], // Left-up
    [1, -2, 0, -1], // Left-down
    [-1, 2, 0, 1], // Right-up
    [1, 2, 0, 1], // Right-down
  ];

  // Check if the target position is within one of the knight's valid moves
  for (const [dx, dy, dxb, dyb] of knightMoves) {
    if (
      fromRow + dx === toRow &&
      fromCol + dy === toCol &&
      !board[fromRow + dxb][fromCol + dyb]
    ) {
      console.log(
        `dx: ${dx}, dy: ${dy}, dxb: ${dxb}, dyb: ${dyb} \n from: ${fromRow},${fromCol} to: ${toRow}, ${toCol}`,
      );
      return OK_RESULT;
    }
  }

  return { ok: false, message: 'Invalid knight move.' };
}
export function validBishopMoveValidator(
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board: _ }: BoardContext,
): Result {
  throw new Error('Function not implemented.');
}
export function validAvisorMoveValidator(
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board: _ }: BoardContext,
): Result {
  throw new Error('Function not implemented.');
}
export function validCannonMoveValidator(
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board: _ }: BoardContext,
): Result {
  throw new Error('Function not implemented.');
}
