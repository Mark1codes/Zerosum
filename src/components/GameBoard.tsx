"use client";

import React from "react";
import { Clock, Award } from "lucide-react";
import {
  BoardState,
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
      <div className="py-8 sm:py-12 px-4 sm:px-8 flex flex-col items-center justify-center bg-white flex-1">
        <div
          role="grid"
          aria-label="Tic-Tac-Toe 3 by 3 Board"
          className="relative w-full max-w-[348px] aspect-square grid grid-cols-3 grid-rows-3 border border-slate-200/90 rounded-xl overflow-hidden bg-white"
        >
          {/* Glowing Winning Path Band Overlay */}
          {winningOverlayCoords && (
            <svg
              viewBox="0 0 300 300"
              className="pointer-events-none absolute inset-0 w-full h-full z-10"
              aria-hidden="true"
            >
              <line
                x1={winningOverlayCoords.x1}
                y1={winningOverlayCoords.y1}
                x2={winningOverlayCoords.x2}
                y2={winningOverlayCoords.y2}
                stroke="rgba(37, 99, 235, 0.14)"
                strokeWidth="36"
                strokeLinecap="round"
              />
              <line
                x1={winningOverlayCoords.x1}
                y1={winningOverlayCoords.y1}
                x2={winningOverlayCoords.x2}
                y2={winningOverlayCoords.y2}
                stroke="rgba(37, 99, 235, 0.45)"
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
                  "relative flex items-center justify-center transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 group",
                  col < 2 && "border-r border-slate-200/85",
                  row < 2 && "border-b border-slate-200/85",
                  !isDisabled && "hover:bg-slate-50/80 cursor-pointer",
                  isDisabled && "cursor-default",
                  isWinningCell && "bg-blue-50/45",
                  isSuggested && "bg-blue-50/30"
                )}
              >
                {/* Coordinate Label */}
                {showCoordinates && (
                  <span
                    className={cn(
                      "absolute top-2.5 left-3 text-[10px] font-mono font-medium transition-colors z-20",
                      isWinningCell
                        ? "text-[#2563EB] font-semibold"
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

                {/* Piece Rendering (Classic X/O, Vector Icon, or Emoji) */}
                {cell !== null && (
                  <PlayerToken
                    symbol={cell === "X" ? xSymbol : oSymbol}
                    player={cell}
                    size="lg"
                    className={cn(
                      "relative z-20 transition-transform duration-150",
                      isWinningCell && "scale-110"
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

        {showSuggestedMove && (
          <div
            className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500"
            title={
              analysis.bestCoord
                ? `Recommended coordinate: ${analysis.bestCoord}`
                : "Round finished"
            }
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
            <span>
              {winner === null
                ? `Next suggested move: Optimal depth ${analysis.optimalDepth}`
                : `Match complete • Final depth 0`}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
