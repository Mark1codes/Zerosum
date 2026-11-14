export type Player = "X" | "O";
export type CellValue = Player | null;
export type BoardState = CellValue[];
export type GameMode = "pvp" | "ai";
export type AIDifficulty = "easy" | "medium" | "unbeatable";
export type WorkspaceTab = "dashboard" | "analytics" | "settings";

export interface MoveRecord {
  moveNumber: number;
  player: Player;
  index: number;
  coordinate: string;
  actorLabel: string;
  timestamp: string;
  elapsedSeconds: number;
  boardSnapshot: BoardState;
}

export interface CompletedMatchRecord {
  id: string;
  roundNumber: number;
  winner: Player | "DRAW";
  mode: GameMode;
  difficulty: AIDifficulty;
  movesCount: number;
  durationSeconds: number;
  completedAt: string;
  moves: MoveRecord[];
}

export interface ScoreState {
  xWins: number;
  oWins: number;
  draws: number;
  seriesX: number;
  seriesO: number;
  seriesBestOf: number;
  currentStreakPlayer: Player | null;
  currentStreakCount: number;
}

export type TokenThemeId =
  | "classic"
  | "cyber"
  | "royalty"
  | "elements"
  | "space"
  | "rivals"
  | "pets"
  | "custom";

export interface TokenPreset {
  id: Exclude<TokenThemeId, "custom">;
  name: string;
  xSymbol: string;
  oSymbol: string;
  xLabel: string;
  oLabel: string;
}

export const TOKEN_PRESETS: TokenPreset[] = [
  {
    id: "classic",
    name: "Classic X & O",
    xSymbol: "classic-x",
    oSymbol: "classic-o",
    xLabel: "✕",
    oLabel: "◯",
  },
  {
    id: "cyber",
    name: "Bolt & Shield",
    xSymbol: "icon:zap",
    oSymbol: "icon:shield",
    xLabel: "⚡",
    oLabel: "🛡️",
  },
  {
    id: "royalty",
    name: "Crown & Gem",
    xSymbol: "icon:crown",
    oSymbol: "icon:gem",
    xLabel: "👑",
    oLabel: "💎",
  },
  {
    id: "elements",
    name: "Fire & Ice",
    xSymbol: "🔥",
    oSymbol: "❄️",
    xLabel: "🔥",
    oLabel: "❄️",
  },
  {
    id: "space",
    name: "Rocket & UFO",
    xSymbol: "🚀",
    oSymbol: "🛸",
    xLabel: "🚀",
    oLabel: "🛸",
  },
  {
    id: "rivals",
    name: "Swords & Dragon",
    xSymbol: "⚔️",
    oSymbol: "🐉",
    xLabel: "⚔️",
    oLabel: "🐉",
  },
  {
    id: "pets",
    name: "Cat & Dog",
    xSymbol: "🐱",
    oSymbol: "🐶",
    xLabel: "🐱",
    oLabel: "🐶",
  },
];

export const SELECTABLE_VECTOR_TOKENS = [
  { id: "classic-x", label: "Classic X" },
  { id: "classic-o", label: "Classic O" },
  { id: "icon:zap", label: "Bolt" },
  { id: "icon:shield", label: "Shield" },
  { id: "icon:crown", label: "Crown" },
  { id: "icon:gem", label: "Gem" },
  { id: "icon:flame", label: "Flame" },
  { id: "icon:snowflake", label: "Snowflake" },
  { id: "icon:rocket", label: "Rocket" },
  { id: "icon:swords", label: "Swords" },
  { id: "icon:star", label: "Star" },
  { id: "icon:heart", label: "Heart" },
  { id: "icon:trophy", label: "Trophy" },
  { id: "icon:bot", label: "Bot" },
  { id: "icon:skull", label: "Skull" },
  { id: "icon:sparkles", label: "Sparkles" },
] as const;

export const SELECTABLE_EMOJI_TOKENS = [
  "🔥",
  "❄️",
  "⚡",
  "🛡️",
  "👑",
  "💎",
  "🚀",
  "🛸",
  "⚔️",
  "🐉",
  "🐱",
  "🐶",
  "🦊",
  "🐼",
  "🌟",
  "🌙",
  "🎯",
  "👾",
  "🤖",
  "🍀",
  "🍕",
  "🍩",
  "🦄",
  "👻",
] as const;

