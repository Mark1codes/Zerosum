"use client";

import React from "react";
import { Clock, Award, Layers, Moon, Grid3X3 } from "lucide-react";
import {
  BoardState,
  BoardThemeId,
  COORDINATES,
  MoveAnalysis,
  Player,
  TokenThemeId,
} from "@/lib/game-logic";
import { cn, formatDuration } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  PlayerToken,
  TokenQuickSelector,
} from "@/components/PlayerTokenRenderer";

interface GameBoardProps {
  board: BoardState;
  currentPlayer: Player;
  winner: Player | "DRAW" | null;
  winningLine: number[] | null;
  lineType?:
    | "row-0"
    | "row-1"
    | "row-2"
    | "col-0"
    | "col-1"
    | "col-2"
    | "diag-main"
    | "diag-anti"
    | null;
  roundNumber: number;
  timerSeconds: number;
  isAIThinking: boolean;
  canUndo: boolean;
  analysis: MoveAnalysis;
  showCoordinates?: boolean;
  showSuggestedMove?: boolean;
  highlightSuggestedCell?: boolean;
  tokenTheme?: TokenThemeId;
  xSymbol?: string;
  oSymbol?: string;
  boardTheme?: BoardThemeId;
  onSelectBoardTheme?: (theme: BoardThemeId) => void;
  onSelectTokenPreset?: (
    themeId: TokenThemeId,
    xSym: string,
    oSym: string
  ) => void;
  onUpdateCustomToken?: (player: Player, symbol: string) => void;
  onCellClick: (index: number) => void;
  onRestart: () => void;
  onUndo: () => void;
  onOpenCelebration?: () => void;
}

const LINE_SVG_COORDS: Record<
  NonNullable<GameBoardProps["lineType"]>,
  { x1: number; y1: number; x2: number; y2: number }
> = {
  "row-0": { x1: 16, y1: 50, x2: 284, y2: 50 },
  "row-1": { x1: 16, y1: 150, x2: 284, y2: 150 },
  "row-2": { x1: 16, y1: 250, x2: 284, y2: 250 },
  "col-0": { x1: 50, y1: 16, x2: 50, y2: 284 },
  "col-1": { x1: 150, y1: 16, x2: 150, y2: 284 },
  "col-2": { x1: 250, y1: 16, x2: 250, y2: 284 },
  "diag-main": { x1: 26, y1: 26, x2: 274, y2: 274 },
  "diag-anti": { x1: 274, y1: 26, x2: 26, y2: 274 },
};

