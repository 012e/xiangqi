import { BoardContext, Result, OK_RESULT, crossedRiver, sameColor } from '.';

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

export function validKingMoveValidator( // tướng
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board }: BoardContext,
): Result {
  const piece = board[fromRow][fromCol];
  if (!piece) {
    return { ok: false, message: 'No piece at the starting position.' };
  }
  const isPieceRed = piece === piece.toUpperCase();
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
  return { ok: false, message: 'Invalid king move.' };
}

export function validAdvisorMoveValidator( // sĩ
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board }: BoardContext,
): Result {
  const piece = board[fromRow][fromCol];
  if (!piece) {
    return { ok: false, message: 'No piece at the starting position.' };
  }
  const isPieceRed = piece === piece.toUpperCase();
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
  return { ok: false, message: 'Invalid advisor move.' };
}

export function validBishopMoveValidator( // tượng
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board }: BoardContext,
): Result {
  const piece = board[fromRow][fromCol];
  if (!piece) {
    return { ok: false, message: 'No piece at the starting position.' };
  }
  const isPieceRed = piece === piece.toUpperCase();
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
  return { ok: false, message: 'Invalid bishop move.' };
}

export function validCannonMoveValidator(
  [fromRow, fromCol]: [number, number],
  [toRow, toCol]: [number, number],
  { board }: BoardContext,
): Result {
  const piece = board[fromRow][fromCol];
  if (!piece) {
    return { ok: false, message: 'No piece at the starting position.' };
  }
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

  return { ok: false, message: 'Invalid cannon move.' };
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
