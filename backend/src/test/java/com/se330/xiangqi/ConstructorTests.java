package com.se330.xiangqi;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ConstructorTests {
    @Test
    public void default_constructor_should_return_correct_fen() {
        String expected = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0";

        String actual = Xiangqi.defaultPosition().exportFen();

        assertEquals(expected, actual);
    }

    @Test
    public void default_constructor_should_return_correct_uci_fen() {
        String expected = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0";

        String actual = Xiangqi.defaultPosition().exportFen();

        assertEquals(expected, actual);
    }

    @Test
    public void fen_uci_constructor_should_return_correct_uci_fen() {

        String expectedFen = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0";
        String expectedUciFen = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0 | a4a5 a7a6";

        var board = Xiangqi
                .fromUciFen(expectedUciFen);

        assertEquals(expectedFen, board.exportFen());
        assertEquals(expectedUciFen, board.exportUciFen());
    }
}