export function GameBoard({
  board,
  currentPlayer,
  winner,
  winningLine,
  lineType = null,
  roundNumber,
  timerSeconds,
  isAIThinking,
  canUndo,
  analysis,
  showCoordinates = true,
  showSuggestedMove = true,
  highlightSuggestedCell = false,
  tokenTheme = "classic",
  xSymbol = "classic-x",
  oSymbol = "classic-o",
  boardTheme = "tactile",
  onSelectBoardTheme,
  onSelectTokenPreset,
  onUpdateCustomToken,
  onCellClick,
  onRestart,
  onUndo,
  onOpenCelebration,
}: GameBoardProps) {
  const statusText = React.useMemo(() => {
    if (winner === "X") return "Player X Claims Victory";
    if (winner === "O") return "Player O Claims Victory";
    if (winner === "DRAW") return "Zero-Sum Draw";
    if (isAIThinking) return "Player O (AI) Thinking...";
    return `Player ${currentPlayer}'s Turn`;
  }, [winner, isAIThinking, currentPlayer]);

  const statusDotClass = React.useMemo(() => {
    if (winner === "X") return "bg-blue-600";
    if (winner === "O") return "bg-blue-600";
    if (winner === "DRAW") return "bg-slate-400";
    return currentPlayer === "X" ? "bg-slate-900" : "bg-blue-600";
  }, [winner, currentPlayer]);

  const winningOverlayCoords = lineType ? LINE_SVG_COORDS[lineType] : null;
  const activeTurnSymbol =
    (winner === "X" ? xSymbol : winner === "O" ? oSymbol : null) ??
    (currentPlayer === "X" ? xSymbol : oSymbol);
  const activeTurnPlayer: Player =
    winner === "X" ? "X" : winner === "O" ? "O" : currentPlayer;

  return (
    <Card className="flex flex-col justify-between overflow-visible">
      {/* Top Status Bar */}
      <div className="relative px-4 sm:px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              statusDotClass,
              isAIThinking && "animate-pulse"
            )}
          />
          <h2 className="text-[13px] font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>{statusText}</span>
            {winner !== "DRAW" &&
              activeTurnSymbol !== "classic-x" &&
              activeTurnSymbol !== "classic-o" && (
                <PlayerToken
                  symbol={activeTurnSymbol}
                  player={activeTurnPlayer}
                  size="sm"
                />
              )}
          </h2>
          {winner !== null && onOpenCelebration && (
            <button
              type="button"
              onClick={onOpenCelebration}
              className="ml-1 inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 text-[10px] font-semibold text-[#2563EB] hover:bg-blue-100/70 transition-colors cursor-pointer"
            >
              <Award className="w-3 h-3" />
              <span>Summary</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {onSelectTokenPreset && onUpdateCustomToken && (
            <TokenQuickSelector
              tokenTheme={tokenTheme}
              xSymbol={xSymbol}
              oSymbol={oSymbol}
              onSelectPreset={onSelectTokenPreset}
              onUpdateCustomSymbol={onUpdateCustomToken}
            />
          )}

          <span className="inline-flex items-center rounded-md bg-slate-50 border border-slate-200/80 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            Round #{roundNumber}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDuration(timerSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Center 3x3 Board Area */}
      <div
        className={cn(
          "py-6 sm:py-10 px-4 sm:px-8 flex flex-col items-center justify-center flex-1 transition-colors",
          boardTheme === "tactile" &&
            "bg-[#F8FAFC]/70 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:18px_18px]",
          boardTheme === "midnight" &&
            "bg-[radial-gradient(circle_at_center,#1e293b_0%,#0f172a_100%)]",
          boardTheme === "classic" && "bg-white"
        )}
      >
        {/* Board Theme Switcher Pill */}
        {onSelectBoardTheme && (
          <div
            className={cn(
              "mb-4 inline-flex items-center gap-1 rounded-xl p-1 border text-[11px] font-medium select-none",
              boardTheme === "midnight"
                ? "bg-slate-900/90 border-slate-800 text-slate-400"
                : "bg-white/95 border-slate-200/90 text-slate-500 shadow-2xs"
            )}
          >
            {(
              [
                { id: "tactile", label: "3D Tiles", icon: Layers },
                { id: "midnight", label: "Midnight", icon: Moon },
                { id: "classic", label: "Classic", icon: Grid3X3 },
              ] as const
            ).map(({ id, label, icon: Icon }) => {
              const active = boardTheme === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelectBoardTheme(id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer",
                    active
                      ? boardTheme === "midnight"
                        ? "bg-blue-600 text-white font-semibold shadow-2xs"
                        : "bg-[#0F172A] text-white font-semibold shadow-2xs"
                      : boardTheme === "midnight"
                      ? "hover:text-slate-200 hover:bg-slate-800/60"
                      : "hover:text-slate-900 hover:bg-slate-100/70"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        )}

        <div
          role="grid"
          aria-label="Tic-Tac-Toe 3 by 3 Board"
          className={cn(
            "relative w-full max-w-[356px] aspect-square grid grid-cols-3 grid-rows-3 transition-all",
            boardTheme === "tactile" &&
              "gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-200/75 border border-slate-300/80 shadow-inner",
            boardTheme === "midnight" &&
              "gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-2xl bg-[#0B1120] border border-slate-800 shadow-[0_20px_50px_rgba(2,6,23,0.45)]",
            boardTheme === "classic" &&
              "border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs"
          )}
        >
          {/* Glowing Winning Path Band Overlay */}
          {winningOverlayCoords && (
            <svg
              viewBox="0 0 300 300"
              className="pointer-events-none absolute inset-0 w-full h-full z-30"
              aria-hidden="true"
            >
              <line
                x1={winningOverlayCoords.x1}
                y1={winningOverlayCoords.y1}
                x2={winningOverlayCoords.x2}
                y2={winningOverlayCoords.y2}
                stroke={
                  boardTheme === "midnight"
                    ? "rgba(56, 189, 248, 0.22)"
                    : "rgba(37, 99, 235, 0.14)"
                }
                strokeWidth="36"
                strokeLinecap="round"
              />
              <line
                x1={winningOverlayCoords.x1}
                y1={winningOverlayCoords.y1}
                x2={winningOverlayCoords.x2}
                y2={winningOverlayCoords.y2}
                stroke={
                  boardTheme === "midnight"
                    ? "rgba(56, 189, 248, 0.75)"
                    : "rgba(37, 99, 235, 0.45)"
                }
                strokeWidth="2.5"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
            </svg>
          )}

          {board.map((cell, index) => {
            const coord = COORDINATES[index];
            const row = Math.floor(index / 3);
            const col = index % 3;
            const isWinningCell = winningLine?.includes(index) ?? false;
            const isSuggested =
              highlightSuggestedCell &&
              winner === null &&
              analysis.bestMoveIndex === index &&
              cell === null;
            const isDisabled =
              cell !== null || winner !== null || isAIThinking;

            return (
              <button
                key={coord}
                type="button"
                role="gridcell"
                aria-label={`Cell ${coord}${
                  cell ? `, occupied by ${cell}` : ", empty"
                }`}
                disabled={isDisabled}
                onClick={() => onCellClick(index)}
                className={cn(
                  "relative flex items-center justify-center transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 group",
                  // Classic theme borders & states
                  boardTheme === "classic" && [
                    col < 2 && "border-r border-slate-200/85",
                    row < 2 && "border-b border-slate-200/85",
                    !isDisabled && "hover:bg-slate-50/80 cursor-pointer",
                    isWinningCell && "bg-blue-50/55",
                    isSuggested && "bg-blue-50/30",
                  ],
                  // Tactile 3D Keycap Tiles theme
                  boardTheme === "tactile" && [
                    "rounded-xl border",
                    !isWinningCell &&
                      cell === null &&
                      "bg-white border-slate-200/95 shadow-[0_3px_0_0_#cbd5e1,0_1px_2px_rgba(15,23,42,0.06)]",
                    !isWinningCell &&
                      cell !== null &&
                      "bg-white border-slate-200/95 shadow-[0_1px_0_0_#cbd5e1]",
                    !isDisabled &&
                      "hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_4px_0_0_#93c5fd,0_6px_14px_rgba(37,99,235,0.08)] active:translate-y-0 cursor-pointer",
                    isWinningCell &&
                      "bg-blue-50/95 border-blue-400 shadow-[0_2px_0_0_#60a5fa] ring-2 ring-blue-500/20",
                    isSuggested && "ring-2 ring-blue-400/50 bg-blue-50/40",
                  ],
                  // Midnight Obsidian Arena theme
                  boardTheme === "midnight" && [
                    "rounded-xl border",
                    !isWinningCell &&
                      "bg-[#131C31] border-slate-800/90 shadow-[0_3px_0_0_#020617]",
                    !isDisabled &&
                      "hover:-translate-y-0.5 hover:bg-[#192540] hover:border-sky-500/50 hover:shadow-[0_4px_14px_rgba(56,189,248,0.14)] active:translate-y-0 cursor-pointer",
                    isWinningCell &&
                      "bg-blue-950/90 border-sky-400/80 shadow-[0_0_20px_rgba(56,189,248,0.22)] ring-1 ring-sky-400/40",
                    isSuggested && "ring-2 ring-sky-400/50",
                  ],
                  isDisabled && "cursor-default"
                )}
              >
                {/* Coordinate Label */}
                {showCoordinates && (
                  <span
                    className={cn(
                      "absolute top-2 left-2.5 text-[10px] font-mono font-medium transition-colors z-20",
                      isWinningCell
                        ? boardTheme === "midnight"
                          ? "text-sky-300 font-semibold"
                          : "text-[#2563EB] font-semibold"
                        : boardTheme === "midnight"
                        ? "text-slate-500 group-hover:text-slate-300"
                        : "text-slate-400 group-hover:text-slate-500"
                    )}
                  >
                    {coord}
                  </span>
                )}

                {/* Suggested dot indicator when highlightSuggestedCell is enabled */}
                {isSuggested && (
                  <span
                    title={`Suggested optimal move: ${coord}`}
                    className="w-2 h-2 rounded-full bg-blue-500/40 animate-ping"
                  />
                )}

                {/* Ghost Hover Preview on Empty Squares */}
                {cell === null && !isDisabled && (
                  <div
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none opacity-0 group-hover:opacity-25 scale-90 group-hover:scale-100 transition-all duration-150",
                      boardTheme === "midnight" &&
                        currentPlayer === "X" &&
                        xSymbol === "classic-x" &&
                        "brightness-0 invert"
                    )}
                  >
                    <PlayerToken
                      symbol={currentPlayer === "X" ? xSymbol : oSymbol}
                      player={currentPlayer}
                      size="lg"
                    />
                  </div>
                )}

                {/* Piece Rendering (Classic X/O, Vector Icon, or Emoji) */}
                {cell !== null && (
                  <PlayerToken
                    symbol={cell === "X" ? xSymbol : oSymbol}
                    player={cell}
                    size="lg"
                    className={cn(
                      "relative z-20 transition-transform duration-150",
                      isWinningCell && "scale-110",
                      boardTheme === "midnight" &&
                        cell === "X" &&
                        xSymbol === "classic-x" &&
                        "brightness-0 invert"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Shortcut & AI Depth Footer */}
      <div className="px-5 py-3 border-t border-slate-100 bg-white rounded-b-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="Press Space to restart current board"
          >
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium bg-slate-50 text-slate-600 border border-slate-200 rounded shadow-2xs">
              Space
            </kbd>
            <span>Restart</span>
          </button>

          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={cn(
              "inline-flex items-center gap-1.5 text-[11px] transition-colors",
              canUndo
                ? "text-slate-500 hover:text-slate-900 cursor-pointer"
                : "text-slate-300 cursor-not-allowed"
            )}
            title="Press Z to undo last move"
          >
            <kbd
              className={cn(
                "px-1.5 py-0.5 text-[10px] font-mono font-medium border rounded shadow-2xs",
                canUndo
                  ? "bg-slate-50 text-slate-600 border-slate-200"
                  : "bg-slate-50/50 text-slate-300 border-slate-100"
              )}
            >
              Z
            </kbd>
            <span>Undo Move</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
