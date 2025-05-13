package com.se330.xiangqi;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class CannonMoveTest {
    @Test
    public void should_allow_cannon_to_move_vertically() {
        final var xiangqi = Xiangqi.defaultPosition();
        xiangqi.move(Move.of("b3", "b10"));

        final var expected = """
                rCbakabnr
                .........
                .c.....c.
                p.p.p.p.p
                .........
                .........
                P.P.P.P.P
                .......C.
                .........
                RNBAKABNR""";
                
        assertEquals(expected, xiangqi.toString());
    }

    @Test
    public void should_allow_cannon_to_capture_by_jumping_over_exactly_one_piece() {
        final var fen = Utils.boardStrToFen("""
                rnbakabnr
                .........
                .c.....c.
                p...p.p.p
                .........
                .p.......
                P.P.P.P.P
                .C.....C.
                .........
                RNBAKABNR""");
                
        final var xiangqi = Xiangqi.fromUciFen(fen);
        // Setup a position for cannon to capture
        xiangqi.move(Move.of("b3", "b8"));

        final var expected = """
                rnbakabnr
                .........
                .C.....c.
                p...p.p.p
                .........
                .p.......
                P.P.P.P.P
                .......C.
                .........
                RNBAKABNR""";
                
        assertEquals(expected, xiangqi.toString());
    }

    @Test
    public void should_throw_error_when_cannon_tries_to_capture_without_jumping() {
        final var xiangqi = Xiangqi.defaultPosition();
        final var ex = assertThrows(IllegalArgumentException.class, () ->
                xiangqi.move(Move.of("b3", "b8"))
        );
        assertEquals("Invalid move: b3 -> b8", ex.getMessage());
    }

    @Test
    public void should_throw_error_when_cannon_tries_to_jump_over_more_than_one_piece() {
        final var fen = Utils.boardStrToFen("""
                rnbakabnr
                .........
                .c.....c.
                p...p.p.p
                .........
                .p.......
                P.P.P.P.P
                .C.....C.
                .........
                RNBAKABNR""");
                
        final var xiangqi = Xiangqi.fromUciFen(fen);
        final var ex = assertThrows(IllegalArgumentException.class, () ->
                xiangqi.move(Move.of("b3", "b10"))
        );
        assertEquals("Invalid move: b3 -> b10", ex.getMessage());
    }
}