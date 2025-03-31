import { BoardContext, Result, OK_RESULT, crossedRiver } from ".";

export function validPawnMoveValidator( // tốt
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board }: BoardContext
): Result {
  const piece = board[fromRow][fromCol];
  if (!piece) {
    return { ok: false, message: "No piece at the starting position." };
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
  return { ok: false, message: "Invalid pawn move." };
}

export function validKingMoveValidator( // tướng
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board }: BoardContext
): Result {
  const piece = board[fromRow][fromCol];
  if (!piece) {
    return { ok: false, message: "No piece at the starting position." };
  }
  const isPieceRed = piece === piece.toUpperCase();
  const direction = isPieceRed ? -1 : 1; // Red moves up, Black moves down
  // King can only move one point orthogonally and may not leave the 3x3 palace
  if (
    toRow >= (isPieceRed ? 7 : 0) &&
    toRow <= (isPieceRed ? 9 : 2) && // limited in palace
    toCol >= 3 &&
    toCol <= 5 && // limited in col 3-5
    Math.abs(toRow - fromRow) + Math.abs(toCol - fromCol) === 1 // move one point orthogonally
  ) {
    return OK_RESULT;
  }
  return { ok: false, message: "Invalid king move." };
}

export function validAdvisorMoveValidator( // sĩ
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board }: BoardContext
): Result {
  const piece = board[fromRow][fromCol];
  if (!piece) {
    return { ok: false, message: "No piece at the starting position." };
  }
  const isPieceRed = piece === piece.toUpperCase();
  const direction = isPieceRed ? -1 : 1; // Red moves up, Black moves down
  // Advisor can move one point diagonally and may not leave the 3x3 palace
  if (
    toRow >= (isPieceRed ? 7 : 0) &&
    toRow <= (isPieceRed ? 9 : 2) && // limited in palace
    toCol >= 3 &&
    toCol <= 5 && // limited in col 3-5
    Math.abs(toRow - fromRow) === 1 &&
    Math.abs(toCol - fromCol) === 1 // move one point diagonally
  ) {
    return OK_RESULT;
  }
  return { ok: false, message: "Invalid advisor move." };
}

export function validBishopMoveValidator( // tượng
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board }: BoardContext
): Result {
  const piece = board[fromRow][fromCol];
  if (!piece) {
    return { ok: false, message: "No piece at the starting position." };
  }
  const isPieceRed = piece === piece.toUpperCase();
  const direction = isPieceRed ? -1 : 1; // Red moves up, Black moves down
  // Bishop can move exactly two points diagonally, may not jump over intervening pieces, and cannot cross the river
  if (
    Math.abs(toRow - fromRow) === 2 &&
    Math.abs(toCol - fromCol) === 2 && // Move two points diagonally
    toRow >= (isPieceRed ? 5 : 0) &&
    toRow <= (isPieceRed ? 9 : 4) // cannot cross the river
  ) {
    const midRow = (fromRow + toRow) / 2;
    const midCol = (fromCol + toCol) / 2;
    if (!board[midRow][midCol]) {
      // Check intervening pieces
      return OK_RESULT;
    }
  }
  return { ok: false, message: "Invalid bishop move." };
}

export function validCannonMoveValidator(
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board }: BoardContext
): Result {
  const piece = board[fromRow][fromCol];
  if (!piece) {
    return { ok: false, message: "No piece at the starting position." };
  }
  const isPieceRed = piece === piece.toUpperCase();
  const direction = isPieceRed ? -1 : 1; // Red moves up, Black moves down
  // Cannon can move like a Rook (straight lines)
  if (fromRow === toRow || fromCol === toCol) {
    const minRow = Math.min(fromRow, toRow);
    const maxRow = Math.max(fromRow, toRow);
    const minCol = Math.min(fromCol, toCol);
    const maxCol = Math.max(fromCol, toCol);

    let obstacleCount = 0;

    // Count the number of obstacles on the way
    for (let r = minRow + 1; r < maxRow; r++) {
      if (board[r][fromCol]) obstacleCount++;
    }
    for (let c = minCol + 1; c < maxCol; c++) {
      if (board[fromRow][c]) obstacleCount++;
    }

    if (!board[toRow][toCol]) {
      // If only move, like Rook, no obstacles required
      if (obstacleCount === 0) return OK_RESULT;
    } else {
      // If attack, need exactly 1 obstacle
      if (obstacleCount === 1) return OK_RESULT;
    }
  }

  return { ok: false, message: "Invalid cannon move." };
}

export function validKnightMoveValidator(
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board }: BoardContext
): Result {
  throw new Error("Function not implemented.");
}

export function validRookMoveValidator(
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board }: BoardContext
): Result {
  throw new Error("Function not implemented.");
}
