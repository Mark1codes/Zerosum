"use client";

import React, { useState } from "react";
import {
  Settings,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  Smile,
} from "lucide-react";
import {
  GameSettings,
  Player,
  SELECTABLE_EMOJI_TOKENS,
  SELECTABLE_VECTOR_TOKENS,
  TOKEN_PRESETS,
  TokenThemeId,
} from "@/lib/game-logic";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayerToken } from "@/components/PlayerTokenRenderer";

interface SettingsViewProps {
  settings: GameSettings;
  onUpdateSettings: (partial: Partial<GameSettings>) => void;
  onRestoreDemoSession: () => void;
  onTriggerWinCelebrationDemo: () => void;
  onResetAllScores: () => void;
  onBackToDashboard: () => void;
}

export function SettingsView({
  settings,
  onUpdateSettings,
  onRestoreDemoSession,
  onTriggerWinCelebrationDemo,
  onResetAllScores,
  onBackToDashboard,
}: SettingsViewProps) {
  const [editingPlayer, setEditingPlayer] = useState<Player>("X");

  const currentXSymbol = settings.xSymbol ?? "classic-x";
  const currentOSymbol = settings.oSymbol ?? "classic-o";

  const activeTargetSymbol =
    editingPlayer === "X" ? currentXSymbol : currentOSymbol;
  const otherPlayerSymbol =
    editingPlayer === "X" ? currentOSymbol : currentXSymbol;

  const handleSelectCustomSymbol = (symbol: string) => {
    if (symbol === otherPlayerSymbol) return;
    if (editingPlayer === "X") {
      onUpdateSettings({ tokenTheme: "custom", xSymbol: symbol });
    } else {
      onUpdateSettings({ tokenTheme: "custom", oSymbol: symbol });
    }
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-700" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Workspace & Engine Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize player tokens (icons & emojis), board coordinates, Minimax
            suggestions, and series rules.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onBackToDashboard}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Board
        </Button>
      </div>

      {/* Player Icons & Emojis Card */}
      <Card className="p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <Smile className="w-4 h-4 text-blue-600" />
              <span>Player Tokens (Icons & Emojis)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Choose a preset rivalry pair or pick custom vector icons and
              emojis for Player X and Player O.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200/80 px-3 py-1.5">
            <span className="text-[11px] font-medium text-slate-600">
              Active:
            </span>
            <PlayerToken symbol={currentXSymbol} player="X" size="md" />
            <span className="text-[10px] text-slate-400">vs</span>
            <PlayerToken symbol={currentOSymbol} player="O" size="md" />
          </div>
        </div>

        {/* Preset Pairs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {TOKEN_PRESETS.map((preset) => {
            const isSelected =
              settings.tokenTheme === preset.id &&
              settings.xSymbol === preset.xSymbol &&
              settings.oSymbol === preset.oSymbol;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    tokenTheme: preset.id as TokenThemeId,
                    xSymbol: preset.xSymbol,
                    oSymbol: preset.oSymbol,
                  })
                }
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer",
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white font-medium"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                <span className="truncate">{preset.name}</span>
                <span className="flex items-center gap-1 ml-1.5 shrink-0">
                  <PlayerToken
                    symbol={preset.xSymbol}
                    player="X"
                    size="xs"
                    className={isSelected ? "text-white" : undefined}
                  />
                  <PlayerToken
                    symbol={preset.oSymbol}
                    player="O"
                    size="xs"
                    className={isSelected ? "text-sky-300" : undefined}
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* Individual Token Picker */}
        <div className="border-t border-slate-100 pt-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-semibold text-slate-700">
              Customize Individual Player Token:
            </span>
            <div className="inline-flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setEditingPlayer("X")}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer",
                  editingPlayer === "X"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <span>Player X</span>
                <PlayerToken symbol={currentXSymbol} player="X" size="xs" />
              </button>
              <button
                type="button"
                onClick={() => setEditingPlayer("O")}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer",
                  editingPlayer === "O"
                    ? "bg-white text-[#2563EB] shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <span>Player O</span>
                <PlayerToken symbol={currentOSymbol} player="O" size="xs" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
            {SELECTABLE_VECTOR_TOKENS.map((item) => {
              const isCurrent = activeTargetSymbol === item.id;
              const isTaken = otherPlayerSymbol === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isTaken}
                  title={item.label}
                  onClick={() => handleSelectCustomSymbol(item.id)}
                  className={cn(
                    "h-8 rounded-lg border flex items-center justify-center transition-colors",
                    isCurrent
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                      : isTaken
                      ? "border-slate-100 bg-slate-50 opacity-30 cursor-not-allowed"
                      : "border-slate-200 hover:bg-slate-50 cursor-pointer"
                  )}
                >
                  <PlayerToken
                    symbol={item.id}
                    player={editingPlayer}
                    size="sm"
                  />
                </button>
              );
            })}

            {SELECTABLE_EMOJI_TOKENS.map((emoji) => {
              const isCurrent = activeTargetSymbol === emoji;
              const isTaken = otherPlayerSymbol === emoji;
              return (
                <button
                  key={emoji}
                  type="button"
                  disabled={isTaken}
                  onClick={() => handleSelectCustomSymbol(emoji)}
                  className={cn(
                    "h-8 rounded-lg border flex items-center justify-center text-base transition-colors",
                    isCurrent
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                      : isTaken
                      ? "border-slate-100 bg-slate-50 opacity-30 cursor-not-allowed"
                      : "border-slate-200 hover:bg-slate-50 cursor-pointer"
                  )}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="p-5 divide-y divide-slate-100">
        {/* Coordinate Labels */}
        <div className="py-3.5 first:pt-0 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-900">
              Show Coordinate Labels (A1–C3)
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Display algebraic grid coordinates in the top-left corner of each
              board square.
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.showCoordinates}
            onChange={(e) =>
              onUpdateSettings({ showCoordinates: e.target.checked })
            }
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
          />
        </div>

        {/* Show Suggested Move Depth */}
        <div className="py-3.5 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-900">
              Show Minimax Optimal Depth Indicator
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Display real-time remaining search tree depth in the board footer.
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.showSuggestedMove}
            onChange={(e) =>
              onUpdateSettings({ showSuggestedMove: e.target.checked })
            }
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
          />
        </div>

        {/* Highlight Suggested Cell */}
        <div className="py-3.5 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-900">
              Highlight Best Move on Grid
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Subtly pulse the Minimax-recommended square on the 3x3 board.
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.highlightSuggestedCell}
            onChange={(e) =>
              onUpdateSettings({ highlightSuggestedCell: e.target.checked })
            }
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
          />
        </div>

        {/* Series Best Of */}
        <div className="py-3.5 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-900">
              Match Series Format
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Target series length displayed in the Session Scoreboard.
            </div>
          </div>
          <select
            value={settings.seriesBestOf}
            onChange={(e) =>
              onUpdateSettings({ seriesBestOf: Number(e.target.value) })
            }
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value={3}>Best of 3</option>
            <option value={5}>Best of 5</option>
            <option value={7}>Best of 7</option>
            <option value={9}>Best of 9</option>
          </select>
        </div>

        {/* Session Presets */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-900">
              Session Snapshot Controls
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Restore the Round #3 reference state, preview the Win Celebration
              modal, or wipe scores.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onTriggerWinCelebrationDemo}
            >
              <Award className="w-3.5 h-3.5 text-blue-600" />
              Preview Win Celebration
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRestoreDemoSession}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Restore Reference Session
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetAllScores}
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Zero All Scores
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
