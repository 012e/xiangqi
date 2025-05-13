package com.se330.xiangqi;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class RookMoveTest {
    @Test
    public void should_allow_chariot_to_move_vertically() {
        final var xiangqi = Xiangqi.defaultPosition();
        xiangqi.move(Move.of("a1", "a2"));
        
        final var expected = """
                rnbakabnr
                .........
                .c.....c.
                p.p.p.p.p
                .........
                .........
                P.P.P.P.P
                .C.....C.
                R........
                .NBAKABNR""";
                
        assertEquals(expected, xiangqi.toString());
    }

    @Test
    public void should_allow_chariot_to_move_horizontally() {
        final var xiangqi = Xiangqi.defaultPosition();
        // Move pawn to clear path
        xiangqi.move(Move.of("a1", "a2"));
        xiangqi.move(Move.of("a10", "a9"));
        // Now move chariot horizontally
        xiangqi.move(Move.of("a2", "i2"));

        final var expected = """
                .nbakabnr
                r........
                .c.....c.
                p.p.p.p.p
                .........
                .........
                P.P.P.P.P
                .C.....C.
                ........R
                .NBAKABNR""";
                
        assertEquals(expected, xiangqi.toString());
    }

    @Test
    public void should_allow_chariot_to_capture_opponent_piece() {
        final var fen = Utils.boardStrToFen("""
                rnbakabnr
                .........
                .c.....c.
                p.p.p.p.p
                .........
                R........
                P.P.P.P.P
                .C.....C.
                .........
                .NBAKABNR""");
                
        final var xiangqi = Xiangqi.fromUciFen(fen);
        xiangqi.move(Move.of("a5", "a7"));

        final var expected = """
                rnbakabnr
                .........
                .c.....c.
                R.p.p.p.p
                .........
                .........
                P.P.P.P.P
                .C.....C.
                .........
                .NBAKABNR""";
                
        assertEquals(expected, xiangqi.toString());
    }

    @Test
    public void should_throw_error_when_chariot_tries_to_jump_over_pieces() {
        final var xiangqi = Xiangqi.defaultPosition();
        final var ex = assertThrows(IllegalArgumentException.class, () ->
                xiangqi.move(Move.of("a1", "a10"))
        );
        assertEquals("Invalid move: a1 -> a10", ex.getMessage());
    }
}