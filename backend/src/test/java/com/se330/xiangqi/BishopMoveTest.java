package com.se330.xiangqi;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class BishopMoveTest {
    @Test
    public void should_allow_elephant_to_move_diagonally() {
        final var xiangqi = Xiangqi.defaultPosition();
        // Move pawn to clear path
        xiangqi.move(Move.of("c1", "a3"));
        xiangqi.move(Move.of("c10", "a8"));

        final var expected = """
                rn.akabnr
                .........
                bc.....c.
                p.p.p.p.p
                .........
                .........
                P.P.P.P.P
                BC.....C.
                .........
                RN.AKABNR""";
                
        assertEquals(expected, xiangqi.toString());
    }

    @Test
    public void should_throw_error_when_elephant_tries_to_cross_river() {
        final var fen = Utils.boardStrToFen("""
                rn.akabnr
                .........
                bc.....c.
                p.p.p.p.p
                .........
                ..B......
                P...P.P.P
                .C.....C.
                .........
                RN.AKABNR""");
                
        final var xiangqi = Xiangqi.fromUciFen(fen);
        // Now try to cross river
        final var ex = assertThrows(IllegalArgumentException.class, () ->
                xiangqi.move(Move.of("c5", "e7"))
        );
        assertEquals("Invalid move: c5 -> e7", ex.getMessage());
    }

    @Test
    public void should_throw_error_when_elephant_is_blocked_at_the_crossing_point() {
        final var fen = Utils.boardStrToFen("""
                rn.akabnr
                .........
                bc.....c.
                p.p.p.p.p
                .........
                .........
                P..PP.P.P
                .CB....C.
                .........
                RN.AKABNR""");
                
        final var xiangqi = Xiangqi.fromUciFen(fen);
        // Now try to move with a piece at the crossing point
        final var ex = assertThrows(IllegalArgumentException.class, () ->
                xiangqi.move(Move.of("c3", "e5"))
        );
        assertEquals("Invalid move: c3 -> e5", ex.getMessage());
    }
}