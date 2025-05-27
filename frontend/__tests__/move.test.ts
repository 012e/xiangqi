import Xiangqi from '../src/lib/xiangqi';
import { describe, expect, it } from 'vitest';
import { boardStrToFen } from './utils';
import dedent from 'dedent';

describe('Xiangqi', () => {
  describe('initial board setup', () => {
    it('should export correct board initially', () => {
      const xiangqi = new Xiangqi();
      const s = xiangqi.boardAsStr();
      const expected = dedent`
        rnbakabnr
        .........
        .c.....c.
        p.p.p.p.p
        .........
        .........
        P.P.P.P.P
        .C.....C.
        .........
        RNBAKABNR`;
      expect(s).toBe(expected);
    });
  });

  describe('Soldier/Pawn movement', () => {
    it('should allow correct pawn move forward', () => {
      const xiangqi = new Xiangqi();
      xiangqi.move({ from: 'a4', to: 'a5' });
      const s = xiangqi.boardAsStr();
      const expected = dedent`
        rnbakabnr
        .........
        .c.....c.
        p.p.p.p.p
        .........
        P........
        ..P.P.P.P
        .C.....C.
        .........
        RNBAKABNR`;
      expect(s).toBe(expected);
    });

    it('should allow soldier to move horizontally after crossing river', () => {
      const fen = boardStrToFen(dedent`
        rnbakabnr
        .........
        .c.....c.
        P.p.p.p.p
        .........
        .........
        ..P.P.P.P
        .C.....C.
        .........
        RNBAKABNR`);
      const xiangqi = new Xiangqi(fen);
      xiangqi.move({ from: 'a7', to: 'b7' });

      const s = xiangqi.boardAsStr();
      const expected = dedent`
        rnbakabnr
        .........
        .c.....c.
        .Pp.p.p.p
        .........
        .........
        ..P.P.P.P
        .C.....C.
        .........
        RNBAKABNR`;
      expect(s).toBe(expected);
    });

    it('should throw error for invalid pawn backward move', () => {
      const xiangqi = new Xiangqi();
      expect(() => xiangqi.move({ from: 'a4', to: 'a3' })).toThrowError(
        'Invalid move: a4 -> a3',
      );
    });

    it('should throw error for invalid pawn diagonal move', () => {
      const xiangqi = new Xiangqi();
      expect(() => xiangqi.move({ from: 'a4', to: 'b5' })).toThrowError(
        'Invalid move: a4 -> b5',
      );
    });

    it('should throw error for pawn horizontal move before crossing river', () => {
      const xiangqi = new Xiangqi();
      expect(() => xiangqi.move({ from: 'a4', to: 'b4' })).toThrowError(
        'Invalid move: a4 -> b4',
      );
    });
  });

  describe('Chariot/Rook movement', () => {
    it('should allow chariot to move vertically', () => {
      const xiangqi = new Xiangqi();
      xiangqi.move({ from: 'a1', to: 'a2' });
      const s = xiangqi.boardAsStr();
      const expected = dedent`
        rnbakabnr
        .........
        .c.....c.
        p.p.p.p.p
        .........
        .........
        P.P.P.P.P
        .C.....C.
        R........
        .NBAKABNR`;
      expect(s).toBe(expected);
    });

    it('should allow chariot to move horizontally', () => {
      const xiangqi = new Xiangqi();
      // Move pawn to clear path
      xiangqi.move({ from: 'a1', to: 'a2' });
      xiangqi.move({ from: 'a10', to: 'a9' });
      // Now move chariot horizontally
      xiangqi.move({ from: 'a2', to: 'i2' });

      const s = xiangqi.boardAsStr();
      const expected = dedent`
        .nbakabnr
        r........
        .c.....c.
        p.p.p.p.p
        .........
        .........
        P.P.P.P.P
        .C.....C.
        ........R
        .NBAKABNR`;
      expect(s).toBe(expected);
    });

    it('should allow chariot to capture opponent piece', () => {
      const fen = boardStrToFen(dedent`
        rnbakabnr
        .........
        .c.....c.
        p.p.p.p.p
        .........
        R........
        P.P.P.P.P
        .C.....C.
        .........
        .NBAKABNR`);
      const xiangqi = new Xiangqi(fen);
      xiangqi.move({ from: 'a5', to: 'a7' });

      const s = xiangqi.boardAsStr();
      const expected = dedent`
        rnbakabnr
        .........
        .c.....c.
        R.p.p.p.p
        .........
        .........
        P.P.P.P.P
        .C.....C.
        .........
        .NBAKABNR`;
      expect(s).toBe(expected);
    });

    it('should throw error when chariot tries to jump over pieces', () => {
      const xiangqi = new Xiangqi();
      expect(() => xiangqi.move({ from: 'a1', to: 'a10' })).toThrowError(
        'Invalid move: a1 -> a10',
      );
    });
  });

  describe('Horse/Knight movement', () => {
    it('should allow horse to move in L-shape', () => {
      const xiangqi = new Xiangqi();
      // Move pawn to make way for hors
      xiangqi.move({ from: 'b1', to: 'c3' });
      const s = xiangqi.boardAsStr();
      const expected = dedent`
        rnbakabnr
        .........
        .c.....c.
        p.p.p.p.p
        .........
        .........
        P.P.P.P.P
        .CN....C.
        .........
        R.BAKABNR`;
      expect(s).toBe(expected);
    });

    it('should throw error when horse is blocked (blocked top/bottom)', () => {
      const xiangqi = new Xiangqi();
      expect(() => xiangqi.move({ from: 'b1', to: 'd2' })).toThrowError(
        'Invalid move: b1 -> d2',
      );
    });

    it('should throw error when horse is blocked (blocked left/right)', () => {
      const fen = boardStrToFen(dedent`
        rnbakabnr
        .........
        .c.....c.
        p.p.p.p.p
        .........
        .........
        P.P.P.P.P
        .CN....C.
        .........
        R.BAKABNR`);
      const xiangqi = new Xiangqi(fen);
      expect(() => xiangqi.move({ from: 'c3', to: 'a2' })).toThrowError(
        'Invalid move: c3 -> a2',
      );
    });
  });

  describe('Elephant movement', () => {
    it('should allow elephant to move diagonally', () => {
      const xiangqi = new Xiangqi();
      // Move pawn to clear path
      xiangqi.move({ from: 'c1', to: 'a3' });
      xiangqi.move({ from: 'c10', to: 'a8' });

      const s = xiangqi.boardAsStr();
      const expected = dedent`
        rn.akabnr
        .........
        bc.....c.
        p.p.p.p.p
        .........
        .........
        P.P.P.P.P
        BC.....C.
        .........
        RN.AKABNR`;
      expect(s).toBe(expected);
    });

    it('should throw error when elephant tries to cross river', () => {
      const fen = boardStrToFen(dedent`
        rn.akabnr
        .........
        bc.....c.
        p.p.p.p.p
        .........
        ..B......
        P...P.P.P
        .C.....C.
        .........
        RN.AKABNR`);
      const xiangqi = new Xiangqi(fen);

      // Now try to cross river
      expect(() => xiangqi.move({ from: 'c5', to: 'd6' })).toThrowError(
        'Invalid move: c5 -> d6',
      );
    });

    it('should throw error when elephant is blocked at the crossing point', () => {
      const fen = boardStrToFen(dedent`
        rn.akabnr
        .........
        bc.....c.
        p.p.p.p.p
        .........
        .........
        P..PP.P.P
        .CB....C.
        .........
        RN.AKABNR`);
      const xiangqi = new Xiangqi(fen);

      // Now try to cross river
      expect(() => xiangqi.move({ from: 'c3', to: 'e5' })).toThrowError(
        'Invalid move: c3 -> e5',
      );
    });
  });

  describe('Advisor movement', () => {
    it('should allow advisor to move diagonally within palace', () => {
      const xiangqi = new Xiangqi();
      xiangqi.move({ from: 'd1', to: 'e2' });

      const s = xiangqi.boardAsStr();
      const expected = dedent`
        rnbakabnr
        .........
        .c.....c.
        p.p.p.p.p
        .........
        .........
        P.P.P.P.P
        .C.....C.
        ....A....
        RNB.KABNR`;
      expect(s).toBe(expected);
    });

    it('should throw error when advisor tries to move outside palace', () => {
      const xiangqi = new Xiangqi();

      expect(() => xiangqi.move({ from: 'd1', to: 'e3' })).toThrowError(
        'Invalid move: d1 -> e3',
      );
    });
  });

  describe('General/King movement', () => {
    it('should allow general to move horizontally within palace', () => {
      const fen = boardStrToFen(dedent`
        rnbakabnr
        .........
        .c.....c.
        p.p.p.p.p
        .........
        .........
        P.P.P.P.P
        .C.....C.
        ....K....
        RNBA.ABNR`);
      const xiangqi = new Xiangqi(fen);
      xiangqi.move({ from: 'e2', to: 'f2' });

      const s = xiangqi.boardAsStr();
      const expected = dedent`
        rnbakabnr
        .........
        .c.....c.
        p.p.p.p.p
        .........
        .........
        P.P.P.P.P
        .C.....C.
        .....K...
        RNBA.ABNR`;
      expect(s).toBe(expected);
    });

    it('should allow general to move vertically within palace', () => {
      const fen = boardStrToFen(dedent`
        rnbakabnr
        .........
        .c.....c.
        p.p.p.p.p
        .........
        .........
        P.P.P.P.P
        .C.....C.
        ....K....
        RNBA.ABNR`);
      const xiangqi = new Xiangqi(fen);
      xiangqi.move({ from: 'e2', to: 'e3' });

      const s = xiangqi.boardAsStr();
      const expected = dedent`
        rnbakabnr
        .........
        .c.....c.
        p.p.p.p.p
        .........
        .........
        P.P.P.P.P
        .C..K..C.
        .........
        RNBA.ABNR`;
      expect(s).toBe(expected);
    });

    it('should throw error when general tries to move outside palace', () => {
      const fen = boardStrToFen(dedent`
        rnbakabnr
        .........
        .c.....c.
        p.p.p.p.p
        .........
        .........
        P.P...P.P
        .C..K..C.
        .........
        RNBA.ABNR`);
      const xiangqi = new Xiangqi(fen);

      expect(() => xiangqi.move({ from: 'e3', to: 'e4' })).toThrowError(
        'Invalid move: e3 -> e4',
      );
    });

    it('should throw error when general tries to move diagonally', () => {
      const xiangqi = new Xiangqi();
      expect(() => xiangqi.move({ from: 'e1', to: 'f2' })).toThrowError(
        'Invalid move: e1 -> f2',
      );
    });
  });

  describe('Cannon movement', () => {
    it('should allow cannon to move vertically', () => {
      const xiangqi = new Xiangqi();
      xiangqi.move({ from: 'b3', to: 'b10' });

      const s = xiangqi.boardAsStr();
      const expected = dedent`
        rCbakabnr
        .........
        .c.....c.
        p.p.p.p.p
        .........
        .........
        P.P.P.P.P
        .......C.
        .........
        RNBAKABNR`;
      expect(s).toBe(expected);
    });

    it('should allow cannon to capture by jumping over exactly one piece', () => {
      const fen = boardStrToFen(dedent`
        rnbakabnr
        .........
        .c.....c.
        p...p.p.p
        .........
        .p.......
        P.P.P.P.P
        .C.....C.
        .........
        RNBAKABNR`);
      const xiangqi = new Xiangqi(fen);
      // Setup a position for cannon to capture
      xiangqi.move({ from: 'b3', to: 'b8' });

      const s = xiangqi.boardAsStr();
      const expected = dedent`
        rnbakabnr
        .........
        .C.....c.
        p...p.p.p
        .........
        .p.......
        P.P.P.P.P
        .......C.
        .........
        RNBAKABNR`;
      expect(s).toBe(expected);
    });

    it('should throw error when cannon tries to capture without jumping', () => {
      const xiangqi = new Xiangqi();

      expect(() => xiangqi.move({ from: 'b3', to: 'b8' })).toThrowError(
        'Invalid move: b3 -> b8',
      );
    });

    it('should throw error when cannon tries to jump over more than one piece', () => {
      const fen = boardStrToFen(dedent`
        rnbakabnr
        .........
        .c.....c.
        p...p.p.p
        .........
        .p.......
        P.P.P.P.P
        .C.....C.
        .........
        RNBAKABNR`);
      const xiangqi = new Xiangqi(fen);

      expect(() => xiangqi.move({ from: 'b3', to: 'b10' })).toThrowError(
        'Invalid move: b3 -> b10',
      );
    });
  });

  describe('Special rules', () => {
    it('should detect flying general rule violation', () => {
      /*
       * Setup a position where generals face each other
       * This would require custom board setup
       * Mock test for flying general rule
       */
      const fen = boardStrToFen(
        dedent`
        ....k....
        .........
        .........
        .........
        .........
        .........
        .........
        .........
        .........
        ...K.....`,
        'w',
      );
      const mockXiangqi = new Xiangqi(fen);
      // Assume we have a method to set custom positions

      expect(() => mockXiangqi.move({ from: 'd1', to: 'e1' })).toThrowError(
        'Invalid move: d1 -> e1',
      );
    });

    it('should not move knight king face to face', () => {
      const fen = boardStrToFen(dedent`
        rnbakabnr
        .........
        .c.....c.
        p.....p.p
        ..p......
        ..P......
        P...N.P.P
        .C.....C.
        .........
        R.BAKABNR`);

      /*
       * This would require a more complex setup
       * Mock test for checkmate detection
       */
      const mockXiangqi = new Xiangqi(fen);
      // Assume we have a method to set custom positions for a checkmate position
      expect(() => mockXiangqi.move({ from: 'e4', to: 'g5' })).toThrowError(
        'Invalid move: e4 -> g5',
      );
    });
    it('should correctly handle checkmate scenarios', () => {
      const fen = boardStrToFen(
        dedent`
        R...k....
        ........R
        .........
        .........
        .........
        .........
        .........
        .........
        .........
        .....K...`,
        'b',
      );

      /*
       * This would require a more complex setup
       * Mock test for checkmate detection
       */
      const mockXiangqi = new Xiangqi(fen);
      // Assume we have a method to set custom positions for a checkmate position
      expect(mockXiangqi.isCheckmate('b')).toBe(true);
    });
  });
  describe('Pinning', () => {
    it('should prevent pinned piece from moving illegally and exposing king to check', () => {
      const fen = boardStrToFen(
        dedent`
        ....k....
        .........
        ....r....
        .........
        ....R....
        .........
        .........
        .........
        .........
        .....K...`,
        'b',
      );
      const xiangqi = new Xiangqi(fen);

      // Attempt to move the pinned bishop which would expose king to check
      expect(() => xiangqi.move({ from: 'e8', to: 'd8' })).toThrowError(
        'Invalid move: e8 -> d8',
      );

      // Moving within the line of pin (staying on the same file) should be allowed
      expect(() => xiangqi.move({ from: 'e8', to: 'e9' })).not.toThrow();
    });

    it('should allow pinned to move in the line of pin', () => {
      const fen = boardStrToFen(
        dedent`
        ....k....
        .........
        ....r....
        .........
        ....R....
        .........
        .........
        .........
        .........
        .....K...`,
        'b',
      );
      const xiangqi = new Xiangqi(fen);
      xiangqi.move({ from: 'e8', to: 'e9' });
      const expected = dedent`
        ....k....
        ....r....
        .........
        .........
        ....R....
        .........
        .........
        .........
        .........
        .....K...`;

      // Moving within the line of pin (staying on the same file) should be allowed
      expect(xiangqi.boardAsStr()).toBe(expected);
    });

    it('should allow pinned piece to capture the attacking piece', () => {
      const fen = boardStrToFen(
        dedent`
        ....k....
        .........
        ....r....
        .........
        ....R....
        .........
        .........
        .........
        .........
        .....K...`,
        'b',
      );
      const xiangqi = new Xiangqi(fen);
      xiangqi.move({ from: 'e8', to: 'e6' });
      const expected = dedent`
        ....k....
        .........
        .........
        .........
        ....r....
        .........
        .........
        .........
        .........
        .....K...`;

      // Moving within the line of pin (staying on the same file) should be allowed
      expect(xiangqi.boardAsStr()).toBe(expected);
    });
  });

  describe('King Must Move - Check and Fork', () => {
    it('should force king to move when in direct check', () => {
      const fen = boardStrToFen(
        dedent`
        rnb.k.bnr
        .........
        .c..R..c.
        p.p.p.p.p
        .........
        .........
        P.P.P.P.P
        .C.....C.
        .........
        RNB.K.BNR`,
        'b',
      );
      const xiangqi = new Xiangqi(fen);
      /*
       * King is in check by rook
       * Ensure that king must move to escape check
       */
      // console.log(xiangqi.move({ from: 'e1', to: 'd1' }));
      expect(() => xiangqi.move({ from: 'e10', to: 'd10' })).not.toThrow();
      // Reset game state
      const newXiangqi = new Xiangqi(fen);
      // Other moves should fail when king is in check
      expect(() => newXiangqi.move({ from: 'a10', to: 'a9' })).toThrowError(
        'Invalid move: a10 -> a9',
      );
      // A piece that blocks the check should be allowed to move
      expect(() => newXiangqi.move({ from: 'c10', to: 'e8' })).not.toThrow();
    });

    it('should force king to move when under a double check (fork)', () => {
      const fen = boardStrToFen(dedent`
        ....k....
        .........
        .........
        .........
        ....R....
        .........
        .........
        .........
        ....R....
        ....K....`);
      const xiangqi = new Xiangqi(fen);
      // Ensure that ONLY king can move during double check
      expect(() => xiangqi.move({ from: 'e1', to: 'e2' })).toThrowError(
        'Invalid move: e1 -> e2',
      );
    });
  });

  describe('Check prevention and detection', () => {
    it('should detect when king is in check', () => {
      const fen = boardStrToFen(dedent`
       ....k....
       .........
       .........
       .........
       ....R....
       .........
       .........
       .........
       .........
       ....K....`);
      const xiangqi = new Xiangqi(fen);

      expect(xiangqi.isInCheck('b')).toBe(true);
      expect(xiangqi.isInCheck('w')).toBe(false);
    });

    it('should prevent moves that would put own king in check', () => {
      const fen = boardStrToFen(
        dedent`
       .....k..
       ........
       ........
       ........
       ....R...
       ........
       ........
       ........
       ........
       ....K...`,
        'b',
      );
      const xiangqi = new Xiangqi(fen);

      // Moving the king into check should be invalid
      expect(() => xiangqi.move({ from: 'f10', to: 'e10' })).toThrowError(
        'Invalid move: f10 -> e10',
      );
    });

    it('should detect checkmate correctly', () => {
      const fen = boardStrToFen(
        dedent`
      R...k...
      .......R
      ........
      ........
      ........
      ........
      ........
      ........
      ........
      ...K....`,
        'b',
      );
      const xiangqi = new Xiangqi(fen);
      // King is in checkmate with rooks at e9 and h7
      expect(xiangqi.isCheckmate('b')).toBe(true);
      expect(xiangqi.isCheckmate('w')).toBe(false);

      // Game should be over
      expect(xiangqi.isGameOver()).toBe(true);
      expect(xiangqi.getWinner()).toBe('white');
    });

    it('should handle stalemate correctly', () => {
      const fen = boardStrToFen(
        dedent`
      ..P.k.P.
      .......R
      ........
      ........
      ........
      ........
      ........
      ........
      ........
      ...K....`,
        'b',
      );
      const xiangqi = new Xiangqi(fen);
      // Black king has no legal moves but is not in check (stalemate)
      expect(xiangqi.isInCheck('b')).toBe(false);
      expect(xiangqi.isStalemate('b')).toBe(true);

      // Game should be over
      expect(xiangqi.isGameOver()).toBe(true);
      expect(xiangqi.getWinner()).toBe('draw');
    });
  });
});
