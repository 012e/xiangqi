package com.se330.xiangqi;

import org.jetbrains.annotations.NotNull;

public class Utils {
    public static String boardStrToFen(String boardStr, char player) {
        String[] lines = boardStr.split("\n");
        StringBuilder fen = new StringBuilder();

        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty()) continue;

            StringBuilder fenRow = handleLine(line);

            if (!fen.isEmpty()) {
                fen.append('/');
            }
            fen.append(fenRow);
        }

        return fen + " " + player + " 0";
    }

    @NotNull
    private static StringBuilder handleLine(String line) {
        StringBuilder fenRow = new StringBuilder();
        int dotCount = 0;
        for (char c : line.toCharArray()) {
            if (c == '.') {
                dotCount++;
            } else {
                if (dotCount > 0) {
                    fenRow.append(dotCount);
                    dotCount = 0;
                }
                fenRow.append(c);
            }
        }
        if (dotCount > 0) {
            fenRow.append(dotCount);
        }
        return fenRow;
    }

    public static String boardStrToFen(String boardStr) {
        return boardStrToFen(boardStr, 'w');
    }
}
