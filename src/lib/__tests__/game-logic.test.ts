import { describe, it, expect } from "vitest";
import {
  BoardState,
  INITIAL_REFERENCE_SESSION,
  calculateWinner,
  coordToIndex,
  createEmptyBoard,
  findImmediateWinningMove,
  generateMatchExport,
  getAIMove,
  getAvailableMoves,
  getBestMoveWithAnalysis,
  indexToCoord,
} from "../game-logic";

describe("game-logic", () => {
  it("creates an empty 9-cell board", () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(9);
    expect(board.every((c) => c === null)).toBe(true);
  });

  it("converts between indices and algebraic coordinates A1-C3", () => {
    expect(indexToCoord(0)).toBe("A1");
    expect(indexToCoord(4)).toBe("B2");
    expect(indexToCoord(8)).toBe("C3");
    expect(coordToIndex("A1")).toBe(0);
    expect(coordToIndex("b2")).toBe(4);
    expect(coordToIndex("C3")).toBe(8);
  });

  it("detects horizontal, vertical, and diagonal wins accurately", () => {
    const rowWin: BoardState = [
      "X",
      "X",
      "X",
      "O",
      "O",
      null,
      null,
      null,
      null,
    ];
    expect(calculateWinner(rowWin)).toEqual({
      winner: "X",
      winningLine: [0, 1, 2],
      lineType: "row-0",
    });

    const colWin: BoardState = [
      "O",
      "X",
      null,
      "O",
      "X",
      null,
      "O",
      null,
      "X",
    ];
    expect(calculateWinner(colWin)).toEqual({
      winner: "O",
      winningLine: [0, 3, 6],
      lineType: "col-0",
    });

    const diagWin: BoardState = [
      "X",
      "O",
      null,
      "O",
      "X",
      null,
      null,
      null,
      "X",
    ];
    expect(calculateWinner(diagWin)).toEqual({
      winner: "X",
      winningLine: [0, 4, 8],
      lineType: "diag-main",
    });
  });

  it("detects draw state when all 9 squares are filled with no winner", () => {
    const drawBoard: BoardState = [
      "X",
      "O",
      "X",
      "X",
      "O",
      "O",
      "O",
      "X",
      "X",
    ];
    expect(calculateWinner(drawBoard)).toEqual({
      winner: "DRAW",
      winningLine: null,
      lineType: null,
    });
  });

  it("evaluates the UI reference session board state accurately (Optimal depth 4, blocking C1)", () => {
    const latestSnapshot =
      INITIAL_REFERENCE_SESSION.moves[
        INITIAL_REFERENCE_SESSION.moves.length - 1
      ].boardSnapshot;
    // Reference board has O at A1(0) & B1(3), X at B2(4) & C3(8)
    expect(calculateWinner(latestSnapshot).winner).toBeNull();
    expect(getAvailableMoves(latestSnapshot)).toHaveLength(5);

    const analysis = getBestMoveWithAnalysis(latestSnapshot, "X");
    // O threatens C1 (index 6) to complete column 0 (A1-B1-C1), so X must block at C1 (index 6)
    expect(analysis.bestMoveIndex).toBe(6);
    expect(analysis.bestCoord).toBe("C1");
    expect(analysis.optimalDepth).toBe(4);
  });

  it("medium and unbeatable AI always take immediate winning moves and block opponent threats", () => {
    // O has A1(0) and B1(3), so C1(6) is an immediate winning move for O
    const boardWithOWin: BoardState = [
      "O",
      null,
      null,
      "O",
      "X",
      null,
      null,
      "X",
      "X",
    ];
    // Wait: X on 4,7,8 is not a win, O on 0,3 can win at 6
    expect(findImmediateWinningMove(boardWithOWin, "O")).toBe(6);
    expect(getAIMove(boardWithOWin, "medium", "O")).toBe(6);
    expect(getAIMove(boardWithOWin, "unbeatable", "O")).toBe(6);

    // X threatens top row (0, 1 -> 2), O must block at index 2
    const boardWithXThreat: BoardState = [
      "X",
      "X",
      null,
      null,
      "O",
      null,
      null,
      null,
      null,
    ];
    expect(getAIMove(boardWithXThreat, "medium", "O")).toBe(2);
    expect(getAIMove(boardWithXThreat, "unbeatable", "O")).toBe(2);
  });

  it("unbeatable AI never loses against any possible sequence of moves", () => {
    // Simulate games where X plays every possible first move and unbeatable O responds
    for (let firstMove = 0; firstMove < 9; firstMove++) {
      const board = createEmptyBoard();
      board[firstMove] = "X";

      let turn: "X" | "O" = "O";
      while (calculateWinner(board).winner === null) {
        if (turn === "O") {
          const aiMove = getAIMove(board, "unbeatable", "O");
          expect(aiMove).not.toBeNull();
          board[aiMove!] = "O";
          turn = "X";
        } else {
          // X plays optimal minimax move too
          const xMove = getAIMove(board, "unbeatable", "X");
          expect(xMove).not.toBeNull();
          board[xMove!] = "X";
          turn = "O";
        }
      }

      const finalResult = calculateWinner(board).winner;
      expect(finalResult).not.toBe("X");
      expect(["O", "DRAW"]).toContain(finalResult);
    }
  });

  it("exports valid PGN and JSON match representations", () => {
    const exported = generateMatchExport({
      roundNumber: INITIAL_REFERENCE_SESSION.roundNumber,
      mode: INITIAL_REFERENCE_SESSION.mode,
      difficulty: INITIAL_REFERENCE_SESSION.difficulty,
      moves: INITIAL_REFERENCE_SESSION.moves,
      winner: null,
      scores: INITIAL_REFERENCE_SESSION.scores,
      timerSeconds: INITIAL_REFERENCE_SESSION.timerSeconds,
    });

    expect(exported.pgn).toContain('[Round "3"]');
    expect(exported.pgn).toContain("1. B2 {00:08} A1 {00:32}");
    expect(exported.pgn).toContain("2. C3 {00:54} B1 {01:28}");

    const parsedJson = JSON.parse(exported.json);
    expect(parsedJson.application).toBe("ZeroSum");
    expect(parsedJson.match.movesCount).toBe(4);
    expect(parsedJson.sessionScoreboard.completedMatches).toBe(20);
  });

  it("handles terminal boards and edge-case coordinates safely", () => {
    const fullDrawBoard: BoardState = [
      "X",
      "O",
      "X",
      "X",
      "O",
      "O",
      "O",
      "X",
      "X",
    ];
    expect(getAIMove(fullDrawBoard, "easy", "O")).toBeNull();
    expect(getAIMove(fullDrawBoard, "medium", "O")).toBeNull();
    expect(getAIMove(fullDrawBoard, "unbeatable", "O")).toBeNull();

    const terminalAnalysis = getBestMoveWithAnalysis(fullDrawBoard, "X");
    expect(terminalAnalysis.bestMoveIndex).toBeNull();
    expect(terminalAnalysis.bestCoord).toBeNull();
    expect(terminalAnalysis.optimalDepth).toBe(0);

    expect(coordToIndex("Z9")).toBe(-1);
    expect(indexToCoord(99)).toBe("C99");
  });
});

