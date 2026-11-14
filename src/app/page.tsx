"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  AIDifficulty,
  BoardState,
  CompletedMatchRecord,
  GameMode,
  GameSettings,
  INITIAL_REFERENCE_SESSION,
  MoveRecord,
  Player,
  ScoreState,
  WorkspaceTab,
  calculateWinner,
  createEmptyBoard,
  generateMatchExport,
  getAIMove,
  getBestMoveWithAnalysis,
  indexToCoord,
} from "@/lib/game-logic";
import { formatDuration } from "@/lib/utils";
import { GameControls } from "@/components/GameControls";
import { GameBoard } from "@/components/GameBoard";
import { ScoreBoard } from "@/components/ScoreBoard";
import { MoveHistory } from "@/components/MoveHistory";
import { AnalyticsView } from "@/components/AnalyticsView";
import { SettingsView } from "@/components/SettingsView";
import { ExportModal } from "@/components/ExportModal";
import { WinCelebrationModal } from "@/components/WinCelebrationModal";

const STORAGE_KEY = "zerosum-workspace-sessions-v2";

type SessionKey = "pvp" | "ai:easy" | "ai:medium" | "ai:unbeatable";

interface SessionBucket {
  roundNumber: number;
  timerSeconds: number;
  roundElapsedSeconds: number;
  scores: ScoreState;
  moves: MoveRecord[];
  currentStep: number;
  matchHistory: CompletedMatchRecord[];
  eloRating: number;
  eloDelta: number;
}

function getSessionKey(mode: GameMode, difficulty: AIDifficulty): SessionKey {
  return mode === "pvp" ? "pvp" : (`ai:${difficulty}` as SessionKey);
}

function createFreshBucket(seriesBestOf = 5): SessionBucket {
  return {
    roundNumber: 1,
    timerSeconds: 0,
    roundElapsedSeconds: 0,
    scores: {
      xWins: 0,
      draws: 0,
      oWins: 0,
      seriesX: 0,
      seriesO: 0,
      seriesBestOf,
      currentStreakPlayer: null,
      currentStreakCount: 0,
    },
    moves: [],
    currentStep: 0,
    matchHistory: [],
    eloRating: 1200,
    eloDelta: 0,
  };
}

function createInitialSessions(): Record<SessionKey, SessionBucket> {
  return {
    pvp: createFreshBucket(5),
    "ai:easy": createFreshBucket(5),
    "ai:medium": createFreshBucket(5),
    "ai:unbeatable": {
      roundNumber: INITIAL_REFERENCE_SESSION.roundNumber,
      timerSeconds: INITIAL_REFERENCE_SESSION.timerSeconds,
      roundElapsedSeconds: 102,
      scores: { ...INITIAL_REFERENCE_SESSION.scores },
      moves: [...INITIAL_REFERENCE_SESSION.moves],
      currentStep: INITIAL_REFERENCE_SESSION.moves.length,
      matchHistory: [...INITIAL_REFERENCE_SESSION.matchHistory],
      eloRating: 1506,
      eloDelta: 24,
    },
  };
}

const DEFAULT_SETTINGS: GameSettings = {
  showCoordinates: true,
  showSuggestedMove: true,
  highlightSuggestedCell: false,
  autoNewRoundDelayMs: null,
  playerStartsFirst: "X",
  seriesBestOf: 5,
  soundEffects: false,
  tokenTheme: "classic",
  xSymbol: "classic-x",
  oSymbol: "classic-o",
};