export interface GameSettings {
  showCoordinates: boolean;
  showSuggestedMove: boolean;
  highlightSuggestedCell: boolean;
  autoNewRoundDelayMs: number | null;
  playerStartsFirst: Player;
  seriesBestOf: number;
  soundEffects: boolean;
  tokenTheme: TokenThemeId;
  xSymbol: string;
  oSymbol: string;
}

export const COORDINATES = [
  "A1",
  "A2",
  "A3",
  "B1",
  "B2",
  "B3",
  "C1",
  "C2",
  "C3",
] as const;

export type Coordinate = (typeof COORDINATES)[number];

export const WINNING_LINES: {
  indices: [number, number, number];
  lineType:
    | "row-0"
    | "row-1"
    | "row-2"
    | "col-0"
    | "col-1"
    | "col-2"
    | "diag-main"
    | "diag-anti";
}[] = [
  { indices: [0, 1, 2], lineType: "row-0" },
  { indices: [3, 4, 5], lineType: "row-1" },
  { indices: [6, 7, 8], lineType: "row-2" },
  { indices: [0, 3, 6], lineType: "col-0" },
  { indices: [1, 4, 7], lineType: "col-1" },
  { indices: [2, 5, 8], lineType: "col-2" },
  { indices: [0, 4, 8], lineType: "diag-main" },
  { indices: [2, 4, 6], lineType: "diag-anti" },
];

export function createEmptyBoard(): BoardState {
  return Array<CellValue>(9).fill(null);
}

export function indexToCoord(index: number): string {
  return COORDINATES[index] ?? `C${index}`;
}

export function coordToIndex(coord: string): number {
  return COORDINATES.indexOf(coord.toUpperCase() as Coordinate);
}

export interface WinResult {
  winner: Player | "DRAW" | null;
  winningLine: number[] | null;
  lineType:
    | "row-0"
    | "row-1"
    | "row-2"
    | "col-0"
    | "col-1"
    | "col-2"
    | "diag-main"
    | "diag-anti"
    | null;
}

export function calculateWinner(board: BoardState): WinResult {
  for (const { indices, lineType } of WINNING_LINES) {
    const [a, b, c] = indices;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a] as Player,
        winningLine: [a, b, c],
        lineType,
      };
    }
  }

  const isFull = board.every((cell) => cell !== null);
  if (isFull) {
    return {
      winner: "DRAW",
      winningLine: null,
      lineType: null,
    };
  }

  return {
    winner: null,
    winningLine: null,
    lineType: null,
  };
}

export function getAvailableMoves(board: BoardState): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

export function getOpponent(player: Player): Player {
  return player === "X" ? "O" : "X";
}

/**
 * Finds an immediate 1-move winning index for `targetPlayer` if one exists.
 */
export function findImmediateWinningMove(
  board: BoardState,
  targetPlayer: Player
): number | null {
  const available = getAvailableMoves(board);
  for (const idx of available) {
    const copy = [...board];
    copy[idx] = targetPlayer;
    if (calculateWinner(copy).winner === targetPlayer) {
      return idx;
    }
  }
  return null;
}

/**
 * Minimax with alpha-beta pruning.
 * Prefer faster wins (`10 - depth`) and slower losses (`depth - 10`).
 */
export function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  maximizingPlayer: Player,
  alpha = -Infinity,
  beta = Infinity
): { score: number; move: number | null } {
  const { winner } = calculateWinner(board);
  const minimizingPlayer = getOpponent(maximizingPlayer);

  if (winner === maximizingPlayer) {
    return { score: 10 - depth, move: null };
  }
  if (winner === minimizingPlayer) {
    return { score: depth - 10, move: null };
  }
  if (winner === "DRAW") {
    return { score: 0, move: null };
  }

  const available = getAvailableMoves(board);
  // Order center first, then corners, then edges for deterministic optimal play
  const moveOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7].filter((idx) =>
    available.includes(idx)
  );

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove: number | null = moveOrder[0] ?? null;

    for (const idx of moveOrder) {
      const nextBoard = [...board];
      nextBoard[idx] = maximizingPlayer;
      const result = minimax(
        nextBoard,
        depth + 1,
        false,
        maximizingPlayer,
        alpha,
        beta
      );
      if (result.score > bestScore) {
        bestScore = result.score;
        bestMove = idx;
      }
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    }
    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove: number | null = moveOrder[0] ?? null;

    for (const idx of moveOrder) {
      const nextBoard = [...board];
      nextBoard[idx] = minimizingPlayer;
      const result = minimax(
        nextBoard,
        depth + 1,
        true,
        maximizingPlayer,
        alpha,
        beta
      );
      if (result.score < bestScore) {
        bestScore = result.score;
        bestMove = idx;
      }
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break;
    }
    return { score: bestScore, move: bestMove };
  }
}

