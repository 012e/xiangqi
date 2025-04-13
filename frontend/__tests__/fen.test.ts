import Xiangqi from '../src/lib/xiangqi';
import {describe, expect, it} from 'vitest';

describe('generate valid fen', () => {
  it('should generate a valid initial FEN string', () => {
    const xiangqi = new Xiangqi();
    const s = xiangqi.exportFen();
    expect(s).toBe(
      'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0',
    );
  });

    it("should be able to create game from custom fen", () => {
        const xiangqi = new Xiangqi("rnbakabnr/9/1c5c1/p1p1P1p1p/4p4/9/P1P3P1P/1C5C1/9/RNBAKABNR w 3");
        const s = xiangqi.exportFen();
        expect(s).toBe(
            'rnbakabnr/9/1c5c1/p1p1P1p1p/4p4/9/P1P3P1P/1C5C1/9/RNBAKABNR w 3',
        );
    })
});
