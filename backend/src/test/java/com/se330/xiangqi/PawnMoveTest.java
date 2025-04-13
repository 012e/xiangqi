package com.se330.xiangqi;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class PawnMoveTest {
    @Test
    public void should_allow_correct_pawn_move_forward() {
        final var board = Xiangqi.defaultPosition();

        board.move(Move.of("a4", "a5"));

        final var expected = """
                rnbakabnr
                .........
                .c.....c.
                p.p.p.p.p
                .........
                P........
                ..P.P.P.P
                .C.....C.
                .........
                RNBAKABNR""";

        assertEquals(expected, board.toString());
    }

    @Test
    public void should_allow_soldier_to_move_horizontally_after_crossing_river() {
        final var fen = Utils.boardStrToFen("""
                rnbakabnr
                .........
                .c.....c.
                P.p.p.p.p
                .........
                .........
                ..P.P.P.P
                .C.....C.
                .........
                RNBAKABNR""");

        final var xiangqi = Xiangqi.fromUciFen(fen);
        xiangqi.move(Move.of("a7", "b7"));

        final var expected = """
                rnbakabnr
                .........
                .c.....c.
                .Pp.p.p.p
                .........
                .........
                ..P.P.P.P
                .C.....C.
                .........
                RNBAKABNR""";

        assertEquals(expected, xiangqi.toString());
    }

    @Test
    public void should_throw_error_for_invalid_pawn_backward_move() {
        final var xiangqi = Xiangqi.defaultPosition();
        final var ex = assertThrows(IllegalArgumentException.class, () ->
                xiangqi.move(Move.of("a4", "a3"))
        );
        assertEquals("Invalid move: a4 -> a3", ex.getMessage());
    }

    @Test
    public void should_throw_error_for_invalid_pawn_diagonal_move() {
        final var xiangqi = Xiangqi.defaultPosition();
        final var ex = assertThrows(IllegalArgumentException.class, () ->
                xiangqi.move(Move.of("a4", "b5"))
        );
        assertEquals("Invalid move: a4 -> b5", ex.getMessage());
    }

    @Test
    public void should_throw_error_for_pawn_horizontal_move_before_crossing_river() {
        final var xiangqi = Xiangqi.defaultPosition();
        final var ex = assertThrows(IllegalArgumentException.class, () ->
                xiangqi.move(Move.of("a4", "b4"))
        );
        assertEquals("Invalid move: a4 -> b4", ex.getMessage());
    }
}
