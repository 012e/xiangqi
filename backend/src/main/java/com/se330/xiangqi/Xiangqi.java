package com.se330.xiangqi;

import lombok.Getter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Xiangqi {
    public static final String INITIAL_UCI_FEN = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0";
    private String[][] board;
    private String currentPlayer = "white";
    private int moveCount = 0;
    private List<Move> moveHistory;
    private Map<String, int[]> kings; // Store king positions for both sides

    private Xiangqi(String uciFen) {
        if (uciFen == null) {
            throw new IllegalArgumentException("uciFen must not be null");
        }
        moveHistory = new ArrayList<>();
        kings = new HashMap<>();
        parseUciFen(uciFen);
        locateKings();
    }

    public static Xiangqi defaultPosition() {
        return new Xiangqi(INITIAL_UCI_FEN);
    }

    public static Xiangqi fromUciFen(String uciFen) {
        return new Xiangqi(uciFen);
    }

    /**
     * Finds and stores the positions of both kings on the board
     */
    private void locateKings() {
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 9; j++) {
                String piece = board[i][j];
                if ("k".equals(piece)) {
                    kings.put("black", new int[]{i, j});
                } else if ("K".equals(piece)) {
                    kings.put("white", new int[]{i, j});
                }
            }
        }
        if (!kings.containsKey("white") || !kings.containsKey("black")) {
            throw new IllegalStateException("One or both kings are missing from the board");
        }
    }

    /**
     * Parses a UCI-style FEN string to initialize the board state, current player,
     * move count, and move history.
     * <p>
     * Format: board_string current_player move_count | move_history
     * Example: "rnbakabnr/9/.../RNBAKABNR w 0 | e2e3 e3e4"
     *
     * @param fen the UCI-style FEN string
     */
    private void parseUciFen(String fen) {
        String[] fenAndMoves = fen.trim().split("\\|");
        String[] parts = fenAndMoves[0].trim().split(" ");

        // Parse board layout
        String boardPart = parts[0];
        currentPlayer = parts.length > 1 && parts[1].equals("b") ? "black" : "white";
        moveCount = parts.length > 2 ? Integer.parseInt(parts[2]) : 0;

        // Initialize empty 10x9 board
        board = new String[10][9];
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 9; j++) {
                board[i][j] = "";
            }
        }

        // Parse the piece layout
        String[] rows = boardPart.split("/");
        for (int i = 0; i < 10; i++) {
            int col = 0;
            for (char c : rows[i].toCharArray()) {
                if (Character.isDigit(c)) {
                    col += Character.getNumericValue(c);
                } else {
                    board[i][col] = String.valueOf(c);
                    col++;
                }
            }
        }

        // Optional: parse move history if present
        moveHistory = new ArrayList<>();
        if (fenAndMoves.length > 1) {
            String[] moves = fenAndMoves[1].trim().split(" ");
            for (String moveStr : moves) {
                if (moveStr != null && !moveStr.trim().isEmpty()) {
                    moveHistory.add(Move.fromUci(moveStr.trim()));
                }
            }
        }
    }

    @Override 
    public String toString() {
        StringBuilder s = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 9; j++) {
                s.append(!board[i][j].isEmpty() ? board[i][j] : ".");
            }
            if (i < 9) {
                s.append("\n");
            }
        }
        return s.toString();
    }

    /**
     * Checks if a move is legal according to Xiangqi rules
     *
     * @param move The move to check
     * @return MoveResult indicating if the move is legal
     */
    public MoveResult isLegalMove(Move move) {
        int[] fromCoords = positionToCoordinates(move.getFrom());
        int[] toCoords = positionToCoordinates(move.getTo());
        return isLegalMove(fromCoords, toCoords);
    }

    /**
     * Internal method to check if a move is legal based on board coordinates
     *
     * @param fromCoords Starting position [row, col]
     * @param toCoords   Target position [row, col]
     * @return MoveResult indicating if the move is legal
     */
    private MoveResult isLegalMove(int[] fromCoords, int[] toCoords) {
        int fromRow = fromCoords[0];
        int fromCol = fromCoords[1];
        int toRow = toCoords[0];
        int toCol = toCoords[1];

        // Check if positions are within bounds
        if (!withinBounds(fromRow, fromCol) || !withinBounds(toRow, toCol)) {
            return MoveResult.fail("Move out of bounds");
        }

        // Check if there's a piece at the starting position
        String piece = board[fromRow][fromCol];
        if (piece.isEmpty()) {
            return MoveResult.fail("No piece at the starting position");
        }

        // Check if trying to move to the same position
        if (fromRow == toRow && fromCol == toCol) {
            return MoveResult.fail("Cannot move to the same position");
        }

        // Check if the piece belongs to the current player
        boolean isPieceRed = Character.isUpperCase(piece.charAt(0));
        if ((isPieceRed && "black".equals(currentPlayer)) || 
            (!isPieceRed && "white".equals(currentPlayer))) {
            return MoveResult.fail("Not the current player's piece");
        }

        // Check if trying to capture own piece
        String targetPiece = board[toRow][toCol];
        if (!targetPiece.isEmpty()) {
            boolean isTargetRed = Character.isUpperCase(targetPiece.charAt(0));
            if ((isPieceRed && isTargetRed) || (!isPieceRed && !isTargetRed)) {
                return MoveResult.fail("Cannot capture own piece");
            }
        }

        // Validate move based on piece type
        MoveResult pieceValidation = validatePieceMove(piece.toLowerCase(), fromRow, fromCol, toRow, toCol);
        if (!pieceValidation.isOk()) {
            return pieceValidation;
        }

        // Check if move would result in check (king safety)
        if (!validateKingSafety(fromRow, fromCol, toRow, toCol)) {
            return MoveResult.fail("Move would leave king in check");
        }

        return MoveResult.ok();
    }

    /**
     * Validates if a move is legal based on the specific piece's movement rules
     */
    private MoveResult validatePieceMove(String pieceType, int fromRow, int fromCol, int toRow, int toCol) {
        switch (pieceType.toLowerCase()) {
            case "p": // Pawn/Soldier
                return validatePawnMove(fromRow, fromCol, toRow, toCol);
            case "r": // Chariot/Rook
                return validateRookMove(fromRow, fromCol, toRow, toCol);
            case "n": // Horse/Knight
                return validateKnightMove(fromRow, fromCol, toRow, toCol);
            case "b": // Elephant/Bishop
                return validateBishopMove(fromRow, fromCol, toRow, toCol);
            case "a": // Advisor
                return validateAdvisorMove(fromRow, fromCol, toRow, toCol);
            case "k": // General/King
                return validateKingMove(fromRow, fromCol, toRow, toCol);
            case "c": // Cannon
                return validateCannonMove(fromRow, fromCol, toRow, toCol);
            default:
                return MoveResult.fail("Unknown piece type");
        }
    }

    /**
     * Validates a pawn/soldier move
     */
    private MoveResult validatePawnMove(int fromRow, int fromCol, int toRow, int toCol, boolean isPieceRed) {
        // Determine direction based on piece color
        int direction = isPieceRed ? -1 : 1;

        // Forward movement
        if (toCol == fromCol && toRow == fromRow + direction) {
            return MoveResult.ok();
        }

        // Check if pawn has crossed the river
        boolean crossedRiver = isPieceRed ? fromRow <= 4 : fromRow >= 5;
        
        // Horizontal movement after crossing the river
        if (crossedRiver && toRow == fromRow && Math.abs(toCol - fromCol) == 1) {
            return MoveResult.ok();
        }

        return MoveResult.fail("Invalid pawn move: " + coordinatesToPosition(fromRow, fromCol) + " -> " + 
                                    coordinatesToPosition(toRow, toCol));
    }

    private MoveResult validatePawnMove(int fromRow, int fromCol, int toRow, int toCol) {
        String piece = board[fromRow][fromCol];
        boolean isPieceRed = Character.isUpperCase(piece.charAt(0));
        return validatePawnMove(fromRow, fromCol, toRow, toCol, isPieceRed);
    }

    /**
     * Validates a chariot/rook move
     */
    private MoveResult validateRookMove(int fromRow, int fromCol, int toRow, int toCol) {
        // Rook moves in straight lines
        if (fromRow != toRow && fromCol != toCol) {
            return MoveResult.fail("Rooks move only in straight lines");
        }

        // Check if path is clear
        if (fromRow == toRow) { // Horizontal movement
            int step = Integer.compare(toCol, fromCol);
            for (int c = fromCol + step; c != toCol; c += step) {
                if (!board[fromRow][c].isEmpty()) {
                    return MoveResult.fail("Path is blocked");
                }
            }
        } else { // Vertical movement
            int step = Integer.compare(toRow, fromRow);
            for (int r = fromRow + step; r != toRow; r += step) {
                if (!board[r][fromCol].isEmpty()) {
                    return MoveResult.fail("Path is blocked");
                }
            }
        }

        return MoveResult.ok();
    }

    /**
     * Validates a knight/horse move
     */
    private MoveResult validateKnightMove(int fromRow, int fromCol, int toRow, int toCol) {
        // Knight moves in L-shape (2-1 pattern)
        int rowDiff = Math.abs(toRow - fromRow);
        int colDiff = Math.abs(toCol - fromCol);
        
        if (!((rowDiff == 2 && colDiff == 1) || (rowDiff == 1 && colDiff == 2))) {
            return MoveResult.fail("Invalid knight move pattern");
        }

        // Check for blockage (Chinese chess knights can be blocked)
        int midRow = fromRow;
        int midCol = fromCol;
        
        if (rowDiff == 2) {
            // Moving primarily vertically
            midRow = fromRow + Integer.compare(toRow, fromRow);
        } else {
            // Moving primarily horizontally
            midCol = fromCol + Integer.compare(toCol, fromCol);
        }

        if (!board[midRow][midCol].isEmpty()) {
            return MoveResult.fail("Knight move is blocked");
        }

        return MoveResult.ok();
    }

    /**
     * Validates an elephant/bishop move
     */
    private MoveResult validateBishopMove(int fromRow, int fromCol, int toRow, int toCol) {
        String piece = board[fromRow][fromCol];
        boolean isPieceRed = Character.isUpperCase(piece.charAt(0));
        
        // Elephant moves exactly 2 points diagonally
        if (Math.abs(toRow - fromRow) != 2 || Math.abs(toCol - fromCol) != 2) {
            return MoveResult.fail("Elephant must move exactly 2 points diagonally");
        }

        // Elephant cannot cross the river
        if (isPieceRed && toRow < 5) {
            return MoveResult.fail("Elephant cannot cross the river");
        } else if (!isPieceRed && toRow > 4) {
            return MoveResult.fail("Elephant cannot cross the river");
        }

        // Check for blocking piece at the diagonal crossing point
        int midRow = (fromRow + toRow) / 2;
        int midCol = (fromCol + toCol) / 2;
        
        if (!board[midRow][midCol].isEmpty()) {
            return MoveResult.fail("Elephant move is blocked");
        }

        return MoveResult.ok();
    }

    /**
     * Validates an advisor move
     */
    private MoveResult validateAdvisorMove(int fromRow, int fromCol, int toRow, int toCol) {
        String piece = board[fromRow][fromCol];
        boolean isPieceRed = Character.isUpperCase(piece.charAt(0));
        
        // Advisor moves one point diagonally
        if (Math.abs(toRow - fromRow) != 1 || Math.abs(toCol - fromCol) != 1) {
            return MoveResult.fail("Advisor must move exactly 1 point diagonally");
        }

        // Advisor must stay within palace
        if (toCol < 3 || toCol > 5) {
            return MoveResult.fail("Advisor must stay within palace (columns 3-5)");
        }

        if (isPieceRed && (toRow < 7 || toRow > 9)) {
            return MoveResult.fail("Advisor must stay within red palace (rows 7-9)");
        } else if (!isPieceRed && (toRow < 0 || toRow > 2)) {
            return MoveResult.fail("Advisor must stay within black palace (rows 0-2)");
        }

        return MoveResult.ok();
    }

    /**
     * Validates a general/king move
     */
    private MoveResult validateKingMove(int fromRow, int fromCol, int toRow, int toCol) {
        String piece = board[fromRow][fromCol];
        boolean isPieceRed = Character.isUpperCase(piece.charAt(0));
        
        // King moves one point orthogonally
        if (Math.abs(toRow - fromRow) + Math.abs(toCol - fromCol) != 1) {
            return MoveResult.fail("King must move exactly 1 point orthogonally");
        }

        // King must stay within palace
        if (toCol < 3 || toCol > 5) {
            return MoveResult.fail("King must stay within palace (columns 3-5)");
        }

        if (isPieceRed && (toRow < 7 || toRow > 9)) {
            return MoveResult.fail("King must stay within red palace (rows 7-9)");
        } else if (!isPieceRed && (toRow < 0 || toRow > 2)) {
            return MoveResult.fail("King must stay within black palace (rows 0-2)");
        }

        // Check for "flying general" rule - kings cannot face each other directly
        if (isKingsFacingAfterMove(fromRow, fromCol, toRow, toCol)) {
            return MoveResult.fail("Kings cannot face each other directly");
        }

        return MoveResult.ok();
    }

    /**
     * Validates a cannon move
     */
    private MoveResult validateCannonMove(int fromRow, int fromCol, int toRow, int toCol) {
        // Cannon moves in straight lines like a rook
        if (fromRow != toRow && fromCol != toCol) {
            return MoveResult.fail("Cannon must move in straight lines");
        }

        // Count pieces in between (used for capturing)
        int piecesInBetween = 0;
        
        if (fromRow == toRow) { // Horizontal movement
            int step = Integer.compare(toCol, fromCol);
            for (int c = fromCol + step; c != toCol; c += step) {
                if (!board[fromRow][c].isEmpty()) {
                    piecesInBetween++;
                }
            }
        } else { // Vertical movement
            int step = Integer.compare(toRow, fromRow);
            for (int r = fromRow + step; r != toRow; r += step) {
                if (!board[r][fromCol].isEmpty()) {
                    piecesInBetween++;
                }
            }
        }

        // Cannon needs exactly one piece to jump over when capturing
        if (!board[toRow][toCol].isEmpty()) {
            if (piecesInBetween != 1) {
                return MoveResult.fail("Cannon needs exactly one piece to jump over when capturing");
            }
        } 
        // When not capturing, no pieces are allowed in between
        else if (piecesInBetween > 0) {
            return MoveResult.fail("Cannon cannot jump over pieces when not capturing");
        }

        return MoveResult.ok();
    }

    /**
     * Checks if a move would leave the player's king in check
     */
    private boolean validateKingSafety(int fromRow, int fromCol, int toRow, int toCol) {
        // Temporarily make the move
        String movingPiece = board[fromRow][fromCol];
        String capturedPiece = board[toRow][toCol];
        
        board[toRow][toCol] = movingPiece;
        board[fromRow][fromCol] = "";
        
        // Update king position if king is moving
        int[] kingPos = kings.get(currentPlayer);
        if ((movingPiece.equals("k") && "black".equals(currentPlayer)) || 
            (movingPiece.equals("K") && "white".equals(currentPlayer))) {
            kings.put(currentPlayer, new int[]{toRow, toCol});
        }
        
        // Check if king is in check after move
        boolean isKingSafe = !isInCheck(currentPlayer);
        
        // Undo the move
        board[fromRow][fromCol] = movingPiece;
        board[toRow][toCol] = capturedPiece;
        
        // Restore king position if moved
        if ((movingPiece.equals("k") && "black".equals(currentPlayer)) || 
            (movingPiece.equals("K") && "white".equals(currentPlayer))) {
            kings.put(currentPlayer, kingPos);
        }
        
        return isKingSafe;
    }

    /**
     * Checks if the kings would be facing each other directly after a move
     */
    private boolean isKingsFacingAfterMove(int fromRow, int fromCol, int toRow, int toCol) {
        // Temporarily make the move
        String movingPiece = board[fromRow][fromCol];
        String capturedPiece = board[toRow][toCol];
        
        board[toRow][toCol] = movingPiece;
        board[fromRow][fromCol] = "";
        
        boolean kingsAreFacing = false;
        
        // Get positions of both kings after the move
        int[] blackKingPos = kings.get("black");
        int[] whiteKingPos = kings.get("white");
        
        // Update king position if king is moving
        if (movingPiece.equals("k")) {
            blackKingPos = new int[]{toRow, toCol};
        } else if (movingPiece.equals("K")) {
            whiteKingPos = new int[]{toRow, toCol};
        }
        
        // Check if kings are in the same column
        if (blackKingPos[1] == whiteKingPos[1]) {
            boolean piecesBetween = false;
            
            // Check if there are pieces between the kings
            int startRow = Math.min(blackKingPos[0], whiteKingPos[0]) + 1;
            int endRow = Math.max(blackKingPos[0], whiteKingPos[0]);
            
            for (int r = startRow; r < endRow; r++) {
                if (!board[r][blackKingPos[1]].isEmpty()) {
                    piecesBetween = true;
                    break;
                }
            }
            
            kingsAreFacing = !piecesBetween;
        }
        
        // Undo the move
        board[fromRow][fromCol] = movingPiece;
        board[toRow][toCol] = capturedPiece;
        
        return kingsAreFacing;
    }

    /**
     * Checks if the specified player is in check
     */
    public boolean isInCheck(String playerColor) {
        int[] kingPos = kings.get(playerColor);
        if (kingPos == null) return false;
        
        int kingRow = kingPos[0];
        int kingCol = kingPos[1];
        
        // Check if any opponent's piece could capture the king
        for (int r = 0; r < 10; r++) {
            for (int c = 0; c < 9; c++) {
                String piece = board[r][c];
                if (piece.isEmpty()) continue;
                
                boolean isPieceRed = Character.isUpperCase(piece.charAt(0));
                // Skip pieces of the same color as the king
                if (("white".equals(playerColor) && isPieceRed) || 
                    ("black".equals(playerColor) && !isPieceRed)) {
                    continue;
                }
                
                // Check if this piece could legally capture the king
                MoveResult result = validatePieceMove(piece.toLowerCase(), r, c, kingRow, kingCol);
                if (result.isOk()) {
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * Counts legal moves for the specified player
     */
    private int countLegalMoves(String playerColor) {
        int moveCount = 0;
        
        for (int fromRow = 0; fromRow < 10; fromRow++) {
            for (int fromCol = 0; fromCol < 9; fromCol++) {
                String piece = board[fromRow][fromCol];
                if (piece.isEmpty()) continue;
                
                boolean isPieceRed = Character.isUpperCase(piece.charAt(0));
                if (("white".equals(playerColor) && !isPieceRed) || 
                    ("black".equals(playerColor) && isPieceRed)) {
                    continue; // Skip opponent's pieces
                }
                
                // Check all possible destinations
                for (int toRow = 0; toRow < 10; toRow++) {
                    for (int toCol = 0; toCol < 9; toCol++) {
                        // Skip starting position
                        if (fromRow == toRow && fromCol == toCol) continue;
                        
                        // Save current player
                        String savedPlayer = currentPlayer;
                        currentPlayer = playerColor;
                        
                        MoveResult result = isLegalMove(new int[]{fromRow, fromCol}, new int[]{toRow, toCol});
                        
                        // Restore player
                        currentPlayer = savedPlayer;
                        
                        if (result.isOk()) {
                            moveCount++;
                        }
                    }
                }
            }
        }
        
        return moveCount;
    }

    /**
     * Checks if the given player is in checkmate
     */
    public boolean isCheckmate(String playerColor) {
        return isInCheck(playerColor) && countLegalMoves(playerColor) == 0;
    }

    /**
     * Checks if the given player is in stalemate (not in check but no legal moves)
     */
    public boolean isStalemate(String playerColor) {
        return !isInCheck(playerColor) && countLegalMoves(playerColor) == 0;
    }

    /**
     * Checks if there is insufficient material for either player to win
     */
    public boolean isInsufficientMaterial() {
        int pawnCount = 0, knightCount = 0, rookCount = 0, cannonCount = 0, kingCount = 0;
        
        for (int r = 0; r < 10; r++) {
            for (int c = 0; c < 9; c++) {
                String piece = board[r][c].toLowerCase();
                if (piece.isEmpty()) continue;
                
                switch (piece) {
                    case "p": pawnCount++; break;
                    case "n": knightCount++; break;
                    case "r": rookCount++; break;
                    case "c": cannonCount++; break;
                    case "k": kingCount++; break;
                }
            }
        }
        
        // Total pieces (excluding kings) on the board
        int totalPieces = pawnCount + knightCount + rookCount + cannonCount;
        
        // Kings only
        if (totalPieces == 0) return true;
        
        // No offensive pieces left
        if (knightCount == 0 && rookCount == 0 && cannonCount == 0 && pawnCount == 0) {
            return true;
        }
        
        return false;
    }

    /**
     * Checks if the game is a draw
     */
    public boolean isDraw() {
        // Draw by stalemate
        if (isStalemate("white") || isStalemate("black")) {
            return true;
        }
        
        // Draw by insufficient material
        if (isInsufficientMaterial()) {
            return true;
        }
        
        // Draw by move limit (e.g., 120 moves without progress)
        if (moveCount >= 120) {
            return true;
        }
        
        return false;
    }

    /**
     * Checks if the game is over
     */
    public boolean isGameOver() {
        return isCheckmate("white") || isCheckmate("black") || isDraw();
    }

    private void addHistory(Move move) {
        moveHistory.add(move);
        moveCount++;
    }

    /**
     * Convert chess notation (e.g. "e4") to board coordinates [row, col].
     *
     * @param position Chess notation position
     * @return An array with board coordinates [row, col]
     */
    private int[] positionToCoordinates(String position) {
        if (position.length() < 2) {
            throw new IllegalArgumentException("Invalid position: " + position);
        }

        int col = position.charAt(0) - 'a';
        int row = 9 - (Integer.parseInt(position.substring(1)) - 1);

        if (col < 0 || col > 8 || row < 0 || row > 9) {
            throw new IllegalArgumentException("Position out of bounds: " + position);
        }

        return new int[]{row, col};
    }

    /**
     * Convert board coordinates [row, col] to chess notation (e.g. "e4")
     *
     * @param row The row index (0-9)
     * @param col The column index (0-8)
     * @return Chess notation position
     */
    private String coordinatesToPosition(int row, int col) {
        if (col < 0 || col > 8 || row < 0 || row > 9) {
            throw new IllegalArgumentException("Coordinates out of bounds: [" + row + ", " + col + "]");
        }

        char file = (char) ('a' + col);
        int rank = 10 - row;

        return String.format("%c%d", file, rank);
    }

    /**
     * Checks if coordinates are within board boundaries
     */
    private boolean withinBounds(int row, int col) {
        return row >= 0 && row < 10 && col >= 0 && col < 9;
    }

    private void toggleCurrentPlayer() {
        currentPlayer = "white".equals(currentPlayer) ? "black" : "white";
    }

    /**
     * Makes a move on the board
     */
    public void move(Move move) {
        MoveResult result = isLegalMove(move);
        
        if (!result.isOk()) {
            throw new IllegalArgumentException("Invalid move: " + move.getFrom() + " -> " + move.getTo());
        }
        
        int[] fromCoords = positionToCoordinates(move.getFrom());
        int[] toCoords = positionToCoordinates(move.getTo());
        
        int fromRow = fromCoords[0];
        int fromCol = fromCoords[1];
        int toRow = toCoords[0];
        int toCol = toCoords[1];

        String piece = board[fromRow][fromCol];
        
        // Update king position if king is moving
        if (piece.equals("k") || piece.equals("K")) {
            kings.put(currentPlayer, new int[]{toRow, toCol});
        }
        
        // Make the move
        board[toRow][toCol] = piece;
        board[fromRow][fromCol] = "";
        
        // Update player and move history
        toggleCurrentPlayer();
        addHistory(move);
    }

    /**
     * Gets the current game result
     */
    public GameResult getResult() {
        if (isCheckmate("white")) {
            return GameResult.BLACK_WIN;
        } else if (isCheckmate("black")) {
            return GameResult.WHITE_WIN;
        } else if (isDraw()) {
            return GameResult.DRAW;
        }
        return GameResult.ONGOING;
    }


    public String exportUciFen() {
        StringBuilder uciFen = new StringBuilder();

        // Start with board + current player + move count
        uciFen.append(exportFen());

        // Add move history if any
        if (!moveHistory.isEmpty()) {
            uciFen.append(" | ");
            for (int i = 0; i < moveHistory.size(); i++) {
                uciFen.append(moveHistory.get(i).toUci());
                if (i < moveHistory.size() - 1) {
                    uciFen.append(" ");
                }
            }
        }

        return uciFen.toString();
    }

    public String exportFen() {
        List<String> rows = new ArrayList<>();

        // Process board state
        for (int i = 0; i < 10; i++) {
            StringBuilder row = new StringBuilder();
            int emptyCount = 0;

            for (int j = 0; j < 9; j++) {
                if (board[i][j].isEmpty()) {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        row.append(emptyCount);
                        emptyCount = 0;
                    }
                    row.append(board[i][j]);
                }
            }

            if (emptyCount > 0) {
                row.append(emptyCount);
            }

            rows.add(row.toString());
        }

        return String.format("%s %s %d", String.join("/", rows), 
                "white".equals(currentPlayer) ? "w" : "b", 
                moveCount);
    }

    /**
     * Gets the current player color
     * @return "white" or "black"
     */
    public String getCurrentPlayerColor() {
        return currentPlayer;
    }

    public boolean isWhiteTurn() {
        return currentPlayer.equals("white");
    }

    public boolean isBlackTurn() {
        return currentPlayer.equals("white");
    }

    /**
     * Returns the number of moves made in the game
     */
    public int getMoveCount() {
        // This is not the total number of moves, but rather the number of turns taken
        // Each move consists of a "from" and "to" position, so we divide by 2 plus one if odd
        return moveCount / 2 + (moveCount % 2);
    }

}