package com.se330.xiangqi;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Move {
    private final String from;
    private final String to;

    private Move(String from, String to) {
        this.from = from;
        this.to = to;
    }

    public static Move of(String from, String to) {
        return new Move(from, to);
    }

    public static Move fromUci(String uci) {
        Pattern pattern = Pattern.compile("^([a-zA-Z][0-9]+)([a-zA-Z][0-9]+)$");
        Matcher matcher = pattern.matcher(uci);
        if (!matcher.matches()) {
            throw new IllegalArgumentException("Invalid UCI move format: " + uci);
        }

        String from = matcher.group(1);
        String to = matcher.group(2);

        return new Move(from, to);
    }

    public String getFrom() {
        return from;
    }

    public String getTo() {
        return to;
    }

    public String toUci() {
        return from + to;
    }

    @Override
    public String toString() {
        return from + to;
    }
}
