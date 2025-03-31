import { Result, OK_RESULT, BoardContext } from ".";

/**
 * Validates that both the starting and ending positions are within the game board boundaries.
 * A Chinese Chess board is 9x10 (9 columns and 10 rows).
 *
 * @param {[number, number]} fromPos - The starting position [row, column].
 * @param {[number, number]} toPos - The destination position [row, column].
 * @returns {Result} Result object indicating if the move is valid.
 */
export function inBoundValiator(
	[fromRow, fromCol]: [number, number],
	[toRow, toCol]: [number, number]
): Result {
	if (
		fromRow < 0 ||
		fromRow >= 10 ||
		fromCol < 0 ||
		fromCol >= 9 ||
		toRow < 0 ||
		toRow >= 10 ||
		toCol < 0 ||
		toCol >= 9
	) {
		return { ok: false, message: "Move out of bounds." };
	}
	return OK_RESULT;
}

/**
 * Validates that there is a piece at the starting position.
 *
 * @param {[number, number]} fromPos - The starting position [row, column].
 * @param {[number, number]} toPos - The destination position [row, column] (unused).
 * @param {BoardContext} context - The game board context.
 * @returns {Result} Result object indicating if the move is valid.
 */
export function fromPieceValidator(
	[fromRow, fromCol]: [number, number],
	_to: [number, number],
	{ board }: BoardContext
): Result {
	const piece = board[fromRow][fromCol];
	if (!piece) {
		return { ok: false, message: "No piece at the starting position." };
	}
	return OK_RESULT;
}

/**
 * Validates that the piece is not being moved to the same position it currently occupies.
 *
 * @param {[number, number]} fromPos - The starting position [row, column].
 * @param {[number, number]} toPos - The destination position [row, column].
 * @returns {Result} Result object indicating if the move is valid.
 */
export function duplicateMoveValidator(
	[fromRow, fromCol]: [number, number],
	[toRow, toCol]: [number, number]
): Result {
	if (fromRow === toRow && fromCol === toCol) {
		return { ok: false, message: "Can't move to the same position." };
	}
	return OK_RESULT;
}

/**
 * Validates that the player is moving their own piece during their turn.
 * Red pieces (uppercase) belong to the 'w' player, and black pieces (lowercase) belong to the 'b' player.
 *
 * @param {[number, number]} fromPos - The starting position [row, column].
 * @param {[number, number]} toPos - The destination position [row, column] (unused).
 * @param {BoardContext} context - The game board context containing the board and current player.
 * @returns {Result} Result object indicating if the move is valid.
 */
export function correctTurnValidator(
	[fromRow, fromCol]: [number, number],
	_to: [number, number],
	{ board, currentPlayer }: BoardContext
): Result {
	const piece = board[fromRow][fromCol];
	if (!piece) {
		return { ok: false, message: "No piece at the starting position." };
	}
	const isPieceRed = piece === piece.toUpperCase();
	if (isPieceRed && currentPlayer !== "w") {
		return { ok: false, message: "Not the current player's piece." };
	} else if (!isPieceRed && currentPlayer !== "b") {
		return { ok: false, message: "Not the current player's piece." };
	}
	return OK_RESULT;
}

/**
 * Validates that a player is not attempting to capture their own piece.
 * Pieces of the same color (both uppercase or both lowercase) cannot capture each other.
 *
 * @param {[number, number]} fromPos - The starting position [row, column].
 * @param {[number, number]} toPos - The destination position [row, column].
 * @param {BoardContext} context - The game board context.
 * @returns {Result} Result object indicating if the move is valid.
 */
export function captureOwnPieceValidator(
	[fromRow, fromCol]: [number, number],
	[toRow, toCol]: [number, number],
	{ board }: BoardContext
): Result {
	const piece = board[fromRow][fromCol];
	const targetPiece = board[toRow][toCol];
	if (targetPiece) {
		const isPieceRed = piece === piece.toUpperCase();
		const isTargetRed = targetPiece === targetPiece.toUpperCase();
		if ((isPieceRed && isTargetRed) || (!isPieceRed && !isTargetRed)) {
			return { ok: false, message: "Can't capture own piece." };
		}
	}
	return OK_RESULT;
}
