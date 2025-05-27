import Xiangqi from '../src/lib/xiangqi';
import { describe, expect, it } from 'vitest';

describe('Xiangqi History Functionality', () => {
  describe('Move History Tracking', () => {
    it('should start with empty history', () => {
      const xiangqi = new Xiangqi();
      const history = xiangqi.getHistory();
      expect(history).toEqual([]);
      expect(history.length).toBe(0);
    });

    it('should track single move in history', () => {
      const xiangqi = new Xiangqi();
      xiangqi.move({ from: 'a4', to: 'a5' });

      const history = xiangqi.getHistory();
      expect(history).toEqual(['a4a5']);
      expect(history.length).toBe(1);
    });

    it('should track multiple moves in order', () => {
      const xiangqi = new Xiangqi();
      xiangqi.move({ from: 'a4', to: 'a5' });
      xiangqi.move({ from: 'a7', to: 'a6' });
      xiangqi.move({ from: 'b1', to: 'c3' });

      const history = xiangqi.getHistory();
      expect(history).toEqual(['a4a5', 'a7a6', 'b1c3']);
      expect(history.length).toBe(3);
    });

    it('should return copy of history array (immutable)', () => {
      const xiangqi = new Xiangqi();
      xiangqi.move({ from: 'a4', to: 'a5' });

      const history1 = xiangqi.getHistory();
      const history2 = xiangqi.getHistory();

      // Should be different array instances
      expect(history1).not.toBe(history2);
      // But with same content
      expect(history1).toEqual(history2);

      // Modifying returned array shouldn't affect original
      history1.push('fake_move');
      expect(xiangqi.getHistory()).toEqual(['a4a5']);
    });

    it('should track complex game sequence', () => {
      const xiangqi = new Xiangqi();

      // Simulate a game opening
      xiangqi.move({ from: 'b3', to: 'e3' }); // Cannon move
      xiangqi.move({ from: 'b8', to: 'e8' }); // Black cannon
      xiangqi.move({ from: 'b1', to: 'c3' }); // Knight
      xiangqi.move({ from: 'b10', to: 'c8' }); // Black knight
      xiangqi.move({ from: 'c4', to: 'c5' }); // Pawn

      const history = xiangqi.getHistory();
      expect(history).toEqual(['b3e3', 'b8e8', 'b1c3', 'b10c8', 'c4c5']);
      expect(history.length).toBe(5);
    });
  });

  describe('UCI FEN Export', () => {
    it('should export initial position with empty history', () => {
      const xiangqi = new Xiangqi();
      const uciFen = xiangqi.exportUciFen();
      expect(uciFen).toBe(
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0',
      );
    });

    it('should export position with single move history', () => {
      const xiangqi = new Xiangqi();
      xiangqi.move({ from: 'a4', to: 'a5' });

      const uciFen = xiangqi.exportUciFen();
      expect(uciFen).toContain('| a4a5');
      expect(uciFen).toContain(' b 1 |'); // Turn changed to black, move count 1
    });

    it('should export position with multiple moves in history', () => {
      const xiangqi = new Xiangqi();
      xiangqi.move({ from: 'a4', to: 'a5' });
      xiangqi.move({ from: 'a7', to: 'a6' });
      xiangqi.move({ from: 'c4', to: 'c5' });

      const uciFen = xiangqi.exportUciFen();
      expect(uciFen).toContain('| a4a5 a7a6 c4c5');
      expect(uciFen).toContain(' b 3 |'); // Turn black, move count 3
    });

    it('should maintain board state consistency in UCI FEN', () => {
      const xiangqi = new Xiangqi();
      xiangqi.move({ from: 'b3', to: 'e3' }); // Move cannon

      const uciFen = xiangqi.exportUciFen();

      // Should reflect the cannon move in board position
      expect(uciFen).toContain('/4C2C1/'); // Cannon moved from b3 to e3
      expect(uciFen).toContain('| b3e3'); // Move in history
    });
  });

  describe('UCI FEN Import via fromUciFen', () => {
    it('should create game from UCI FEN with empty history', () => {
      const uciFen =
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0 | ';
      const xiangqi = Xiangqi.fromUciFen(uciFen);
      expect(xiangqi.getHistory()).toEqual([]);
      expect(xiangqi.exportUciFen()).toBe(
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0',
      );
    });

    it('should create game from UCI FEN with single move history', () => {
      const uciFen =
        'rnbakabnr/9/1c5c1/p1p1P1p1p/9/9/P1P3P1P/1C5C1/9/RNBAKABNR b 1 | c4c5';
      const xiangqi = Xiangqi.fromUciFen(uciFen);

      expect(xiangqi.getHistory()).toEqual(['c4c5']);
      expect(xiangqi.exportUciFen()).toBe(uciFen);
    });

    it('should create game from UCI FEN with multiple moves history', () => {
      const uciFen =
        'rnbakabnr/9/1c5c1/p1p1P1p1p/4p4/9/P1P3P1P/1C5C1/9/RNBAKABNR w 3 | c4c5 a7a6 e4e5';
      const xiangqi = Xiangqi.fromUciFen(uciFen);

      expect(xiangqi.getHistory()).toEqual(['c4c5', 'a7a6', 'e4e5']);
      expect(xiangqi.exportUciFen()).toBe(uciFen);
    });

    it('should handle UCI FEN without pipe separator', () => {
      const uciFen =
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0';
      const xiangqi = Xiangqi.fromUciFen(uciFen);

      expect(xiangqi.getHistory()).toEqual([]);
      expect(xiangqi.exportUciFen()).toBe(uciFen);
    });

    it('should handle UCI FEN with extra whitespace', () => {
      const uciFen =
        '   rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0 |  a4a5   b7b6  ';
      const xiangqi = Xiangqi.fromUciFen(uciFen);

      expect(xiangqi.getHistory()).toEqual(['a4a5', 'b7b6']);
    });

    it('should preserve current player from UCI FEN', () => {
      const uciFenWhite =
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0 | ';
      const uciFenBlack =
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR b 1 | a4a5';

      const xiangqiWhite = Xiangqi.fromUciFen(uciFenWhite);
      const xiangqiBlack = Xiangqi.fromUciFen(uciFenBlack);

      expect(xiangqiWhite.exportUciFen()).toContain(' w 0');
      expect(xiangqiBlack.exportUciFen()).toContain(' b 1 ');
    });

    it('should preserve move count from UCI FEN', () => {
      const uciFen =
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 42 | ';
      const xiangqi = Xiangqi.fromUciFen(uciFen);

      expect(xiangqi.exportUciFen()).toContain(' w 42');
    });
  });

  describe('UCI FEN Constructor Integration', () => {
    it('should work with regular constructor when given UCI FEN', () => {
      const uciFen =
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0 | a4a5 b7b6';
      const xiangqi = new Xiangqi(uciFen);

      expect(xiangqi.getHistory()).toEqual(['a4a5', 'b7b6']);
      expect(xiangqi.exportUciFen()).toBe(uciFen);
    });

    it('should handle mixed FEN formats in constructor', () => {
      // Regular FEN
      const regularFen =
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0';
      const xiangqi1 = new Xiangqi(regularFen);
      expect(xiangqi1.getHistory()).toEqual([]);

      // UCI FEN
      const uciFen = regularFen + ' | a4a5';
      const xiangqi2 = new Xiangqi(uciFen);
      expect(xiangqi2.getHistory()).toEqual(['a4a5']);
    });
  });

  describe('Round-trip Consistency', () => {
    it('should maintain consistency through export/import cycle', () => {
      const xiangqi1 = new Xiangqi();
      xiangqi1.move({ from: 'a4', to: 'a5' });
      xiangqi1.move({ from: 'a7', to: 'a6' });
      xiangqi1.move({ from: 'b3', to: 'e3' });

      const uciFen = xiangqi1.exportUciFen();
      const xiangqi2 = Xiangqi.fromUciFen(uciFen);

      expect(xiangqi2.getHistory()).toEqual(xiangqi1.getHistory());
      expect(xiangqi2.exportUciFen()).toBe(xiangqi1.exportUciFen());
      expect(xiangqi2.boardAsStr()).toBe(xiangqi1.boardAsStr());
    });

    it('should maintain consistency through multiple export/import cycles', () => {
      const originalXiangqi = new Xiangqi();
      originalXiangqi.move({ from: 'b1', to: 'c3' });
      originalXiangqi.move({ from: 'b10', to: 'c8' });

      // First cycle
      const uciFen1 = originalXiangqi.exportUciFen();
      const xiangqi1 = Xiangqi.fromUciFen(uciFen1);

      // Make additional move
      xiangqi1.move({ from: 'c4', to: 'c5' });

      // Second cycle
      const uciFen2 = xiangqi1.exportUciFen();
      const xiangqi2 = Xiangqi.fromUciFen(uciFen2);

      expect(xiangqi2.getHistory()).toEqual(['b1c3', 'b10c8', 'c4c5']);
      expect(xiangqi2.exportUciFen()).toBe(uciFen2);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty move history section', () => {
      const uciFen =
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0 | ';
      const xiangqi = Xiangqi.fromUciFen(uciFen);

      expect(xiangqi.getHistory()).toEqual([]);
    });

    it('should handle UCI FEN with only spaces in history section', () => {
      const uciFen =
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0 |    ';
      const xiangqi = Xiangqi.fromUciFen(uciFen);

      expect(xiangqi.getHistory()).toEqual([]);
    });

    it('should filter out empty move strings', () => {
      const uciFen =
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0 | a4a5  b7b6   c4c5';
      const xiangqi = Xiangqi.fromUciFen(uciFen);

      expect(xiangqi.getHistory()).toEqual(['a4a5', 'b7b6', 'c4c5']);
    });

    it('should handle missing move count in UCI FEN', () => {
      const uciFen =
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w | a4a5';
      const xiangqi = Xiangqi.fromUciFen(uciFen);

      expect(xiangqi.getHistory()).toEqual(['a4a5']);
      expect(xiangqi.exportUciFen()).toContain(' w 0 |');
    });

    it('should default to white player when missing', () => {
      const uciFen =
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR | a4a5';
      const xiangqi = Xiangqi.fromUciFen(uciFen);

      expect(xiangqi.exportUciFen()).toContain(' w 0 |');
    });
  });

  describe('Integration with Game Logic', () => {
    it('should continue tracking history after import', () => {
      const uciFen =
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w 0 | a4a5';
      const xiangqi = Xiangqi.fromUciFen(uciFen);

      // Make additional moves
      xiangqi.move({ from: 'c4', to: 'c5' });
      xiangqi.move({ from: 'b8', to: 'b6' });

      expect(xiangqi.getHistory()).toEqual(['a4a5', 'c4c5', 'b8b6']);
    });

    it('should maintain history through game state changes', () => {
      const xiangqi = new Xiangqi();

      // Series of moves
      xiangqi.move({ from: 'a4', to: 'a5' });
      xiangqi.move({ from: 'a7', to: 'a6' });

      // Export and re-import
      const uciFen = xiangqi.exportUciFen();
      const newXiangqi = Xiangqi.fromUciFen(uciFen);

      // Continue playing
      newXiangqi.move({ from: 'b3', to: 'e3' });

      expect(newXiangqi.getHistory()).toEqual(['a4a5', 'a7a6', 'b3e3']);
    });

    it('should work with complex board positions', () => {
      // Start with a complex position
      const complexFen =
        'rn1akabnr/9/1c5c1/p1p1P1p1p/4p4/9/P1P3P1P/1C5C1/9/RNBAKABNR b 5';
      const xiangqi = new Xiangqi(complexFen);

      // Add some moves
      xiangqi.move({ from: 'h10', to: 'g8' });
      xiangqi.move({ from: 'h1', to: 'g3' });

      const history = xiangqi.getHistory();
      expect(history).toEqual(['h10g8', 'h1g3']);

      // Verify round-trip
      const uciFen = xiangqi.exportUciFen();
      const newXiangqi = Xiangqi.fromUciFen(uciFen);
      expect(newXiangqi.getHistory()).toEqual(history);
    });
  });
});
