"use client";

import React, { useState } from "react";
import { X, Copy, Check, Share2, Trophy, Users } from "lucide-react";
import { BoardState, GameMode, Player, ScoreState } from "@/lib/game-logic";
import { Button } from "@/components/ui/button";
import { PlayerToken } from "@/components/PlayerTokenRenderer";

interface ExportModalProps {
  isOpen: boolean;
  shareText?: string;
  board?: BoardState;
  winner?: Player | "DRAW" | null;
  winningLine?: number[] | null;
  mode?: GameMode;
  movesCount?: number;
  scores?: ScoreState;
  xSymbol?: string;
  oSymbol?: string;
  pgn?: string;
  json?: string;
  roundNumber: number;
  onClose: () => void;
}

export function ExportModal({
  isOpen,
  shareText,
  board = Array(9).fill(null),
  winner = null,
  winningLine = null,
  mode = "ai",
  movesCount = 0,
  scores,
  xSymbol = "classic-x",
  oSymbol = "classic-o",
  roundNumber,
  onClose,
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const outcomeLabel =
    winner === "X"
      ? "Player X Won!"
      : winner === "O"
      ? mode === "ai"
        ? "AI (Player O) Won!"
        : "Player O Won!"
      : winner === "DRAW"
      ? "It's a Tie (Draw)"
      : movesCount === 0
      ? "Ready to Play"
      : `Game in Progress (${movesCount} ${movesCount === 1 ? "move" : "moves"})`;

  const modeLabel = mode === "ai" ? "Player vs AI" : "Player vs Player";

  const textToCopy =
    shareText ||
    `ZeroSum Tic-Tac-Toe — Round #${roundNumber} (${modeLabel})\nResult: ${outcomeLabel}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-md overflow-hidden select-none">
        {/* Clean Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3
                id="share-modal-title"
                className="text-sm font-bold text-slate-900"
              >
                Share Match Result
              </h3>
              <p className="text-[11px] text-slate-500">
                Copy and share your Round #{roundNumber} board summary with friends
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Match Card */}
        <div className="p-5 space-y-4">
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4">
            {/* Top Status Row */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200/70">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>{outcomeLabel}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] font-medium text-slate-600">
                <Users className="w-3 h-3 text-slate-400" />
                {modeLabel} • Round #{roundNumber}
              </span>
            </div>

            {/* Visual 3x3 Mini Board + Score Summary */}
            <div className="mt-3.5 flex items-center justify-between gap-4">
              {/* Mini 3x3 Board */}
              <div className="grid grid-cols-3 gap-1.5 bg-white p-2 rounded-xl border border-slate-200/90 shadow-2xs shrink-0">
                {board.map((cell, idx) => {
                  const isWinningCell = winningLine?.includes(idx) ?? false;
                  return (
                    <div
                      key={idx}
                      className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
                        isWinningCell
                          ? "bg-blue-50/90 border-blue-300"
                          : "bg-slate-50/50 border-slate-200/70"
                      }`}
                    >
                      {cell === "X" && (
                        <PlayerToken symbol={xSymbol} player="X" size="sm" />
                      )}
                      {cell === "O" && (
                        <PlayerToken symbol={oSymbol} player="O" size="sm" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Friendly Score Summary */}
              <div className="flex-1 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Current Scoreboard
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="rounded-lg bg-white border border-slate-200/80 p-2">
                    <div className="text-[10px] font-medium text-slate-500">
                      Player X
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {scores?.xWins ?? 0}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white border border-slate-200/80 p-2">
                    <div className="text-[10px] font-medium text-slate-500">
                      Draws
                    </div>
                    <div className="text-sm font-bold text-slate-600 mt-0.5">
                      {scores?.draws ?? 0}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white border border-slate-200/80 p-2">
                    <div className="text-[10px] font-medium text-slate-500">
                      {mode === "ai" ? "AI (O)" : "Player O"}
                    </div>
                    <div className="text-sm font-bold text-[#2563EB] mt-0.5">
                      {scores?.oWins ?? 0}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">
                  Total moves played:{" "}
                  <span className="font-semibold text-slate-700">
                    {movesCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Action Buttons */}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleCopy}
              className="px-4"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Match Result
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

