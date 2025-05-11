package com.se330.xiangqi;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class AdvisorMoveTest {
    @Test
    public void should_allow_advisor_to_move_diagonally_within_palace() {
        final var xiangqi = Xiangqi.defaultPosition();
        xiangqi.move(Move.of("d1", "e2"));

        final var expected = """
                rnbakabnr
                .........
                .c.....c.
                p.p.p.p.p
                .........
                .........
                P.P.P.P.P
                .C.....C.
                ....A....
                RNB.KABNR""";
                
        assertEquals(expected, xiangqi.toString());
    }

    @Test
    public void should_throw_error_when_advisor_tries_to_move_outside_palace() {
        final var xiangqi = Xiangqi.defaultPosition();
        final var ex = assertThrows(IllegalArgumentException.class, () ->
                xiangqi.move(Move.of("d1", "e3"))
        );
        assertEquals("Invalid move: d1 -> e3", ex.getMessage());
    }
}