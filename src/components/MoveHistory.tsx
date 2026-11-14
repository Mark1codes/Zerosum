"use client";

import React from "react";
import { History, Share2 } from "lucide-react";
import { MoveRecord } from "@/lib/game-logic";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { PlayerToken } from "@/components/PlayerTokenRenderer";

interface MoveHistoryProps {
  moves: MoveRecord[];
  currentStep: number;
  xSymbol?: string;
  oSymbol?: string;
  onJumpToStep: (stepIndex: number) => void;
  onRestart: () => void;
  onExport: () => void;
}

export function MoveHistory({
  moves,
  currentStep,
  xSymbol = "classic-x",
  oSymbol = "classic-o",
  onJumpToStep,
  onRestart,
  onExport,
}: MoveHistoryProps) {
  const reversedMoves = React.useMemo(() => [...moves].reverse(), [moves]);

  return (
    <Card className="p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <History className="w-3.5 h-3.5 text-slate-500" />
            <h2 className="text-[13px] font-semibold text-slate-900 tracking-tight">
              Move History
            </h2>
          </div>

          <span className="inline-flex items-center rounded-md bg-slate-50 border border-slate-200/80 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
            {moves.length} {moves.length === 1 ? "move" : "moves"} recorded
          </span>
        </div>

        {/* Move List */}
        <div className="mt-3 divide-y divide-slate-100 max-h-[260px] overflow-y-auto pr-0.5">
          {reversedMoves.map((move) => {
            const isCurrentStep = currentStep === move.moveNumber;
            const moveSymbol = move.player === "X" ? xSymbol : oSymbol;
            const isClassicSymbol =
              moveSymbol === "classic-x" || moveSymbol === "classic-o";

            return (
              <div
                key={move.moveNumber}
                className={cn(
                  "py-2.5 flex items-center justify-between gap-2 transition-colors rounded-md",
                  currentStep !== moves.length &&
                    isCurrentStep &&
                    "bg-slate-50/80 px-1.5"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isClassicSymbol ? (
                    move.player === "X" ? (
                      <span className="w-4 h-4 rounded-full bg-[#0F172A] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                        X
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/90 text-[9px] font-bold flex items-center justify-center shrink-0">
                        O
                      </span>
                    )
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
                      <PlayerToken
                        symbol={moveSymbol}
                        player={move.player}
                        size="xs"
                      />
                    </span>
                  )}

                  <div className="text-xs truncate">
                    <span className="font-semibold text-slate-800">
                      Move #{move.moveNumber}
                    </span>
                    <span className="text-slate-400 mx-1">•</span>
                    <span className="text-slate-600">{move.actorLabel}</span>
                    <span className="font-mono text-[10px] text-slate-400 ml-1.5">
                      ({move.timestamp})
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onJumpToStep(move.moveNumber)}
                  className={cn(
                    "px-2.5 py-1 rounded-md border text-[11px] font-medium transition-colors shrink-0 cursor-pointer",
                    currentStep !== moves.length && isCurrentStep
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  Jump
                </button>
              </div>
            );
          })}

          {/* Initial Board State row */}
          <div className="py-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 text-[9px] font-mono font-bold flex items-center justify-center shrink-0">
                #
              </span>
              <div className="text-xs truncate">
                <span className="text-slate-500">Initial Board State</span>
                <span className="font-mono text-[10px] text-slate-400 ml-1.5">
                  (00:00)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onRestart}
              className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
            >
              Restart
            </button>
          </div>
        </div>
      </div>

      {/* Share Match Result Button */}
      <div className="mt-4 pt-1">
        <button
          type="button"
          onClick={onExport}
          className="w-full py-2.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Share Match Result</span>
        </button>
      </div>
    </Card>
  );
}
