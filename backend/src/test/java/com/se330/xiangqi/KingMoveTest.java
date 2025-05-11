package com.se330.xiangqi;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class KingMoveTest {
    @Test
    public void should_allow_general_to_move_horizontally_within_palace() {
        final var fen = Utils.boardStrToFen("""
                rnbakabnr
                .........
                .c.....c.
                p.p.p.p.p
                .........
                .........
                P.P.P.P.P
                .C.....C.
                ....K....
                RNBA.ABNR""");
                
        final var xiangqi = Xiangqi.fromUciFen(fen);
        xiangqi.move(Move.of("e2", "f2"));

        final var expected = """
                rnbakabnr
                .........
                .c.....c.
                p.p.p.p.p
                .........
                .........
                P.P.P.P.P
                .C.....C.
                .....K...
                RNBA.ABNR""";
                
        assertEquals(expected, xiangqi.toString());
    }

    @Test
    public void should_allow_general_to_move_vertically_within_palace() {
        final var fen = Utils.boardStrToFen("""
                rnbakabnr
                .........
                .c.....c.
                p.p.p.p.p
                .........
                .........
                P.P.P.P.P
                .C.....C.
                ....K....
                RNBA.ABNR""");
                
        final var xiangqi = Xiangqi.fromUciFen(fen);
        xiangqi.move(Move.of("e2", "e3"));

        final var expected = """
                rnbakabnr
                .........
                .c.....c.
                p.p.p.p.p
                .........
                .........
                P.P.P.P.P
                .C..K..C.
                .........
                RNBA.ABNR""";
                
        assertEquals(expected, xiangqi.toString());
    }

    @Test
    public void should_throw_error_when_general_tries_to_move_outside_palace() {
        final var fen = Utils.boardStrToFen("""
                rnbakabnr
                .........
                .c.....c.
                p.p.p.p.p
                .........
                .........
                P.P...P.P
                .C..K..C.
                .........
                RNBA.ABNR""");
                
        final var xiangqi = Xiangqi.fromUciFen(fen);
        final var ex = assertThrows(IllegalArgumentException.class, () ->
                xiangqi.move(Move.of("e3", "e4"))
        );
        assertEquals("Invalid move: e3 -> e4", ex.getMessage());
    }

    @Test
    public void should_throw_error_when_general_tries_to_move_diagonally() {
        final var xiangqi = Xiangqi.defaultPosition();
        final var ex = assertThrows(IllegalArgumentException.class, () ->
                xiangqi.move(Move.of("e1", "f2"))
        );
        assertEquals("Invalid move: e1 -> f2", ex.getMessage());
    }
    
    @Test
    public void should_throw_error_for_flying_general_rule_violation() {
        final var fen = Utils.boardStrToFen("""
                ....k....
                .........
                .........
                .........
                .........
                .........
                .........
                .........
                .........
                ...K.....""");
                
        final var xiangqi = Xiangqi.fromUciFen(fen);
        final var ex = assertThrows(IllegalArgumentException.class, () ->
                xiangqi.move(Move.of("d1", "e1"))
        );
        assertEquals("Invalid move: d1 -> e1", ex.getMessage());
    }
}