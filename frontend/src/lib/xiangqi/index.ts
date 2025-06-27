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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  private moveHistory: string[] = []; // Store move history in UCI format
  static readonly DEFAULT_FEN =
    'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0';

  /**
   * Initialize a Xiangqi game from FEN notation
   * @param fen - Forsyth-Edwards Notation string for Xiangqi
   */
  constructor(
    fen = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0',
  ) {
    if (fen.includes('|')) {
      this.parseUciFen(fen);
    } else {
      this.parseFen(fen);
    }
    this.kings.b = this.findKing('b', this.board);
    this.kings.w = this.findKing('w', this.board);
  }
  /**
   * Create Xiangqi instance from UCI-style FEN
   * @param uciFen - UCI-style FEN string
   * @returns New Xiangqi instance
   */
  static fromUciFen(uciFen: string): Xiangqi {
    const instance = new Xiangqi();
    instance.parseUciFen(uciFen);
    instance.kings.b = instance.findKing('b', instance.board);
    instance.kings.w = instance.findKing('w', instance.board);
    return instance;
  }

  /**
   * Parse UCI-style FEN string to initialize board state, current player, move count, and move history
   * Format: board_string current_player move_count | move_history
   * Example: "rnbakabnr/9/.../RNBAKABNR w 0 | e2e3 e3e4"
   * @param uciFen - UCI-style FEN string
   */
  private parseUciFen(uciFen: string): void {
    const fenAndMoves = uciFen.trim().split('|');
    const parts = fenAndMoves[0].trim().split(' ');

    const boardPart = parts[0];
    this.currentPlayer = parts.length > 1 && parts[1] === 'b' ? 'b' : 'w';
    this.moveCount = parts.length > 2 ? parseInt(parts[2], 10) : 0;

    // Initialize empty board (10x9)
    this.board = Array(10)
      .fill(null)
      .map(() => Array(9).fill(''));

    // Parse board layout
    const rows = boardPart.split('/');
    for (let i = 0; i < 10; i++) {
      let col = 0;
      for (const char of rows[i]) {
        if (/\d/.test(char)) {
          col += parseInt(char, 10);
        } else {
          this.board[i][col] = char;
          col++;
        }
      }
    }

    // Parse move history if present
    this.moveHistory = [];
    if (fenAndMoves.length > 1) {
      const moves = fenAndMoves[1].trim().split(' ');
      for (const moveStr of moves) {
        if (moveStr && moveStr.trim()) {
          this.moveHistory.push(moveStr.trim());
        }
      }
    }
  }

  findKing(Color: 'w' | 'b' = 'w', board: string[][]): number[] {
    const king = Color === 'w' ? 'K' : 'k';
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === king) {
          return [row, col];
        }
      }
    }
    throw new Error(`King not found for color ${Color}`);
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
  public parseFen(fen: string): void {
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
  public positionToCoordinates(position: string): [number, number] {
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

  isLegalMove({ from, to }: { from: string; to: string }): Result {
    const fromCoords = this.positionToCoordinates(from);
    const toCoords = this.positionToCoordinates(to);

    return this._isLegalMove(fromCoords, toCoords);
  }

  /**
   * Check if a move is legal
   * This is a simplified implementation and doesn't check all Xiangqi rules
   * @param fromCoords - Starting coordinates [row, col]
   * @param toCoords - Target coordinates [row, col]
   * @returns Boolean indicating if move is legal
   */
  private _isLegalMove(
    fromCoords: [number, number],
    toCoords: [number, number],
  ): Result {
    const validators: Validator[] = [
      inBoundValiator,
      duplicateMoveValidator,
      fromPieceValidator,
      correctTurnValidator,
      captureOwnPieceValidator,
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
      if (!result.ok || !this.moveInCheckValidator(fromCoords, toCoords).ok) {
        return this.invalidMove(fromCoords, toCoords);
      }
    }
    return OK_RESULT;
  }

  /**
   * Check if a move is legal without checking turn
   * @param fromCoords - Starting coordinates [row, col]
   * @param toCoords - Target coordinates [row, col]
   * @returns Result indicating if move is legal
   */
  private _isLegalMoveSkipTurn(
    fromCoords: [number, number],
    toCoords: [number, number],
  ): Result {
    const validators: Validator[] = [
      inBoundValiator,
      duplicateMoveValidator,
      fromPieceValidator,
      // Skip correctTurnValidator
      captureOwnPieceValidator,
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
        return { ok: false, message: `Unknown piece: ${piece}` };
    }

    for (const validator of validators) {
      const result = validator(fromCoords, toCoords, {
        board: this.board,
        currentPlayer: this.currentPlayer,
      });
      if (!result.ok) {
        return result;
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

    const checkResult = this._isLegalMove(fromCoords, toCoords);
    if (!checkResult.ok) {
      throw new Error(`Invalid move: ${from} -> ${to}`);
    }

    // Make the move
    const [fromRow, fromCol] = fromCoords;
    const [toRow, toCol] = toCoords;

    if (this.board[fromRow][fromCol] === 'k') {
      this.kings.b = toCoords;
    } else if (this.board[fromRow][fromCol] === 'K') {
      this.kings.w = toCoords;
    }

    this.board[toRow][toCol] = this.board[fromRow][fromCol];
    this.board[fromRow][fromCol] = '';

    // Update player and move count
    this.currentPlayer = this.currentPlayer === 'w' ? 'b' : 'w';
    this.moveCount++;

    // Add move to history in UCI format
    this.moveHistory.push(`${from}${to}`);

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

  getWinner(): 'black' | 'white' | 'draw' | null {
    if (this.isCheckmate('w')) return 'black'; // Black wins
    if (this.isCheckmate('b')) return 'white'; // White/Red wins
    if (this.isStalemate('w') || this.isStalemate('b')) return 'draw'; // Black wins by stalemate
    return null; // No winner yet / draw
  }

  isCheckmate(color: 'w' | 'b' = 'w'): boolean {
    return this.isInCheck(color) && this.generateMove(color) === 0;
  }

  isGameOver(): boolean {
    return (
      this.moveCount >= 120 ||
      this.isCheckmate('w') ||
      this.isCheckmate('b') ||
      this.isStalemate() ||
      this.isDraw()
    );
  }

  // king in check when move
  private moveInCheckValidator(
    [fromRow, fromCol]: [number, number],
    [toRow, toCol]: [number, number],
  ): Result {
    const color = this.currentPlayer === 'w' ? 'K' : 'k';
    const moveFrom = this.board[fromRow][fromCol];
    const moveTo = this.board[toRow][toCol];

    // Giả lập nước đi
    if (this.board[fromRow][fromCol] === color) {
      this.kings[this.currentPlayer] = [toRow, toCol];
    }
    this.board[toRow][toCol] = moveFrom;
    this.board[fromRow][fromCol] = '';
    // Kiểm tra xem nước đi có hợp lệ
    const invalidMove =
      this.isInCheck(this.currentPlayer) || this.isKingFaceToFace(this.board);
    if (invalidMove) {
      // Hoàn tác nước đi
      if (this.board[toRow][toCol] === color) {
        this.kings[this.currentPlayer] = [fromRow, fromCol];
      }
      this.board[fromRow][fromCol] = moveFrom;
      this.board[toRow][toCol] = moveTo;
      return { ok: false, message: 'Move leaves the king in check.' };
    }
    // reset
    if (this.board[toRow][toCol] === color) {
      this.kings[this.currentPlayer] = [fromRow, fromCol];
    }
    this.board[fromRow][fromCol] = moveFrom;
    this.board[toRow][toCol] = moveTo;

    return OK_RESULT;
  }

  isInCheck(Color: 'w' | 'b' = 'w'): boolean {
    const enemy = Color === 'w' ? 'b' : 'w';
    // current w - enemy b
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 9; col++) {
        // r
        const piece = this.board[row][col];
        if (!piece) continue;

        const isEnemy =
          (enemy === 'b' && piece === piece.toLowerCase()) ||
          (enemy === 'w' && piece === piece.toUpperCase());

        if (
          isEnemy &&
          this.canMove(row, col, this.kings[Color][0], this.kings[Color][1])
        ) {
          return true;
        }
      }
    }

    return false; // King is not in check
  }

  private isKingFaceToFace(board: string[][]): boolean {
    const [wRow, wCol] = this.findKing('w', board);
    const [bRow, bCol] = this.findKing('b', board);
    if (wCol === bCol) {
      for (let i = wRow - 1; i > bRow; i--) {
        if (this.board[i][wCol]) return false;
      }
      return true;
    }
    return false;
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
    let moveCount = 0;
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 9; col++) {
        const piece = this.board[row][col];
        if (!piece) continue;

        const isPlayerPiece =
          (color === 'w' && piece === piece.toUpperCase()) ||
          (color === 'b' && piece === piece.toLowerCase());

        if (isPlayerPiece) {
          switch (piece.toLowerCase()) {
            case 'r': {
              // Duyệt theo hàng (ngang)
              for (let c = col - 1; c >= 0; c--) {
                if (this.board[row][c] !== '') {
                  if (this.canMove(row, col, row, c) && !this.isInCheck(color))
                    moveCount++;
                  break;
                }
                if (this.canMove(row, col, row, c) && !this.isInCheck(color))
                  moveCount++;
              }
              for (let c = col + 1; c < 9; c++) {
                if (this.board[row][c] !== '') {
                  if (this.canMove(row, col, row, c) && !this.isInCheck(color))
                    moveCount++;
                  break;
                }
                if (this.canMove(row, col, row, c) && !this.isInCheck(color))
                  moveCount++;
              }

              // Duyệt theo cột (dọc)
              for (let r = row - 1; r >= 0; r--) {
                if (this.board[r][col] !== '') {
                  if (this.canMove(row, col, r, col) && !this.isInCheck(color))
                    moveCount++;
                  break;
                }
                if (this.canMove(row, col, r, col) && !this.isInCheck(color))
                  moveCount++;
              }
              for (let r = row + 1; r < 10; r++) {
                if (this.board[r][col] !== '') {
                  if (this.canMove(row, col, r, col) && !this.isInCheck(color))
                    moveCount++;
                  break;
                }
                if (this.canMove(row, col, r, col) && !this.isInCheck(color))
                  moveCount++;
              }
              break;
            }
            case 'n': {
              const horseMoves = [
                { dr: -2, dc: -1, blockR: -1, blockC: 0 }, // Lên 2 trái 1
                { dr: -2, dc: 1, blockR: -1, blockC: 0 }, // Lên 2 phải 1
                { dr: -1, dc: -2, blockR: 0, blockC: -1 }, // Lên 1 trái 2
                { dr: -1, dc: 2, blockR: 0, blockC: 1 }, // Lên 1 phải 2
                { dr: 1, dc: -2, blockR: 0, blockC: -1 }, // Xuống 1 trái 2
                { dr: 1, dc: 2, blockR: 0, blockC: 1 }, // Xuống 1 phải 2
                { dr: 2, dc: -1, blockR: 1, blockC: 0 }, // Xuống 2 trái 1
                { dr: 2, dc: 1, blockR: 1, blockC: 0 }, // Xuống 2 phải 1
              ];

              for (const move of horseMoves) {
                const toR = row + move.dr;
                const toC = col + move.dc;
                const blockR = row + move.blockR;
                const blockC = col + move.blockC;

                // Kiểm tra trong biên
                if (toR < 0 || toR >= 10 || toC < 0 || toC >= 9) continue;

                // Kiểm tra bị cản chân mã
                if (this.board[blockR]?.[blockC] !== '') continue;

                // Nếu đi được và không bị chiếu, tăng moveCount
                if (
                  this.canMove(row, col, toR, toC) &&
                  !this.isInCheck(color)
                ) {
                  moveCount++;
                }
              }
              break;
            }
            case 'b': {
              const bishopMoves = [
                { dr: -2, dc: -2, eyeR: -1, eyeC: -1 },
                { dr: -2, dc: 2, eyeR: -1, eyeC: 1 },
                { dr: 2, dc: -2, eyeR: 1, eyeC: -1 },
                { dr: 2, dc: 2, eyeR: 1, eyeC: 1 },
              ];

              for (const move of bishopMoves) {
                const toR = row + move.dr;
                const toC = col + move.dc;
                const eyeR = row + move.eyeR;
                const eyeC = col + move.eyeC;

                // Kiểm tra biên bàn cờ
                if (toR < 0 || toR >= 10 || toC < 0 || toC >= 9) continue;

                // Kiểm tra giới hạn sông
                const isRed =
                  this.board[row][col] === this.board[row][col].toUpperCase();
                if (isRed && toR > 4) continue;
                if (!isRed && toR < 5) continue;

                // Kiểm tra mắt tượng bị chặn
                if (this.board[eyeR]?.[eyeC] !== '') continue;

                if (
                  this.canMove(row, col, toR, toC) &&
                  !this.isInCheck(color)
                ) {
                  moveCount++;
                }
              }
              break;
            }
            case 'a': {
              const advisorMoves = [
                { dr: -1, dc: -1 },
                { dr: -1, dc: 1 },
                { dr: 1, dc: -1 },
                { dr: 1, dc: 1 },
              ];

              for (const move of advisorMoves) {
                const toR = row + move.dr;
                const toC = col + move.dc;

                // Kiểm tra biên bàn cờ
                if (toR < 0 || toR >= 10 || toC < 3 || toC > 5) continue;

                // Kiểm tra trong cung
                const isRed =
                  this.board[row][col] === this.board[row][col].toUpperCase();
                if (isRed && toR > 2) continue;
                if (!isRed && toR < 7) continue;

                if (
                  this.canMove(row, col, toR, toC) &&
                  !this.isInCheck(color)
                ) {
                  moveCount++;
                }
              }
              break;
            }
            case 'k': {
              const kingMoves = [
                { dr: -1, dc: 0 },
                { dr: 1, dc: 0 },
                { dr: 0, dc: -1 },
                { dr: 0, dc: 1 },
              ];

              const isRed =
                this.board[row][col] === this.board[row][col].toUpperCase();

              for (const move of kingMoves) {
                const toR = row + move.dr;
                const toC = col + move.dc;

                // Kiểm tra trong cung
                if (toC < 3 || toC > 5) continue;
                if (isRed && (toR < 0 || toR > 2)) continue;
                if (!isRed && (toR < 7 || toR > 9)) continue;

                if (
                  this.canMove(row, col, toR, toC) &&
                  !this.isInCheck(color)
                ) {
                  moveCount++;
                }
              }

              // Kiểm tra tướng đối mặt (cùng cột, không bị cản)
              let enemyKingRow = -1;
              for (let r = 0; r < 10; r++) {
                const piece = this.board[r][col];
                if (piece === '') continue;
                if (piece.toLowerCase() === 'k' && r !== row) {
                  enemyKingRow = r;
                  break;
                } else break; // bị cản
              }

              if (
                enemyKingRow !== -1 &&
                this.canMove(row, col, enemyKingRow, col) &&
                !this.isInCheck(color)
              ) {
                moveCount++;
              }

              break;
            }
            case 'c': {
              // Di chuyển theo 4 hướng
              const directions = [
                { dr: -1, dc: 0 },
                { dr: 1, dc: 0 },
                { dr: 0, dc: -1 },
                { dr: 0, dc: 1 },
              ];

              for (const { dr, dc } of directions) {
                let r = row + dr;
                let c = col + dc;
                let hasJumped = false;

                while (r >= 0 && r < 10 && c >= 0 && c < 9) {
                  const target = this.board[r][c];

                  if (!hasJumped) {
                    if (target === '') {
                      if (
                        this.canMove(row, col, r, c) &&
                        !this.isInCheck(color)
                      )
                        moveCount++;
                    } else {
                      hasJumped = true;
                    }
                  } else {
                    if (target !== '') {
                      if (
                        this.canMove(row, col, r, c) &&
                        !this.isInCheck(color)
                      )
                        moveCount++;
                      break;
                    }
                  }

                  r += dr;
                  c += dc;
                }
              }
              break;
            }
            case 'p': {
              const isRed =
                this.board[row][col] === this.board[row][col].toUpperCase();
              const forward = isRed ? 1 : -1;

              // Đi thẳng
              const toR = row + forward;
              if (toR >= 0 && toR < 10) {
                if (this.canMove(row, col, toR, col) && !this.isInCheck(color))
                  moveCount++;
              }

              // Nếu đã qua sông, có thể đi ngang
              const crossedRiver = isRed ? row >= 5 : row <= 4;
              if (crossedRiver) {
                for (const dc of [-1, 1]) {
                  const toC = col + dc;
                  if (toC >= 0 && toC < 9) {
                    if (
                      this.canMove(row, col, row, toC) &&
                      !this.isInCheck(color)
                    )
                      moveCount++;
                  }
                }
              }

              break;
            }
          }
        }
      }
    }
    return moveCount;
  }

  private canMove(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
  ): boolean {
    const piece = this.board[fromRow][fromCol];
    const target = this.board[toRow][toCol];
    if (!piece || !target) return false;

    const dr = toRow - fromRow; // move row
    const dc = toCol - fromCol; // move col

    switch (piece.toUpperCase()) {
      case 'R': // Xe
        if (dr !== 0 && dc !== 0) return false;
        if (dr === 0) {
          const step = dc > 0 ? 1 : -1;
          for (let c = fromCol + step; c !== toCol; c += step) {
            if (this.board[fromRow][c]) return false;
          }
        } else {
          const step = dr > 0 ? 1 : -1;
          for (let r = fromRow + step; r !== toRow; r += step) {
            if (this.board[r][fromCol]) return false;
          }
        }
        return true;

      case 'C': {
        // Pháo
        if (dr !== 0 && dc !== 0) return false;
        let count = 0;
        if (dr === 0) {
          const step = dc > 0 ? 1 : -1;
          for (let c = fromCol + step; c !== toCol; c += step) {
            if (this.board[fromRow][c]) count++;
          }
        } else {
          const step = dr > 0 ? 1 : -1;
          for (let r = fromRow + step; r !== toRow; r += step) {
            if (this.board[r][fromCol]) count++;
          }
        }
        if (count === 0 && !target) return true;
        if (count === 1 && target) return true;
        return false;
      }

      case 'N': // Mã
        if (
          !(
            (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
            (Math.abs(dr) === 1 && Math.abs(dc) === 2)
          )
        )
          return false;

        if (Math.abs(dr) === 2) {
          const blockRow = fromRow + (dr > 0 ? 1 : -1);
          if (this.board[blockRow][fromCol]) return false;
        } else {
          const blockCol = fromCol + (dc > 0 ? 1 : -1);
          if (this.board[fromRow][blockCol]) return false;
        }
        return true;

      case 'P': // pawn
        if (piece === 'p') {
          if (crossedRiver([fromRow, fromCol], true)) {
            if (dr === 1 && Math.abs(dc) <= 1) return true;
          } else {
            if (dr === 1 && dc === 0) return true;
          }
        } else {
          if (crossedRiver([fromRow, fromCol], false)) {
            if (dr === -1 && Math.abs(dc) <= 1) return true;
          } else {
            if (dr === -1 && dc === 0) return true;
          }
        }
        return false;

      default:
        return false;
    }
  }
  public exportUciFen(): string {
    const uciFen = this.exportFen();

    if (this.moveHistory.length > 0) {
      return `${uciFen} | ${this.moveHistory.join(' ')}`;
    }

    return uciFen;
  }

  public getHistory(): string[] {
    return [...this.moveHistory]; // Return a copy
  }

  /**
   * Get all legal moves for a piece at the given position
   * @param from - Position in chess notation (e.g., 'e4')
   * @param needTurn - Whether to check if it's the piece's turn to move
   * @returns Array of legal move destinations in chess notation
   */
  getLegalMoves(from: string, needTurn: boolean = true): string[] {
    const legalMoves: string[] = [];
    
    try {
      const fromCoords = this.positionToCoordinates(from);
      const [row, col] = fromCoords;
      const piece = this.board[row][col];
      

      if (!piece) {
        return []; // No piece at the position
      }
      
      // Check if it's the correct player's turn
      if (needTurn) {
        const isPieceRed = piece === piece.toUpperCase();
        if ((isPieceRed && this.currentPlayer !== 'w') || (!isPieceRed && this.currentPlayer !== 'b')) {
          return []; // Not this piece's turn
        }
      }
      
      // Generate all possible moves based on piece type
      const skipTurnForValidation = !needTurn; // Skip turn check in validation if needTurn is false
      
      switch (piece.toLowerCase()) {
        case 'r': { // Rook
          // Horizontal moves
          for (let c = col - 1; c >= 0; c--) {
            if (this.board[row][c] !== '') {
              if (this.isValidMoveWithoutCheck(row, col, row, c, skipTurnForValidation)) {
                legalMoves.push(this.coordinatesToPosition([row, c]));
              }
              break;
            }
            if (this.isValidMoveWithoutCheck(row, col, row, c, skipTurnForValidation)) {
              legalMoves.push(this.coordinatesToPosition([row, c]));
            }
          }
          for (let c = col + 1; c < 9; c++) {
            if (this.board[row][c] !== '') {
              if (this.isValidMoveWithoutCheck(row, col, row, c, skipTurnForValidation)) {
                legalMoves.push(this.coordinatesToPosition([row, c]));
              }
              break;
            }
            if (this.isValidMoveWithoutCheck(row, col, row, c, skipTurnForValidation)) {
              legalMoves.push(this.coordinatesToPosition([row, c]));
            }
          }
          
          // Vertical moves
          for (let r = row - 1; r >= 0; r--) {
            if (this.board[r][col] !== '') {
              if (this.isValidMoveWithoutCheck(row, col, r, col, skipTurnForValidation)) {
                legalMoves.push(this.coordinatesToPosition([r, col]));
              }
              break;
            }
            if (this.isValidMoveWithoutCheck(row, col, r, col, skipTurnForValidation)) {
              legalMoves.push(this.coordinatesToPosition([r, col]));
            }
          }
          for (let r = row + 1; r < 10; r++) {
            if (this.board[r][col] !== '') {
              if (this.isValidMoveWithoutCheck(row, col, r, col, skipTurnForValidation)) {
                legalMoves.push(this.coordinatesToPosition([r, col]));
              }
              break;
            }
            if (this.isValidMoveWithoutCheck(row, col, r, col, skipTurnForValidation)) {
              legalMoves.push(this.coordinatesToPosition([r, col]));
            }
          }
          break;
        }
        
        case 'n': { // Knight
          const horseMoves = [
            { dr: -2, dc: -1, blockR: -1, blockC: 0 },
            { dr: -2, dc: 1, blockR: -1, blockC: 0 },
            { dr: -1, dc: -2, blockR: 0, blockC: -1 },
            { dr: -1, dc: 2, blockR: 0, blockC: 1 },
            { dr: 1, dc: -2, blockR: 0, blockC: -1 },
            { dr: 1, dc: 2, blockR: 0, blockC: 1 },
            { dr: 2, dc: -1, blockR: 1, blockC: 0 },
            { dr: 2, dc: 1, blockR: 1, blockC: 0 },
          ];

          for (const move of horseMoves) {
            const toR = row + move.dr;
            const toC = col + move.dc;
            const blockR = row + move.blockR;
            const blockC = col + move.blockC;

            if (toR < 0 || toR >= 10 || toC < 0 || toC >= 9) continue;
            if (this.board[blockR]?.[blockC] !== '') continue;

            if (this.isValidMoveWithoutCheck(row, col, toR, toC, skipTurnForValidation)) {
              legalMoves.push(this.coordinatesToPosition([toR, toC]));
            }
          }
          break;
        }
        
        case 'b': { // Bishop
          const bishopMoves = [
            { dr: -2, dc: -2, eyeR: -1, eyeC: -1 },
            { dr: -2, dc: 2, eyeR: -1, eyeC: 1 },
            { dr: 2, dc: -2, eyeR: 1, eyeC: -1 },
            { dr: 2, dc: 2, eyeR: 1, eyeC: 1 },
          ];

          for (const move of bishopMoves) {
            const toR = row + move.dr;
            const toC = col + move.dc;
            const eyeR = row + move.eyeR;
            const eyeC = col + move.eyeC;

            if (toR < 0 || toR >= 10 || toC < 0 || toC >= 9) continue;

            const isRed = piece === piece.toUpperCase();
            if (isRed && toR < 5) continue; // Red bishops stay in rows 5-9
            if (!isRed && toR > 4) continue; // Black bishops stay in rows 0-4

            if (this.board[eyeR]?.[eyeC] !== '') continue; // Eye blocked

            if (this.isValidMoveWithoutCheck(row, col, toR, toC, skipTurnForValidation)) {
              legalMoves.push(this.coordinatesToPosition([toR, toC]));
            }
          }
          break;
        }
        
        case 'a': { // Advisor
          const advisorMoves = [
            { dr: -1, dc: -1 },
            { dr: -1, dc: 1 },
            { dr: 1, dc: -1 },
            { dr: 1, dc: 1 },
          ];

          for (const move of advisorMoves) {
            const toR = row + move.dr;
            const toC = col + move.dc;

            if (toR < 0 || toR >= 10 || toC < 3 || toC > 5) continue;

            const isRed = piece === piece.toUpperCase();
            if (isRed && (toR < 7 || toR > 9)) continue; // Red must stay in rows 7-9
            if (!isRed && (toR < 0 || toR > 2)) continue; // Black must stay in rows 0-2

            if (this.isValidMoveWithoutCheck(row, col, toR, toC, skipTurnForValidation)) {
              legalMoves.push(this.coordinatesToPosition([toR, toC]));
            }
          }
          break;
        }
        
        case 'k': { // King
          const kingMoves = [
            { dr: -1, dc: 0 },
            { dr: 1, dc: 0 },
            { dr: 0, dc: -1 },
            { dr: 0, dc: 1 },
          ];

          const isRed = piece === piece.toUpperCase();

          for (const move of kingMoves) {
            const toR = row + move.dr;
            const toC = col + move.dc;

            if (toC < 3 || toC > 5) continue; // Must stay in palace columns
            if (isRed && (toR < 7 || toR > 9)) continue; // Red king palace
            if (!isRed && (toR < 0 || toR > 2)) continue; // Black king palace

            if (this.isValidMoveWithoutCheck(row, col, toR, toC, skipTurnForValidation)) {
              legalMoves.push(this.coordinatesToPosition([toR, toC]));
            }
          }

          // Check for flying general move (kings facing each other)
          let enemyKingRow = -1;
          for (let r = 0; r < 10; r++) {
            const targetPiece = this.board[r][col];
            if (targetPiece === '') continue;
            if (targetPiece.toLowerCase() === 'k' && r !== row) {
              enemyKingRow = r;
              break;
            } else break; // Blocked
          }

          if (enemyKingRow !== -1 && this.isValidMoveWithoutCheck(row, col, enemyKingRow, col, skipTurnForValidation)) {
            legalMoves.push(this.coordinatesToPosition([enemyKingRow, col]));
          }
          break;
        }
        
        case 'c': { // Cannon
          const directions = [
            { dr: -1, dc: 0 },
            { dr: 1, dc: 0 },
            { dr: 0, dc: -1 },
            { dr: 0, dc: 1 },
          ];

          for (const { dr, dc } of directions) {
            let r = row + dr;
            let c = col + dc;
            let hasJumped = false;

            while (r >= 0 && r < 10 && c >= 0 && c < 9) {
              const target = this.board[r][c];

              if (!hasJumped) {
                if (target === '') {
                  if (this.isValidMoveWithoutCheck(row, col, r, c, skipTurnForValidation)) {
                    legalMoves.push(this.coordinatesToPosition([r, c]));
                  } else {
                  }
                } else {
                  hasJumped = true; // Found jumping piece
                }
              } else {
                if (target !== '') {
                  // Found target to capture after jumping
                  if (this.isValidMoveWithoutCheck(row, col, r, c, skipTurnForValidation)) {
                    legalMoves.push(this.coordinatesToPosition([r, c]));
                  }
                  break;
                }
              }

              r += dr;
              c += dc;
            }
          }
          break;
        }
        
        case 'p': { // Pawn
          const isRed = piece === piece.toUpperCase();
          const forward = isRed ? -1 : 1; // Red moves up (decreasing row), Black moves down (increasing row)

          // Move forward
          const toR = row + forward;
          if (toR >= 0 && toR < 10) {
            if (this.isValidMoveWithoutCheck(row, col, toR, col, skipTurnForValidation)) {
              legalMoves.push(this.coordinatesToPosition([toR, col]));
            }
          }

          // Sideways moves if crossed river
          const crossedRiver = isRed ? row <= 4 : row >= 5; // Fixed river crossing logic
          if (crossedRiver) {
            for (const dc of [-1, 1]) {
              const toC = col + dc;
              if (toC >= 0 && toC < 9) {
                if (this.isValidMoveWithoutCheck(row, col, row, toC, skipTurnForValidation)) {
                  legalMoves.push(this.coordinatesToPosition([row, toC]));
                }
              }
            }
          }
          break;
        }
      }
    } catch (error) {
      console.error('Error getting legal moves:', error);
      return [];
    }
    
    return legalMoves;
  }

  /**
   * Helper method to check if a move is valid without causing check
   * @param fromRow - Starting row
   * @param fromCol - Starting column  
   * @param toRow - Target row
   * @param toCol - Target column
   * @param skipTurnCheck - Whether to skip the turn validation
   * @returns Boolean indicating if move is valid
   */
  private isValidMoveWithoutCheck(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    skipTurnCheck: boolean = false,
  ): boolean {
    // First check basic move validity
    let moveResult: Result;
    
    if (skipTurnCheck) {
      // Create a custom validation without turn check
      moveResult = this._isLegalMoveSkipTurn([fromRow, fromCol], [toRow, toCol]);
    } else {
      moveResult = this._isLegalMove([fromRow, fromCol], [toRow, toCol]);
    }
    
    if (!moveResult.ok) {
      return false;
    }

    // Then check if move would put own king in check
    const originalPiece = this.board[fromRow][fromCol];
    const targetPiece = this.board[toRow][toCol];
    
    // Make temporary move
    this.board[toRow][toCol] = originalPiece;
    this.board[fromRow][fromCol] = '';
    
    // Update king position if king moved
    const color = originalPiece === originalPiece.toUpperCase() ? 'w' : 'b';
    let originalKingPos = null;
    if (originalPiece.toLowerCase() === 'k') {
      originalKingPos = [...this.kings[color]];
      this.kings[color] = [toRow, toCol];
    }
    
    // Check if this move puts own king in check or creates face-to-face kings
    const wouldBeInCheck = this.isInCheck(color) || this.isKingFaceToFace(this.board);
    
    // Restore board state
    this.board[fromRow][fromCol] = originalPiece;
    this.board[toRow][toCol] = targetPiece;
    if (originalKingPos) {
      this.kings[color] = originalKingPos;
    }
    
    return !wouldBeInCheck;
  }
}
