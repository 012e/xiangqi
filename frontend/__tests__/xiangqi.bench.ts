import { bench, describe } from "vitest";
import Xiangqi from "../src/lib/xiangqi";
import { Chess } from "chess.js";

describe("simple move", () => {
  bench("our library", () => {
    const board = new Xiangqi();
    board.move({from: "a4", to: "a5"});
    board.move({from: "a7", to: "a6"});
    board.move({from: "a5", to: "a6"});
  });

  bench("chess.js", () => {
    const board = new Chess();
    board.move({from: "a2", to: "a3"});
    board.move({from: "a7", to: "a6"});
    board.move({from: "a3", to: "a4"});
  });
});
