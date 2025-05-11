package com.se330.xiangqi;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class KnightMoveTest {
    @Test
    public void should_allow_horse_to_move_in_L_shape() {
        final var xiangqi = Xiangqi.defaultPosition();
        // Move pawn to make way for horse
        xiangqi.move(Move.of("b1", "c3"));
        
        final var expected = """
                rnbakabnr
                .........
                .c.....c.
                p.p.p.p.p
                .........
                .........
                P.P.P.P.P
                .CN....C.
                .........
                R.BAKABNR""";
                
        assertEquals(expected, xiangqi.toString());
    }

    @Test
    public void should_throw_error_when_horse_is_blocked_vertically() {
        final var xiangqi = Xiangqi.defaultPosition();
        final var ex = assertThrows(IllegalArgumentException.class, () ->
                xiangqi.move(Move.of("b1", "d2"))
        );
        assertEquals("Invalid move: b1 -> d2", ex.getMessage());
    }

    @Test
    public void should_throw_error_when_horse_is_blocked_horizontally() {
        final var fen = Utils.boardStrToFen("""
                rnbakabnr
                .........
                .c.....c.
                p.p.p.p.p
                .........
                .........
                P.P.P.P.P
                .CN....C.
                .........
                R.BAKABNR""");
                
        final var xiangqi = Xiangqi.fromUciFen(fen);
        final var ex = assertThrows(IllegalArgumentException.class, () ->
                xiangqi.move(Move.of("c3", "a2"))
        );
        assertEquals("Invalid move: c3 -> a2", ex.getMessage());
    }
}