"use client";

import React from "react";
import { GameMode, ScoreState } from "@/lib/game-logic";
import { Card } from "@/components/ui/card";
import { PlayerToken } from "@/components/PlayerTokenRenderer";

interface ScoreBoardProps {
  scores: ScoreState;
  mode: GameMode;
  xSymbol?: string;
  oSymbol?: string;
}

export function ScoreBoard({
  scores,
  mode,
  xSymbol = "classic-x",
  oSymbol = "classic-o",
}: ScoreBoardProps) {
  const totalMatches = scores.xWins + scores.draws + scores.oWins;

  const xRate =
    totalMatches > 0 ? Math.round((scores.xWins / totalMatches) * 100) : 0;
  const drawRate =
    totalMatches > 0 ? Math.round((scores.draws / totalMatches) * 100) : 0;
  const oRate =
    totalMatches > 0
      ? Math.max(0, 100 - xRate - drawRate)
      : 0;

  const xBarWidth = totalMatches > 0 ? (scores.xWins / totalMatches) * 100 : 33.33;
  const drawBarWidth =
    totalMatches > 0 ? (scores.draws / totalMatches) * 100 : 33.33;
  const oBarWidth =
    totalMatches > 0 ? (scores.oWins / totalMatches) * 100 : 33.34;

  const seriesStatusText = React.useMemo(() => {
    const { seriesX, seriesO } = scores;
    if (seriesX === seriesO) {
      return `Series tied ${seriesX} - ${seriesO}`;
    }
    if (seriesX > seriesO) {
      return `X leads ${seriesX} - ${seriesO}`;
    }
    return `O leads ${seriesO} - ${seriesX}`;
  }, [scores]);

  return (
    <Card className="p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900 tracking-tight">
            Session Scoreboard
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Match Series: Best of {scores.seriesBestOf}
          </p>
        </div>

        <span className="inline-flex items-center rounded-md bg-slate-50 border border-slate-200/80 px-2.5 py-1 text-[11px] font-medium text-slate-600 shrink-0">
          {seriesStatusText}
        </span>
      </div>

      {/* 3 Score Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5 mt-4">
        {/* Player X */}
        <div className="rounded-lg border border-slate-200/80 bg-white p-3">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-medium text-slate-500 truncate">
              Player X
            </span>
            {xSymbol === "classic-x" ? (
              <span className="w-2 h-2 rounded-full bg-[#0F172A] shrink-0" />
            ) : (
              <PlayerToken symbol={xSymbol} player="X" size="xs" />
            )}
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5 leading-none">
            {scores.xWins}
          </div>
          <div className="text-[10px] text-slate-400 mt-1.5">
            {xRate}% win rate
          </div>
        </div>

        {/* Draws */}
        <div className="rounded-lg border border-slate-200/80 bg-white p-3">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-medium text-slate-500 truncate">
              Draws
            </span>
            <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
          </div>
          <div className="text-2xl font-bold text-slate-500 tracking-tight mt-1.5 leading-none">
            {scores.draws}
          </div>
          <div className="text-[10px] text-slate-400 mt-1.5">
            {drawRate}% rate
          </div>
        </div>

        {/* Player O */}
        <div className="rounded-lg border border-slate-200/80 bg-white p-3">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-medium text-slate-500 truncate">
              {mode === "ai" ? "Player O (AI)" : "Player O"}
            </span>
            {oSymbol === "classic-o" ? (
              <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
            ) : (
              <PlayerToken symbol={oSymbol} player="O" size="xs" />
            )}
          </div>
          <div className="text-2xl font-bold text-[#2563EB] tracking-tight mt-1.5 leading-none">
            {scores.oWins}
          </div>
          <div className="text-[10px] text-slate-400 mt-1.5">
            {oRate}% rate
          </div>
        </div>
      </div>

      {/* Ratio Distribution */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Ratio Distribution</span>
          <span>{totalMatches} Completed Matches</span>
        </div>

        <div
          className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden flex"
          role="progressbar"
          aria-label="Match ratio distribution"
        >
          <div
            className="h-full bg-[#0F172A] transition-all duration-300"
            style={{ width: `${xBarWidth}%` }}
            title={`Player X: ${scores.xWins} (${xRate}%)`}
          />
          <div
            className="h-full bg-slate-300 transition-all duration-300"
            style={{ width: `${drawBarWidth}%` }}
            title={`Draws: ${scores.draws} (${drawRate}%)`}
          />
          <div
            className="h-full bg-[#2563EB] transition-all duration-300"
            style={{ width: `${oBarWidth}%` }}
            title={`Player O: ${scores.oWins} (${oRate}%)`}
          />
        </div>
      </div>
    </Card>
  );
}
