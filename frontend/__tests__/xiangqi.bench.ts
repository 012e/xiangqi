import {bench, describe} from 'vitest';
import Xiangqi from '../src/lib/xiangqi';
import {Chess} from 'chess.js';

describe('logic benchmarks', () => {
    describe('board creation', () => {
        bench('board creation', () => {
            new Xiangqi();
        });

        bench('chess.js', () => {
            new Chess();
        });
    });

    describe("move", () => {
        bench("ours", () => {
            const board = new Xiangqi();
            board.move({from: "a4", to: "a5"});
        });

        bench("chess.js", () => {
            const board = new Chess();
            board.move({from: "a2", to: "a4"});
        })

    })
});
