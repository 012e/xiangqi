import {
  captureOwnPieceValidator,
  correctTurnValidator,
  duplicateMoveValidator,
  fromPieceValidator,
  inBoundValiator,
} from './generalValidators';
import {
  validAdvisorMoveValidator,
  validBishopMoveValidator,
  validCannonMoveValidator,
  validKingMoveValidator,
  validKnightMoveValidator,
  validPawnMoveValidator,
  validRookMoveValidator,
} from './pieceValidators';

export type Result = {
  ok: boolean;
  message?: string;
};

export const OK_RESULT: Result = { ok: true };

type Validator = {
  (from: [number, number], to: [number, number], context: BoardContext): Result;
};

export type BoardContext = {
  board: string[][];
  currentPlayer: 'w' | 'b';
};

/**
 * Creates a deep clone of a string matrix (string[][])
 * @param matrix - The string matrix to clone
 * @returns A new deep-cloned string matrix
 */
function cloneStringMatrix(matrix: string[][]): string[][] {
  return matrix.map((row) => [...row]);
}

export function crossedRiver(
  [row, _col]: [number, number],
  isWhite = true,
): boolean {
  if (isWhite) {
    return row <= 4;
  }
  return row >= 5;
}
export function sameColor(piece: string, destinationPiece: string): boolean {
  return (
    piece === piece.toUpperCase() &&
    destinationPiece === destinationPiece.toUpperCase()
  );
}

export default class Xiangqi {
  private board: string[][] = [];
  private currentPlayer: 'w' | 'b' = 'w'; // 'w' for red, 'b' for black
  private moveCount = 0;
  private kings = { b: [0, 4], w: [9, 4] }; // Initial positions of kings

  /**
   * Initialize a Xiangqi game from FEN notation
   * @param fen - Forsyth-Edwards Notation string for Xiangqi
   */
  constructor(
    fen = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0',
  ) {
    this.parseFen(fen);
  }

