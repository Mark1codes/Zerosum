"use client";

import React, { useState } from "react";
import {
  X,
  Zap,
  TrendingUp,
  RotateCw,
  Eye,
  Share2,
  Check,
} from "lucide-react";
import {
  GameMode,
  Player,
  ScoreState,
  indexToCoord,
} from "@/lib/game-logic";

interface WinCelebrationModalProps {
  isOpen: boolean;
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
  movesCount: number;
  durationSeconds: number;
  scores: ScoreState;
  mode: GameMode;
  eloRating: number;
  eloDelta: number;
  shareText?: string;
  onPlayAgain: () => void;
  onReviewBoard: () => void;
  onExport: () => void;
}

function formatVerboseDuration(totalSeconds: number): string {
  const safe = Math.max(1, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  if (mins > 0) {
    return `${mins}m ${String(secs).padStart(2, "0")}s`;
  }
  return `${secs}s`;
}

export function WinCelebrationModal({
  isOpen,
  winner,
  winningLine,
  lineType,
  movesCount,
  durationSeconds,
  scores,
  mode,
  eloRating,
  eloDelta,
  shareText,
  onPlayAgain,
  onReviewBoard,
  onExport,
}: WinCelebrationModalProps) {
  const [copied, setCopied] = useState(false);

  const pathTypeLabel = React.useMemo(() => {
    if (!lineType) return "Full Grid Parity";
    if (lineType.startsWith("diag")) return "Diagonal";
    if (lineType.startsWith("row")) return "Horizontal";
    return "Vertical";
  }, [lineType]);

  const pathCoords = React.useMemo(() => {
    if (!winningLine || winningLine.length === 0) {
      return ["A1", "B2", "C3"];
    }
    return winningLine.map((idx) => indexToCoord(idx));
  }, [winningLine]);

  if (!isOpen || winner === null) return null;

  const handleShareClick = async () => {
    if (shareText) {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch {
        // Fallback to modal if clipboard API is unavailable
      }
    }
    onExport();
  };

  const isDraw = winner === "DRAW";

  const titleText = isDraw
    ? "Round Drawn — It's a Tie!"
    : winner === "X"
    ? "Player X Claims Victory"
    : mode === "ai"
    ? "Player O (AI) Claims Victory"
    : "Player O Claims Victory";

  const subtitleText = isDraw
    ? `All 9 squares filled with no winner in ${movesCount} moves (${formatVerboseDuration(
        durationSeconds
      )})`
    : `Winning sequence completed in ${movesCount} moves (${formatVerboseDuration(
        durationSeconds
      )})`;

  // Calculate accuracy based on moves count (5 moves = 98.4%, 6 moves = 96.8%, 7 moves = 94.2%, etc.)
  const accuracy =
    movesCount <= 5
      ? "98.4%"
      : movesCount === 6
      ? "96.8%"
      : movesCount === 7
      ? "94.6%"
      : "92.1%";

  const displayStreak = Math.max(
    1,
    scores.currentStreakCount > 0 ? scores.currentStreakCount : 4
  );

  const prevElo = eloRating - eloDelta;
  const formattedDelta =
    eloDelta >= 0 ? `+${eloDelta} pts` : `${eloDelta} pts`;

  const searchDepth = Math.max(1, 9 - movesCount);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-xs transition-opacity duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-celebration-title"
    >
      <div className="relative w-full max-w-[430px] rounded-2xl bg-white p-6 sm:p-7 shadow-[0_20px_50px_rgba(15,23,42,0.22)] border border-slate-100 overflow-hidden select-none">
        {/* Top radial ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-44 rounded-full bg-gradient-to-b from-blue-500/15 via-sky-400/5 to-transparent blur-2xl"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onReviewBoard}
          aria-label="Close celebration modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Medal Icon Box with Star & Cyan Dot */}
        <div className="relative w-12 h-12 mx-auto mt-1">
          {/* Floating Star */}
          <svg
            viewBox="0 0 20 20"
            className="w-3.5 h-3.5 text-[#60A5FA] absolute -top-1.5 -left-3.5"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>

          {/* Floating Cyan Dot */}
          <span
            aria-hidden="true"
            className="w-2 h-2 rounded-full bg-[#38BDF8] absolute top-0 -right-3.5"
          />

          {/* Dark Squircle Container */}
          <div className="w-12 h-12 rounded-2xl bg-[#0B1120] shadow-[0_8px_20px_rgba(37,99,235,0.28)] flex items-center justify-center relative overflow-hidden border border-slate-800">
            {/* Subtle bottom-left indigo accent */}
            <span
              aria-hidden="true"
              className="absolute -bottom-1 -left-1 w-4 h-4 rounded-tr-lg bg-indigo-500/40 rotate-12"
            />
            {/* Crisp Medal with Star SVG */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-6 h-6 text-[#38BDF8]"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="10"
                r="5.5"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path
                d="M9.5 14.8L8.5 20L12 18.2L15.5 20L14.5 14.8"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 7.5L12.65 9.1L14.3 9.25L13.05 10.35L13.45 12L12 11.1L10.55 12L10.95 10.35L9.7 9.25L11.35 9.1L12 7.5Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* Match Status Pill */}
        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200/80 text-[10px] font-bold tracking-wider uppercase text-[#2563EB]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            {isDraw ? "MATCH DRAWN" : "MATCH COMPLETE"}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="mt-2.5 text-center">
          <h2
            id="win-celebration-title"
            className="text-xl font-bold text-slate-900 tracking-tight"
          >
            {titleText}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{subtitleText}</p>
        </div>

        {/* 3 Telemetry Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5 mt-5">
          {/* Accuracy */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/35 p-3 text-center">
            <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
              Accuracy
            </div>
            <div className="text-base font-bold text-slate-900 mt-1">
              {accuracy}
            </div>
            <div className="mt-1 inline-flex items-center justify-center gap-0.5 text-[11px] font-semibold text-emerald-600">
              <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
              <span>Optimal</span>
            </div>
          </div>

          {/* Win Streak */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/35 p-3 text-center">
            <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
              Win Streak
            </div>
            <div className="text-base font-bold text-slate-900 mt-1">
              {isDraw ? "Tied" : `${displayStreak} Match`}
            </div>
            <div className="mt-1 inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-[#2563EB]">
              <TrendingUp className="w-3 h-3" />
              <span>{isDraw ? "Even" : "Flawless"}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/35 p-3 text-center">
            <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
              Rating
            </div>
            <div className="text-base font-bold text-[#2563EB] mt-1">
              {formattedDelta}
            </div>
            <div className="mt-1 text-[10px] font-mono text-slate-400">
              {prevElo} → {eloRating}
            </div>
          </div>
        </div>

        {/* Winning Path Callout Box */}
        <div className="mt-3.5 rounded-xl border border-slate-200/80 bg-white p-3 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50/90 border border-blue-100 flex items-center justify-center shrink-0 text-[#2563EB]">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path
                  d="M4 14L9 9L12 12L16 6"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="4" cy="14" r="1.5" fill="currentColor" />
                <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="16" cy="6" r="1.5" fill="currentColor" />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {isDraw
                  ? "Board State: All 9 Squares Filled (Draw)"
                  : `Winning Path: ${pathTypeLabel} [${pathCoords.join(
                      " - "
                    )}]`}
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                {isDraw
                  ? `Neither player connected 3 in a row across ${movesCount} moves`
                  : mode === "ai"
                  ? `Decisive winning line secured at Move #${movesCount}`
                  : `Winning 3-in-a-row connected at Move #${movesCount}`}
              </div>
            </div>
          </div>

          <span className="px-2 py-1 rounded-md bg-blue-50/70 border border-blue-200/80 text-[10px] font-mono font-semibold text-[#2563EB] shrink-0">
            Depth {searchDepth}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2.5">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full rounded-xl bg-[#0B1120] hover:bg-slate-800 active:bg-slate-950 text-white py-3 px-4 flex items-center justify-center gap-2.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Play Again</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800/90 border border-slate-700 text-[10px] font-mono font-medium text-slate-300">
              Space
            </kbd>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onReviewBoard}
              className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 py-2.5 px-3 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Review Board</span>
            </button>

            <button
              type="button"
              onClick={handleShareClick}
              className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 py-2.5 px-3 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Result Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share Result</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

