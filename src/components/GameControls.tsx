"use client";

import React from "react";
import {
  User,
  Bot,
  Smile,
  Flame,
  Crown,
  Columns2,
  BarChart2,
  Settings,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import {
  AIDifficulty,
  GameMode,
  WorkspaceTab,
} from "@/lib/game-logic";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface GameControlsProps {
  mode: GameMode;
  difficulty: AIDifficulty;
  activeTab: WorkspaceTab;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: AIDifficulty) => void;
  onTabChange: (tab: WorkspaceTab) => void;
  onResetScores: () => void;
  onNewGame: () => void;
}

const AI_DIFFICULTIES = [
  {
    id: "easy",
    label: "Easy",
    icon: Smile,
    activeColor: "text-emerald-600",
    idleColor: "text-emerald-500/80",
  },
  {
    id: "medium",
    label: "Medium",
    icon: Flame,
    activeColor: "text-amber-500",
    idleColor: "text-amber-500/80",
  },
  {
    id: "unbeatable",
    label: "Unbeatable",
    icon: Crown,
    activeColor: "text-indigo-600",
    idleColor: "text-indigo-500/80",
  },
] as const;

export function GameControls({
  mode,
  difficulty,
  activeTab,
  onModeChange,
  onDifficultyChange,
  onTabChange,
  onResetScores,
  onNewGame,
}: GameControlsProps) {
  const isDashboardActive = activeTab === "dashboard";
  const isPvPActive = isDashboardActive && mode === "pvp";
  const isAIActive = isDashboardActive && mode === "ai";

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full select-none">
      <div>
        {/* Brand Header (ZeroSum, compact logo, no Active Session pill) */}
        <div className="px-2.5 pt-1 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="ZeroSum Logo"
                className="w-full h-full object-cover scale-[2.2]"
              />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-slate-900">
              ZeroSum
            </span>
          </div>
        </div>

        {/* GAME MODE */}
        <div className="mt-2">
          <div className="px-2.5 mb-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Game Mode
          </div>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => {
                onModeChange("pvp");
                onTabChange("dashboard");
              }}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer",
                isPvPActive
                  ? "bg-[#F1F5F9] text-slate-900 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
              )}
            >
              <User
                strokeWidth={2}
                className={cn(
                  "w-4 h-4 shrink-0",
                  isPvPActive ? "text-slate-900" : "text-slate-500"
                )}
              />
              <span>Player vs Player</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onModeChange("ai");
                onTabChange("dashboard");
              }}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer",
                isAIActive
                  ? "bg-[#F1F5F9] text-slate-900 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
              )}
            >
              <Bot
                strokeWidth={2}
                className={cn(
                  "w-4 h-4 shrink-0",
                  isAIActive ? "text-blue-600" : "text-slate-500"
                )}
              />
              <span>Player vs AI</span>
            </button>
          </div>
        </div>

        {/* AI DIFFICULTY */}
        <div className="mt-6">
          <div className="px-2.5 mb-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            AI Difficulty
          </div>
          <div className="space-y-0.5">
            {AI_DIFFICULTIES.map((item) => {
              const Icon = item.icon;
              const isSelected =
                isDashboardActive && mode === "ai" && difficulty === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onDifficultyChange(item.id);
                    onModeChange("ai");
                    onTabChange("dashboard");
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer",
                    isSelected
                      ? "bg-[#F1F5F9] text-slate-900 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  )}
                >
                  <Icon
                    strokeWidth={2.1}
                    className={cn(
                      "w-4 h-4 shrink-0",
                      isSelected ? item.activeColor : item.idleColor
                    )}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* WORKSPACE */}
        <div className="mt-6">
          <div className="px-2.5 mb-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Workspace
          </div>
          <div className="space-y-0.5">
            {(
              [
                { id: "dashboard", label: "Dashboard", icon: Columns2 },
                { id: "analytics", label: "Analytics", icon: BarChart2 },
                { id: "settings", label: "Settings", icon: Settings },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onTabChange(item.id);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer",
                    isSelected
                      ? "bg-[#F1F5F9] text-slate-900 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  )}
                >
                  <Icon
                    strokeWidth={2}
                    className={cn(
                      "w-4 h-4 shrink-0",
                      isSelected ? "text-slate-900" : "text-slate-500"
                    )}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-6 space-y-2">
        <Button
          type="button"
          variant="outline"
          onClick={onResetScores}
          className="w-full justify-center py-2.5 text-xs font-semibold text-slate-700 border-slate-200/90 hover:bg-slate-50"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          Reset Scores
        </Button>

        <Button
          type="button"
          variant="default"
          onClick={() => {
            onNewGame();
            onTabChange("dashboard");
          }}
          className="w-full justify-center py-2.5 text-xs font-semibold bg-[#0F172A] hover:bg-slate-800 text-white"
        >
          <RotateCw className="w-3.5 h-3.5" />
          New Game
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex lg:w-[225px] xl:w-[235px] lg:shrink-0 lg:flex-col bg-white border-r border-slate-200/80 px-3.5 py-5 min-h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile & Tablet Top Navigation Bar */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 py-2.5 space-y-2 select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="ZeroSum Logo"
                className="w-full h-full object-cover scale-[2.2]"
              />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-slate-900">
              ZeroSum
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label="Reset Scores"
              title="Reset Scores"
              onClick={onResetScores}
              className="h-8 px-2.5 text-[11px] text-slate-700 border-slate-200/90 hover:bg-slate-50"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span className="hidden sm:inline">Reset Scores</span>
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => {
                onNewGame();
                onTabChange("dashboard");
              }}
              className="h-8 px-2.5 text-[11px] bg-[#0F172A] hover:bg-slate-800 text-white"
            >
              <RotateCw className="w-3 h-3" />
              New Game
            </Button>
          </div>
        </div>

        {/* Mobile AI Difficulty Strip */}
        {isAIActive && (
          <div
            role="group"
            aria-label="AI Difficulty"
            className="grid grid-cols-3 gap-1 bg-slate-100/90 p-1 rounded-lg border border-slate-200/70"
          >
            {AI_DIFFICULTIES.map((item) => {
              const Icon = item.icon;
              const isSelected = difficulty === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    onDifficultyChange(item.id);
                    onModeChange("ai");
                    onTabChange("dashboard");
                  }}
                  className={cn(
                    "flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-1.5 sm:px-2 rounded-md text-[11px] whitespace-nowrap transition-all cursor-pointer",
                    isSelected
                      ? "bg-white text-slate-900 font-semibold shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 font-medium"
                  )}
                >
                  <Icon
                    strokeWidth={2.1}
                    className={cn(
                      "w-3.5 h-3.5 shrink-0",
                      isSelected ? item.activeColor : item.idleColor
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile Bottom App Tab Bar */}
      <nav
        aria-label="Mobile app navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] grid grid-cols-5 gap-1 select-none shadow-[0_-2px_10px_rgba(15,23,42,0.04)]"
      >
        <button
          type="button"
          onClick={() => onTabChange("dashboard")}
          className={cn(
            "flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer",
            isDashboardActive
              ? "text-blue-600 bg-blue-50/70 font-semibold"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Columns2 className="w-4 h-4 mb-0.5" strokeWidth={2} />
          <span>Board</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onModeChange("pvp");
            onTabChange("dashboard");
          }}
          className={cn(
            "flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer",
            isPvPActive
              ? "text-slate-900 bg-slate-100 font-semibold"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <User className="w-4 h-4 mb-0.5" strokeWidth={2} />
          <span>PvP</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onModeChange("ai");
            onTabChange("dashboard");
          }}
          className={cn(
            "flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer",
            isAIActive
              ? "text-blue-600 bg-blue-50/70 font-semibold"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Bot className="w-4 h-4 mb-0.5" strokeWidth={2} />
          <span>vs AI</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("analytics")}
          className={cn(
            "flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer",
            activeTab === "analytics"
              ? "text-blue-600 bg-blue-50/70 font-semibold"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <BarChart2 className="w-4 h-4 mb-0.5" strokeWidth={2} />
          <span>Analytics</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("settings")}
          className={cn(
            "flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer",
            activeTab === "settings"
              ? "text-blue-600 bg-blue-50/70 font-semibold"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Settings className="w-4 h-4 mb-0.5" strokeWidth={2} />
          <span>Settings</span>
        </button>
      </nav>
    </>
  );
}