export interface MoveAnalysis {
  bestMoveIndex: number | null;
  bestCoord: string | null;
  optimalDepth: number;
  score: number;
}

/**
 * Returns the optimal move and remaining search depth for the current player.
 */
export function getBestMoveWithAnalysis(
  board: BoardState,
  currentPlayer: Player
): MoveAnalysis {
  const { winner } = calculateWinner(board);
  const available = getAvailableMoves(board);
  if (winner !== null || available.length === 0) {
    return {
      bestMoveIndex: null,
      bestCoord: null,
      optimalDepth: 0,
      score: 0,
    };
  }

  const { score, move } = minimax(board, 0, true, currentPlayer);
  // Remaining lookahead depth after placing this move
  const optimalDepth = Math.max(1, available.length - 1);

  return {
    bestMoveIndex: move,
    bestCoord: move !== null ? indexToCoord(move) : null,
    optimalDepth,
    score,
  };
}

/**
 * Computes the AI's move according to the selected difficulty level.
 */
export function getAIMove(
  board: BoardState,
  difficulty: AIDifficulty,
  aiPlayer: Player = "O"
): number | null {
  const available = getAvailableMoves(board);
  if (available.length === 0) return null;
  if (calculateWinner(board).winner !== null) return null;

  const humanPlayer = getOpponent(aiPlayer);

  if (difficulty === "easy") {
    // Easy: takes immediate winning move 40% of the time, otherwise random square
    const winningMove = findImmediateWinningMove(board, aiPlayer);
    if (winningMove !== null && Math.random() < 0.4) {
      return winningMove;
    }
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }

  if (difficulty === "medium") {
    // Medium: always takes immediate win & blocks immediate threat, otherwise strategic/random
    const winningMove = findImmediateWinningMove(board, aiPlayer);
    if (winningMove !== null) return winningMove;

    const blockingMove = findImmediateWinningMove(board, humanPlayer);
    if (blockingMove !== null) return blockingMove;

    // 50% chance to take center if free
    if (board[4] === null && Math.random() < 0.5) {
      return 4;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }

  // Unbeatable: Minimax with alpha-beta pruning
  const { move } = minimax(board, 0, true, aiPlayer);
  return move ?? available[0];
}

/**
 * Generates Portable Game Notation (PGN) and JSON export strings for the current match.
 */
export function generateMatchExport(params: {
  roundNumber: number;
  mode: GameMode;
  difficulty: AIDifficulty;
  moves: MoveRecord[];
  winner: Player | "DRAW" | null;
  scores: ScoreState;
  timerSeconds: number;
}): { pgn: string; json: string } {
  const { roundNumber, mode, difficulty, moves, winner, scores, timerSeconds } =
    params;
  const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, ".");
  const resultTag =
    winner === "X"
      ? "1-0"
      : winner === "O"
      ? "0-1"
      : winner === "DRAW"
      ? "1/2-1/2"
      : "*";

  const whiteName = "Player X";
  const blackName =
    mode === "ai" ? `Player O (AI - ${difficulty})` : "Player O";

  const pairs: string[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    const pairNum = Math.floor(i / 2) + 1;
    const first = moves[i];
    const second = moves[i + 1];
    if (second) {
      pairs.push(
        `${pairNum}. ${first.coordinate} {${first.timestamp}} ${second.coordinate} {${second.timestamp}}`
      );
    } else {
      pairs.push(`${pairNum}. ${first.coordinate} {${first.timestamp}}`);
    }
  }

  const pgnLines = [
    `[Event "TicTacToe Pro Session - Best of ${scores.seriesBestOf}"]`,
    `[Site "TicTacToe Pro SaaS Workspace"]`,
    `[Date "${dateStr}"]`,
    `[Round "${roundNumber}"]`,
    `[PlayerX "${whiteName}"]`,
    `[PlayerO "${blackName}"]`,
    `[Mode "${mode === "ai" ? `Player vs AI (${difficulty})` : "Player vs Player"}"]`,
    `[Result "${resultTag}"]`,
    ``,
    `${pairs.join(" ")} ${resultTag}`.trim(),
  ];

  const jsonPayload = {
    application: "ZeroSum",
    exportedAt: new Date().toISOString(),
    match: {
      roundNumber,
      mode,
      aiDifficulty: mode === "ai" ? difficulty : null,
      status: winner ? (winner === "DRAW" ? "draw" : `${winner}_won`) : "in_progress",
      result: resultTag,
      elapsedSeconds: timerSeconds,
      movesCount: moves.length,
      moves: moves.map((m) => ({
        moveNumber: m.moveNumber,
        player: m.player,
        coordinate: m.coordinate,
        cellIndex: m.index,
        description: m.actorLabel,
        timestamp: m.timestamp,
      })),
    },
    sessionScoreboard: {
      playerXWins: scores.xWins,
      draws: scores.draws,
      playerOWins: scores.oWins,
      completedMatches: scores.xWins + scores.draws + scores.oWins,
      series: {
        bestOf: scores.seriesBestOf,
        playerX: scores.seriesX,
        playerO: scores.seriesO,
      },
    },
  };

  return {
    pgn: pgnLines.join("\n"),
    json: JSON.stringify(jsonPayload, null, 2),
  };
}