  boardAsStr(): string {
    let s = '';
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 9; j++) {
        s += this.board[i][j] || '.';
      }
      s += '\n';
    }
    // remove last newline
    return s.trim();
  }

  /**
   * Parse FEN string and setup the board
   * @param fen - Forsyth-Edwards Notation string
   */
  private parseFen(fen: string): void {
    const parts = fen.trim().split(' ');
    const boardPart = parts[0];
    this.currentPlayer = parts[1] as 'w' | 'b';
    this.moveCount = parseInt(parts[2] || '0', 10);

    // Initialize empty board (10x9)
    this.board = Array(10)
      .fill(null)
      .map(() => Array(9).fill(''));

    // Parse board layout
    const rows = boardPart.split('/');
    for (let i = 0; i < 10; i++) {
      let col = 0;
      for (let j = 0; j < rows[i].length; j++) {
        const char = rows[i][j];
        if (/\d/.test(char)) {
          // If it's a number, skip that many columns
          col += parseInt(char, 10);
        } else {
          // Place the piece
          this.board[i][col] = char;
          col++;
        }
      }
    }
  }

  /**
   * Export the current board state to FEN notation
   * @returns FEN string
   */
  exportFen(): string {
    const rows: string[] = [];

    // Process board state
    for (let i = 0; i < 10; i++) {
      let row = '';
      let emptyCount = 0;

      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] === '') {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            row += emptyCount.toString();
            emptyCount = 0;
          }
          row += this.board[i][j];
        }
      }

      if (emptyCount > 0) {
        row += emptyCount.toString();
      }

      rows.push(row);
    }

    return `${rows.join('/')} ${this.currentPlayer} ${this.moveCount}`;
  }

  /**
   * Convert chess notation (e.g. 'e4') to board coordinates [row, col]
   * @param position - Chess notation position
   * @returns Board coordinates [row, col]
   */
  private positionToCoordinates(position: string): [number, number] {
    if (position.length < 2) {
      throw new Error(`Invalid position: ${position}`);
    }

    const col = position.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = 9 - (parseInt(position.substring(1), 10) - 1);

    if (col < 0 || col > 8 || row < 0 || row > 9) {
      throw new Error(`Position out of bounds: ${position}`);
    }

    return [row, col];
  }

  /**
   * Convert board coordinates [row, col] to chess notation (e.g. 'e4')
   * @param coordinates - Board coordinates [row, col]
   * @returns Chess notation position
   */
  private coordinatesToPosition(coordinates: [number, number]): string {
    const [row, col] = coordinates;

    if (col < 0 || col > 8 || row < 0 || row > 9) {
      throw new Error(`Coordinates out of bounds: [${row}, ${col}]`);
    }

    const file = String.fromCharCode('a'.charCodeAt(0) + col);
    const rank = 10 - row;

    return `${file}${rank}`;
  }

  private invalidMove(from: [number, number], to: [number, number]) {
    return {
      ok: false,
      message: `Invalid pawn move ${this.coordinatesToPosition(
        from,
      )} -> ${this.coordinatesToPosition(to)}`,
    };
  }

  /**
   * Check if a move is legal
   * This is a simplified implementation and doesn't check all Xiangqi rules
   * @param fromCoords - Starting coordinates [row, col]
   * @param toCoords - Target coordinates [row, col]
   * @returns Boolean indicating if move is legal
   */
  isLegalMove(
    fromCoords: [number, number],
    toCoords: [number, number],
  ): Result {
    const validators: Validator[] = [
      inBoundValiator,
      duplicateMoveValidator,
      fromPieceValidator,
      correctTurnValidator,
      captureOwnPieceValidator,
      // this.moveInCheckValidator, // pinned piece, king move in check, kings face to face
    ];
    const [fromRow, fromCol] = fromCoords;
    const piece = this.board[fromRow][fromCol];

    switch (piece.toLowerCase()) {
      case 'p':
        validators.push(validPawnMoveValidator);
        break;
      case 'c':
        validators.push(validCannonMoveValidator);
        break;
      case 'n':
        validators.push(validKnightMoveValidator);
        break;
      case 'b':
        validators.push(validBishopMoveValidator);
        break;
      case 'a':
        validators.push(validAdvisorMoveValidator);
        break;
      case 'k':
        validators.push(validKingMoveValidator);
        break;
      case 'r':
        validators.push(validRookMoveValidator);
        break;

      default:
        throw new Error(`Piece ${piece} not implemented`);
    }

    for (const validator of validators) {
      const clonedBoard = cloneStringMatrix(this.board);
      const fromCoordsCloned: [number, number] = [...fromCoords];
      const toCoordsCloned: [number, number] = [...toCoords];
      const result = validator(fromCoordsCloned, toCoordsCloned, {
        board: clonedBoard,
        currentPlayer: this.currentPlayer,
      });
      if (!result.ok) {
        return this.invalidMove(fromCoords, toCoords);
      }
    }

    return OK_RESULT;
  }

  /**
   * Make a move on the board
   * @param move - Object containing from and to positions
   * @returns Boolean indicating if the move was successful
   */
  move({ from, to }: { from: string; to: string }): boolean {
    const fromCoords = this.positionToCoordinates(from);
    const toCoords = this.positionToCoordinates(to);

    const checkResult = this.isLegalMove(fromCoords, toCoords);
    if (!checkResult.ok) {
      throw new Error(`Invalid move: ${from} -> ${to}`);
    }

    // Make the move
    const [fromRow, fromCol] = fromCoords;
    const [toRow, toCol] = toCoords;

    this.board[toRow][toCol] = this.board[fromRow][fromCol];
    this.board[fromRow][fromCol] = '';

    // Update player and move count
    if (this.board[fromRow][fromCol] === 'k') {
      this.kings.b = [toRow, toCol];
    } else if (this.board[fromRow][fromCol] === 'K') {
      this.kings.w = [toRow, toCol];
    }
    this.currentPlayer = this.currentPlayer === 'w' ? 'b' : 'w';
    this.moveCount++;
    return true;
  }

  /**
   * Get the current game state
   * @returns Object containing current player and board state
   */
  getState(): {
    currentPlayer: 'w' | 'b';
    board: string[][];
    moveCount: number;
  } {
    return {
      currentPlayer: this.currentPlayer,
      board: this.board.map((row) => [...row]), // Return a copy of the board
      moveCount: this.moveCount,
    };
  }

  // king in check when move
  moveInCheckValidator(
    [fromRow, fromCol]: [number, number],
    [toRow, toCol]: [number, number],
  ): Result {
    const previousBoard = cloneStringMatrix(this.board);

    // this.move({
    //   from: this.coordinatesToPosition([fromRow, fromCol]),
    //   to: this.coordinatesToPosition([toRow, toCol]),
    // });

    if (this.isInCheck(this.currentPlayer)) {
      this.board = previousBoard; // Revert the move
      return { ok: false, message: 'Move leaves the king in check.' };
    }
    return OK_RESULT;
  }

  isCheckmate(color: 'w' | 'b' = 'w'): boolean {
    return this.isInCheck(color) && this.generateMove(color) === 0;
  }

  isGameOver(): boolean {
    return (
      this.moveCount >= 120 ||
      this.isCheckmate() ||
      this.isStalemate() ||
      this.isDraw()
    );
  }

  isInCheck(color: 'w' | 'b' = 'w'): boolean {
    const kingPosition = this.findKing(color);
    if (!kingPosition) {
      return false; // King not found, cannot be in check
    }

    const [kingRow, kingCol] = kingPosition;
    const opponentColor = color === 'w' ? 'b' : 'w';

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 9; col++) {
        const piece = this.board[row][col];
        if (
          piece &&
          piece.toLowerCase() !== piece &&
          piece.toLowerCase() !== 'k'
        ) {
          const fromCoords: [number, number] = [row, col];
          const toCoords: [number, number] = [kingRow, kingCol];
          const result = this.isLegalMove(fromCoords, toCoords);
          if (!result.ok) {
            return true; // King is in check
          }
        }
      }
    }

    return false; // King is not in check
  }

  // in draw
  isDraw(): boolean {
    return this.isStalemate() || this.isInsufficientMaterial();
  }

  isInsufficientMaterial(): boolean {
    const pieces = this.board.flat().filter((piece) => piece !== '');
    const pieceCount = pieces.reduce(
      (count, piece) => {
        if (piece.toLowerCase() === 'p') {
          count.pawn += 1;
        } else if (piece.toLowerCase() === 'n') {
          count.knight += 1;
        } else if (piece.toLowerCase() === 'c') {
          count.cannon += 1;
        } else if (piece.toLowerCase() === 'r') {
          count.rook += 1;
        } else if (piece.toLowerCase() === 'k') {
          count.king += 1;
        }

        return count;
      },
      { pawn: 0, knight: 0, king: 0, rook: 0, cannon: 0 },
    );
    if (pieces.length === 2) return true;
    else if (
      pieceCount.knight === 0 &&
      pieceCount.rook === 0 &&
      pieceCount.cannon === 0 &&
      pieceCount.pawn === 0
    )
      return true;
    return false;
  }

  isStalemate(color: 'w' | 'b' = 'w'): boolean {
    return !this.isInCheck(color) && this.generateMove(color) === 0;
  }

  generateMove(color: 'w' | 'b' = 'w'): number {
    throw new Error('Not implemented');
  }

  getWinner(): 'w' | 'b' | null {
    if (this.isCheckmate('w')) return 'b'; // Black wins
    if (this.isCheckmate('b')) return 'w'; // White/Red wins
    return null; // No winner yet / draw
  }

  /**
   * Rotates a 10x9 string matrix by 180 degrees
   * @param matrix - A 10x9 2D array of strings
   * @returns Rotated 10x9 matrix
   */
  private rotateMatrix180(matrix: string[][]): string[][] {
    if (matrix.length !== 10 || matrix.some((row) => row.length !== 9)) {
      throw new Error('Matrix must be of size 10x9');
    }

    return matrix.map((row) => [...row].reverse()).reverse();
  }

  /**
   * Converts a coordinate [row, col] after a 180-degree rotation on a 10x9 board
   * @param coord - The coordinate [row, col] before rotation
   * @returns The new coordinate [row, col] after rotation
   */
  private rotateCoordinate180(coord: [number, number]): [number, number] {
    const [row, col] = coord;

    if (row < 0 || row >= 10 || col < 0 || col >= 9) {
      throw new Error(`Coordinate out of bounds: [${row}, ${col}]`);
    }

    const newRow = 9 - row;
    const newCol = 8 - col;

    return [newRow, newCol];
  }
}
