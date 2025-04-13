package com.se330.xiangqi;

import java.util.ArrayList;
import java.util.List;

public class Xiangqi {
    public static String INITIAL_UCI_FEN = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0";
    private String[][] board;
    private char currentPlayer = 'w';
    private int moveCount = 0;
    private List<Move> moveHistory;

    private Xiangqi(String uciFen) {
        if (uciFen == null) {
            throw new IllegalArgumentException("uciFen must not be null");
        }
        parseUciFen(uciFen);
    }

    public static Xiangqi defaultPosition() {
        return new Xiangqi(INITIAL_UCI_FEN);
    }

    public static Xiangqi fromUciFen(String UciFen) {
        return new Xiangqi(UciFen);
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
        currentPlayer = parts.length > 1 ? parts[1].charAt(0) : 'w';
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
                    board[i][col++] = String.valueOf(c);
                }
            }
        }

        // Optional: parse move history if present
        moveHistory = new ArrayList<>();
        if (fenAndMoves.length > 1) {
            String[] moves = fenAndMoves[1].trim().split(" ");
            for (String moveStr : moves) {
                if (moveStr.length() == 4) {
                    moveHistory.add(Move.fromUci(moveStr));
                }
            }
        }
    }

    public String boardAsString() {
        StringBuilder s = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 9; j++) {
                s.append(!board[i][j].isBlank() ? board[i][j] : ".");
            }
            s.append("\n");
        }
        // remove last newline
        return s.toString().trim();
    }

    public MoveResult isLegalMove(Move from) {
        return MoveResult.ok();
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

    private void toggleCurrentPlayer() {
        currentPlayer = (currentPlayer == 'w' ? 'b' : 'w');
    }


    public void move(Move move) {
        final var result = isLegalMove(move);
        final var fromCoords = positionToCoordinates(move.getFrom());
        final var toCoords = positionToCoordinates(move.getTo());

        if (!result.isOk()) {
            throw new IllegalArgumentException(String.format("Illegal move: %s", move));
        }
        final var fromRow = fromCoords[0];
        final var fromCol = fromCoords[1];
        final var toRow = toCoords[0];
        final var toCol = toCoords[1];


        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = "";

        toggleCurrentPlayer();
        addHistory(move);
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

        return String.format("%s %s %d", String.join("/", rows), currentPlayer, moveCount);
    }


    public GameResult getResult() {
        return GameResult.ONGOING;
    }
}