/**
 * Exact initial session state matching the UI Reference (`media_1794624952096_8489cda2.jpg`)
 * so that first load shows the exact reference game state and allows seamless continuation.
 */
export const INITIAL_REFERENCE_SESSION: {
  mode: GameMode;
  difficulty: AIDifficulty;
  roundNumber: number;
  timerSeconds: number;
  scores: ScoreState;
  moves: MoveRecord[];
  matchHistory: CompletedMatchRecord[];
} = {
  mode: "ai",
  difficulty: "unbeatable",
  roundNumber: 3,
  timerSeconds: 445, // 07:25
  scores: {
    xWins: 12,
    draws: 3,
    oWins: 5,
    seriesX: 1,
    seriesO: 1,
    seriesBestOf: 5,
    currentStreakPlayer: "X",
    currentStreakCount: 1,
  },
  moves: [
    {
      moveNumber: 1,
      player: "X",
      index: 4, // B2
      coordinate: "B2",
      actorLabel: "Player X at B2",
      timestamp: "00:08",
      elapsedSeconds: 8,
      boardSnapshot: [null, null, null, null, "X", null, null, null, null],
    },
    {
      moveNumber: 2,
      player: "O",
      index: 0, // A1
      coordinate: "A1",
      actorLabel: "AI placed at A1",
      timestamp: "00:32",
      elapsedSeconds: 32,
      boardSnapshot: ["O", null, null, null, "X", null, null, null, null],
    },
    {
      moveNumber: 3,
      player: "X",
      index: 8, // C3
      coordinate: "C3",
      actorLabel: "Player X at C3",
      timestamp: "00:54",
      elapsedSeconds: 54,
      boardSnapshot: ["O", null, null, null, "X", null, null, null, "X"],
    },
    {
      moveNumber: 4,
      player: "O",
      index: 3, // B1
      coordinate: "B1",
      actorLabel: "Player O at B1",
      timestamp: "01:28",
      elapsedSeconds: 88,
      boardSnapshot: ["O", null, null, "O", "X", null, null, null, "X"],
    },
  ],
  matchHistory: [
    {
      id: "match-1",
      roundNumber: 1,
      winner: "X",
      mode: "ai",
      difficulty: "medium",
      movesCount: 5,
      durationSeconds: 42,
      completedAt: "2026-11-14T10:45:00.000Z",
      moves: [],
    },
    {
      id: "match-2",
      roundNumber: 2,
      winner: "O",
      mode: "ai",
      difficulty: "unbeatable",
      movesCount: 6,
      durationSeconds: 68,
      completedAt: "2026-11-14T10:48:00.000Z",
      moves: [],
    },
  ],
};