export default function HomePage() {
  const [mode, setMode] = useState<GameMode>(INITIAL_REFERENCE_SESSION.mode);
  const [difficulty, setDifficulty] = useState<AIDifficulty>(
    INITIAL_REFERENCE_SESSION.difficulty
  );
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("dashboard");

  const [sessions, setSessions] = useState<Record<SessionKey, SessionBucket>>(
    createInitialSessions
  );
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  const [celebrationModalOpen, setCelebrationModalOpen] =
    useState<boolean>(false);
  const [isAIThinking, setIsAIThinking] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  const activeSessionKey = useMemo(
    () => getSessionKey(mode, difficulty),
    [mode, difficulty]
  );

  const currentBucket = sessions[activeSessionKey];
  const {
    roundNumber,
    timerSeconds,
    roundElapsedSeconds,
    scores,
    moves,
    currentStep,
    matchHistory,
    eloRating,
    eloDelta,
  } = currentBucket;

  // Helper to update only the currently active session bucket
  const updateActiveBucket = useCallback(
    (updater: (prev: SessionBucket) => SessionBucket) => {
      setSessions((prev) => ({
        ...prev,
        [activeSessionKey]: updater(prev[activeSessionKey]),
      }));
    },
    [activeSessionKey]
  );

  // Only trigger automatic AI response after a live human move in the same session
  const pendingAITurnRef = useRef<boolean>(false);
  const roundElapsedSecondsRef = useRef<number>(roundElapsedSeconds);

  useEffect(() => {
    roundElapsedSecondsRef.current = roundElapsedSeconds;
  }, [roundElapsedSeconds]);

  // Hydrate saved sessions from localStorage if present
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          if (parsed.mode === "pvp" || parsed.mode === "ai") {
            setMode(parsed.mode);
          }
          if (
            parsed.difficulty === "easy" ||
            parsed.difficulty === "medium" ||
            parsed.difficulty === "unbeatable"
          ) {
            setDifficulty(parsed.difficulty);
          }
          if (parsed.sessions && typeof parsed.sessions === "object") {
            setSessions((prev) => {
              const merged = { ...prev };
              for (const key of [
                "pvp",
                "ai:easy",
                "ai:medium",
                "ai:unbeatable",
              ] as SessionKey[]) {
                const candidate = parsed.sessions[key];
                if (
                  candidate &&
                  typeof candidate === "object" &&
                  Array.isArray(candidate.moves) &&
                  candidate.scores &&
                  typeof candidate.scores === "object"
                ) {
                  merged[key] = {
                    ...prev[key],
                    ...candidate,
                    currentStep:
                      typeof candidate.currentStep === "number"
                        ? Math.max(
                            0,
                            Math.min(
                              candidate.currentStep,
                              candidate.moves.length
                            )
                          )
                        : candidate.moves.length,
                  };
                }
              }
              return merged;
            });
          }
          if (parsed.settings && typeof parsed.settings === "object") {
            setSettings((prev) => ({ ...prev, ...parsed.settings }));
          }
        }
      }
    } catch {
      // Ignore storage errors and keep defaults
    } finally {
      setHasHydrated(true);
    }
  }, []);

  // Persist session changes to localStorage
  useEffect(() => {
    if (!hasHydrated) return;
    try {
      const payload = {
        mode,
        difficulty,
        sessions,
        settings,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore quota errors
    }
  }, [hasHydrated, mode, difficulty, sessions, settings]);

  // Compute current active board from currentStep
  const activeBoard: BoardState = useMemo(() => {
    if (currentStep <= 0 || moves.length === 0) {
      return createEmptyBoard();
    }
    const targetMove = moves[Math.min(currentStep, moves.length) - 1];
    return targetMove ? [...targetMove.boardSnapshot] : createEmptyBoard();
  }, [moves, currentStep]);

  const currentPlayer: Player = useMemo(() => {
    return currentStep % 2 === 0 ? "X" : "O";
  }, [currentStep]);

  const { winner, winningLine, lineType } = useMemo(
    () => calculateWinner(activeBoard),
    [activeBoard]
  );

  const analysis = useMemo(
    () => getBestMoveWithAnalysis(activeBoard, currentPlayer),
    [activeBoard, currentPlayer]
  );

  // Session & Round Timer for active bucket
  useEffect(() => {
    if (winner !== null || activeTab !== "dashboard") return;
    const interval = window.setInterval(() => {
      updateActiveBucket((prev) => ({
        ...prev,
        timerSeconds: prev.timerSeconds + 1,
        roundElapsedSeconds: prev.roundElapsedSeconds + 1,
      }));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [winner, activeTab, updateActiveBucket]);

  // Execute a move on the board (for either human or AI) inside active bucket
  const commitMove = useCallback(
    (cellIndex: number, actor: "human" | "ai") => {
      if (cellIndex < 0 || cellIndex > 8) return;

      const baseMoves = moves.slice(0, currentStep);
      const baseBoard =
        baseMoves.length > 0
          ? [...baseMoves[baseMoves.length - 1].boardSnapshot]
          : createEmptyBoard();

      if (baseBoard[cellIndex] !== null) return;
      if (calculateWinner(baseBoard).winner !== null) return;

      const moveNumber = baseMoves.length + 1;
      const player: Player = moveNumber % 2 === 1 ? "X" : "O";
      const nextBoard = [...baseBoard];
      nextBoard[cellIndex] = player;

      const coord = indexToCoord(cellIndex);
      const actorLabel =
        actor === "ai"
          ? `AI placed at ${coord}`
          : `Player ${player} at ${coord}`;

      const elapsed = roundElapsedSecondsRef.current;
      const newMove: MoveRecord = {
        moveNumber,
        player,
        index: cellIndex,
        coordinate: coord,
        actorLabel,
        timestamp: formatDuration(elapsed),
        elapsedSeconds: elapsed,
        boardSnapshot: nextBoard,
      };

      const updatedMoves = [...baseMoves, newMove];
      const result = calculateWinner(nextBoard);

      if (result.winner !== null) {
        pendingAITurnRef.current = false;
        const outcome = result.winner;
        const delta = outcome === "X" ? 24 : outcome === "DRAW" ? 4 : -16;

        updateActiveBucket((prev) => {
          const nextXWins =
            outcome === "X" ? prev.scores.xWins + 1 : prev.scores.xWins;
          const nextOWins =
            outcome === "O" ? prev.scores.oWins + 1 : prev.scores.oWins;
          const nextDraws =
            outcome === "DRAW" ? prev.scores.draws + 1 : prev.scores.draws;

          let nextSeriesX =
            outcome === "X" ? prev.scores.seriesX + 1 : prev.scores.seriesX;
          let nextSeriesO =
            outcome === "O" ? prev.scores.seriesO + 1 : prev.scores.seriesO;
          const targetWins = Math.ceil(prev.scores.seriesBestOf / 2);

          if (
            prev.scores.seriesX >= targetWins ||
            prev.scores.seriesO >= targetWins
          ) {
            nextSeriesX = outcome === "X" ? 1 : 0;
            nextSeriesO = outcome === "O" ? 1 : 0;
          }

          const nextStreakPlayer = outcome === "DRAW" ? null : outcome;
          const nextStreakCount =
            outcome === "DRAW"
              ? 0
              : prev.scores.currentStreakPlayer === outcome
              ? prev.scores.currentStreakCount + 1
              : 1;

          const newMatchRecord: CompletedMatchRecord = {
            id: `match-${Date.now()}`,
            roundNumber: prev.roundNumber,
            winner: outcome,
            mode,
            difficulty,
            movesCount: updatedMoves.length,
            durationSeconds: elapsed,
            completedAt: new Date().toISOString(),
            moves: updatedMoves,
          };

          return {
            ...prev,
            moves: updatedMoves,
            currentStep: updatedMoves.length,
            eloDelta: delta,
            eloRating: Math.max(800, prev.eloRating + delta),
            scores: {
              ...prev.scores,
              xWins: nextXWins,
              oWins: nextOWins,
              draws: nextDraws,
              seriesX: nextSeriesX,
              seriesO: nextSeriesO,
              currentStreakPlayer: nextStreakPlayer,
              currentStreakCount: nextStreakCount,
            },
            matchHistory: [newMatchRecord, ...prev.matchHistory.slice(0, 24)],
          };
        });

        setCelebrationModalOpen(true);
      } else {
        if (mode === "ai" && player === "X") {
          pendingAITurnRef.current = true;
        } else {
          pendingAITurnRef.current = false;
        }

        updateActiveBucket((prev) => ({
          ...prev,
          moves: updatedMoves,
          currentStep: updatedMoves.length,
        }));
      }
    },
    [moves, currentStep, mode, difficulty, updateActiveBucket]
  );

  // Trigger AI move when it's AI's turn in Player vs AI mode
  useEffect(() => {
    if (
      mode !== "ai" ||
      currentPlayer !== "O" ||
      winner !== null ||
      !pendingAITurnRef.current
    ) {
      return;
    }

    setIsAIThinking(true);
    const timer = window.setTimeout(() => {
      const aiMoveIndex = getAIMove(activeBoard, difficulty, "O");
      setIsAIThinking(false);
      pendingAITurnRef.current = false;
      if (aiMoveIndex !== null) {
        commitMove(aiMoveIndex, "ai");
      }
    }, 280);

    return () => {
      window.clearTimeout(timer);
      setIsAIThinking(false);
    };
  }, [mode, currentPlayer, winner, activeBoard, difficulty, commitMove]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (isAIThinking || winner !== null || pendingAITurnRef.current) return;
      if (mode === "ai" && currentPlayer === "O") return;
      commitMove(index, "human");
    },
    [isAIThinking, winner, mode, currentPlayer, commitMove]
  );

  // Restart current board / start new game in active bucket
  const handleStartNewGame = useCallback(() => {
    pendingAITurnRef.current = false;
    setIsAIThinking(false);
    setCelebrationModalOpen(false);
    updateActiveBucket((prev) => ({
      ...prev,
      roundNumber: winner !== null ? prev.roundNumber + 1 : prev.roundNumber,
      moves: [],
      currentStep: 0,
      roundElapsedSeconds: 0,
    }));
  }, [winner, updateActiveBucket]);

  // Undo last move in active bucket
  const handleUndoMove = useCallback(() => {
    if (currentStep <= 0 || isAIThinking) return;
    pendingAITurnRef.current = false;
    setCelebrationModalOpen(false);
    updateActiveBucket((prev) => {
      const nextStep =
        mode === "ai" && currentPlayer === "X" && prev.currentStep >= 2
          ? Math.max(0, prev.currentStep - 2)
          : Math.max(0, prev.currentStep - 1);
      return {
        ...prev,
        currentStep: nextStep,
      };
    });
  }, [currentStep, isAIThinking, mode, currentPlayer, updateActiveBucket]);

  // Jump to any historical move in Move History
  const handleJumpToStep = useCallback(
    (stepNumber: number) => {
      if (isAIThinking) return;
      pendingAITurnRef.current = false;
      setCelebrationModalOpen(false);
      updateActiveBucket((prev) => ({
        ...prev,
        currentStep: Math.max(0, Math.min(stepNumber, prev.moves.length)),
      }));
    },
    [isAIThinking, updateActiveBucket]
  );

  // Reset all scores to 0 in active bucket
  const handleResetScores = useCallback(() => {
    pendingAITurnRef.current = false;
    setIsAIThinking(false);
    setCelebrationModalOpen(false);
    updateActiveBucket((prev) => ({
      ...createFreshBucket(prev.scores.seriesBestOf),
    }));
  }, [updateActiveBucket]);

  // Restore exact UI reference session
  const handleRestoreDemoSession = useCallback(() => {
    pendingAITurnRef.current = false;
    setIsAIThinking(false);
    setCelebrationModalOpen(false);
    setMode(INITIAL_REFERENCE_SESSION.mode);
    setDifficulty(INITIAL_REFERENCE_SESSION.difficulty);
    setSessions(createInitialSessions());
    setActiveTab("dashboard");
  }, []);

  // Trigger the exact Win Celebration reference state
  const handleTriggerWinCelebrationDemo = useCallback(() => {
    pendingAITurnRef.current = false;
    setIsAIThinking(false);
    const celebrationMoves: MoveRecord[] = [
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
        index: 1, // A2
        coordinate: "A2",
        actorLabel: "AI placed at A2",
        timestamp: "00:32",
        elapsedSeconds: 32,
        boardSnapshot: [null, "O", null, null, "X", null, null, null, null],
      },
      {
        moveNumber: 3,
        player: "X",
        index: 8, // C3
        coordinate: "C3",
        actorLabel: "Player X at C3",
        timestamp: "00:54",
        elapsedSeconds: 54,
        boardSnapshot: [null, "O", null, null, "X", null, null, null, "X"],
      },
      {
        moveNumber: 4,
        player: "O",
        index: 3, // B1
        coordinate: "B1",
        actorLabel: "Player O at B1",
        timestamp: "01:28",
        elapsedSeconds: 88,
        boardSnapshot: [null, "O", null, "O", "X", null, null, null, "X"],
      },
      {
        moveNumber: 5,
        player: "X",
        index: 0, // A1 -> completes A1-B2-C3 diagonal
        coordinate: "A1",
        actorLabel: "Player X at A1",
        timestamp: "01:42",
        elapsedSeconds: 102,
        boardSnapshot: ["X", "O", null, "O", "X", null, null, null, "X"],
      },
    ];

    updateActiveBucket((prev) => ({
      ...prev,
      moves: celebrationMoves,
      currentStep: celebrationMoves.length,
      roundElapsedSeconds: 102,
      scores: {
        ...prev.scores,
        currentStreakPlayer: "X",
        currentStreakCount: 4,
      },
      eloRating: 1506,
      eloDelta: 24,
    }));
    setActiveTab("dashboard");
    setCelebrationModalOpen(true);
  }, [updateActiveBucket]);

  const handleUpdateSettings = useCallback(
    (partial: Partial<GameSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...partial };
        if (
          partial.seriesBestOf &&
          partial.seriesBestOf !== prev.seriesBestOf
        ) {
          setSessions((all) => {
            const nextAll = { ...all };
            for (const k of Object.keys(nextAll) as SessionKey[]) {
              nextAll[k] = {
                ...nextAll[k],
                scores: {
                  ...nextAll[k].scores,
                  seriesBestOf: partial.seriesBestOf!,
                },
              };
            }
            return nextAll;
          });
        }
        return updated;
      });
    },
    []
  );

  // Keyboard shortcuts: Space -> Restart / Play Again, Z -> Undo Move
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (exportModalOpen || activeTab !== "dashboard") return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handleStartNewGame();
      } else if (
        (e.key === "z" || e.key === "Z") &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        e.preventDefault();
        handleUndoMove();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [exportModalOpen, activeTab, handleStartNewGame, handleUndoMove]);

  const exportData = useMemo(
    () =>
      generateMatchExport({
        roundNumber,
        mode,
        difficulty,
        moves: moves.slice(0, currentStep),
        winner,
        scores,
        timerSeconds,
      }),
    [
      roundNumber,
      mode,
      difficulty,
      moves,
      currentStep,
      winner,
      scores,
      timerSeconds,
    ]
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] text-slate-900">
      {/* Left Sidebar Navigation (Desktop) & Top Bar / Bottom Tab Bar (Mobile) */}
      <GameControls
        mode={mode}
        difficulty={difficulty}
        activeTab={activeTab}
        onModeChange={(nextMode) => {
          pendingAITurnRef.current = false;
          setIsAIThinking(false);
          setCelebrationModalOpen(false);
          setExportModalOpen(false);
          setMode(nextMode);
          setActiveTab("dashboard");
        }}
        onDifficultyChange={(nextDiff) => {
          pendingAITurnRef.current = false;
          setIsAIThinking(false);
          setCelebrationModalOpen(false);
          setExportModalOpen(false);
          setDifficulty(nextDiff);
          setMode("ai");
          setActiveTab("dashboard");
        }}
        onTabChange={(nextTab) => {
          setCelebrationModalOpen(false);
          setExportModalOpen(false);
          setActiveTab(nextTab);
        }}
        onResetScores={handleResetScores}
        onNewGame={handleStartNewGame}
      />

      {/* Main Workspace Content */}
      <main className="flex-1 p-4 pb-24 sm:p-6 sm:pb-24 lg:p-7 lg:pb-7 xl:p-8 xl:pb-8 max-w-[1360px] w-full mx-auto">
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            {/* Center 3x3 Board Card */}
            <div className="xl:col-span-7">
              <GameBoard
                board={activeBoard}
                currentPlayer={currentPlayer}
                winner={winner}
                winningLine={winningLine}
                lineType={lineType}
                roundNumber={roundNumber}
                timerSeconds={timerSeconds}
                isAIThinking={isAIThinking}
                canUndo={currentStep > 0 && !isAIThinking}
                analysis={analysis}
                showCoordinates={settings.showCoordinates}
                showSuggestedMove={settings.showSuggestedMove}
                highlightSuggestedCell={settings.highlightSuggestedCell}
                tokenTheme={settings.tokenTheme}
                xSymbol={settings.xSymbol}
                oSymbol={settings.oSymbol}
                onSelectTokenPreset={(themeId, xSym, oSym) =>
                  handleUpdateSettings({
                    tokenTheme: themeId,
                    xSymbol: xSym,
                    oSymbol: oSym,
                  })
                }
                onUpdateCustomToken={(player, symbol) =>
                  handleUpdateSettings(
                    player === "X"
                      ? { tokenTheme: "custom", xSymbol: symbol }
                      : { tokenTheme: "custom", oSymbol: symbol }
                  )
                }
                onCellClick={handleCellClick}
                onRestart={handleStartNewGame}
                onUndo={handleUndoMove}
                onOpenCelebration={() => setCelebrationModalOpen(true)}
              />
            </div>

            {/* Right Column: Session Scoreboard + Move History */}
            <div className="xl:col-span-5 space-y-5">
              <ScoreBoard
                scores={scores}
                mode={mode}
                xSymbol={settings.xSymbol}
                oSymbol={settings.oSymbol}
              />

              <MoveHistory
                moves={moves}
                currentStep={currentStep}
                xSymbol={settings.xSymbol}
                oSymbol={settings.oSymbol}
                onJumpToStep={handleJumpToStep}
                onRestart={handleStartNewGame}
                onExport={() => setExportModalOpen(true)}
              />
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <AnalyticsView
            scores={scores}
            mode={mode}
            currentMoves={moves}
            matchHistory={matchHistory}
            onBackToDashboard={() => setActiveTab("dashboard")}
          />
        )}

        {activeTab === "settings" && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onRestoreDemoSession={handleRestoreDemoSession}
            onTriggerWinCelebrationDemo={handleTriggerWinCelebrationDemo}
            onResetAllScores={handleResetScores}
            onBackToDashboard={() => setActiveTab("dashboard")}
          />
        )}
      </main>

      {/* ZeroSum Win State Celebration Modal */}
      <WinCelebrationModal
        isOpen={celebrationModalOpen && winner !== null}
        winner={winner}
        winningLine={winningLine}
        lineType={lineType}
        movesCount={currentStep}
        durationSeconds={roundElapsedSeconds}
        scores={scores}
        mode={mode}
        eloRating={eloRating}
        eloDelta={eloDelta}
        onPlayAgain={handleStartNewGame}
        onReviewBoard={() => setCelebrationModalOpen(false)}
        onExport={() => {
          setCelebrationModalOpen(false);
          setExportModalOpen(true);
        }}
      />

      {/* Export Match PGN / JSON Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        pgn={exportData.pgn}
        json={exportData.json}
        roundNumber={roundNumber}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}
