"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Zap,
  Shield,
  Crown,
  Gem,
  Flame,
  Snowflake,
  Rocket,
  Swords,
  Star,
  Heart,
  Trophy,
  Bot,
  Skull,
  Sparkles,
  ChevronDown,
  Smile,
} from "lucide-react";
import {
  Player,
  SELECTABLE_EMOJI_TOKENS,
  SELECTABLE_VECTOR_TOKENS,
  TOKEN_PRESETS,
  TokenThemeId,
} from "@/lib/game-logic";
import { cn } from "@/lib/utils";

const ICON_COMPONENTS: Record<
  string,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  "icon:zap": Zap,
  "icon:shield": Shield,
  "icon:crown": Crown,
  "icon:gem": Gem,
  "icon:flame": Flame,
  "icon:snowflake": Snowflake,
  "icon:rocket": Rocket,
  "icon:swords": Swords,
  "icon:star": Star,
  "icon:heart": Heart,
  "icon:trophy": Trophy,
  "icon:bot": Bot,
  "icon:skull": Skull,
  "icon:sparkles": Sparkles,
};

interface PlayerTokenProps {
  symbol: string;
  player: Player;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function PlayerToken({
  symbol,
  player,
  size = "lg",
  className,
}: PlayerTokenProps) {
  const colorClass =
    player === "X" ? "text-[#0F172A]" : "text-[#2563EB]";

  const sizeMap = {
    xs: {
      svg: "w-3 h-3",
      emoji: "text-[11px] leading-none",
    },
    sm: {
      svg: "w-3.5 h-3.5",
      emoji: "text-xs leading-none",
    },
    md: {
      svg: "w-4 h-4",
      emoji: "text-sm leading-none",
    },
    lg: {
      svg: "w-10 h-10 sm:w-11 sm:h-11",
      emoji: "text-3xl sm:text-[34px] leading-none select-none",
    },
  }[size];

  if (symbol === "classic-o") {
    return (
      <svg
        viewBox="0 0 44 44"
        className={cn(sizeMap.svg, colorClass, className)}
        aria-hidden="true"
      >
        <circle
          cx="22"
          cy="22"
          r="14.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={size === "lg" ? "2.75" : "3.5"}
        />
      </svg>
    );
  }

  if (symbol === "classic-x") {
    return (
      <svg
        viewBox="0 0 44 44"
        className={cn(sizeMap.svg, colorClass, className)}
        aria-hidden="true"
      >
        <line
          x1="12"
          y1="12"
          x2="32"
          y2="32"
          stroke="currentColor"
          strokeWidth={size === "lg" ? "2.5" : "3.5"}
          strokeLinecap="round"
        />
        <line
          x1="32"
          y1="12"
          x2="12"
          y2="32"
          stroke="currentColor"
          strokeWidth={size === "lg" ? "2.5" : "3.5"}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  const IconComp = ICON_COMPONENTS[symbol];
  if (IconComp) {
    return (
      <IconComp
        className={cn(sizeMap.svg, colorClass, className)}
        strokeWidth={size === "lg" ? 2.1 : 2.25}
      />
    );
  }

  // Render custom emoji or character
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        sizeMap.emoji,
        className
      )}
      aria-hidden="true"
    >
      {symbol}
    </span>
  );
}

interface TokenQuickSelectorProps {
  tokenTheme: TokenThemeId;
  xSymbol: string;
  oSymbol: string;
  onSelectPreset: (
    themeId: TokenThemeId,
    xSymbol: string,
    oSymbol: string
  ) => void;
  onUpdateCustomSymbol: (player: Player, symbol: string) => void;
}

export function TokenQuickSelector({
  tokenTheme,
  xSymbol,
  oSymbol,
  onSelectPreset,
  onUpdateCustomSymbol,
}: TokenQuickSelectorProps) {
  const [open, setOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player>("X");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const activeTargetSymbol = editingPlayer === "X" ? xSymbol : oSymbol;
  const otherPlayerSymbol = editingPlayer === "X" ? oSymbol : xSymbol;

  return (
    <div ref={containerRef} className="static sm:relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        title="Choose Player Icons or Emojis"
        className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
      >
        <Smile className="w-3.5 h-3.5 text-slate-500" />
        <span className="inline-flex items-center gap-1">
          <PlayerToken symbol={xSymbol} player="X" size="xs" />
          <span className="text-[10px] text-slate-400">vs</span>
          <PlayerToken symbol={oSymbol} player="O" size="xs" />
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-3 right-3 top-full -mt-1 sm:mt-1.5 sm:left-auto sm:right-0 sm:w-80 rounded-xl bg-white border border-slate-200 shadow-xl p-3.5 z-40 select-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-900">
              Player Icons & Emojis
            </span>
            <span className="text-[10px] text-slate-400">
              Live board tokens
            </span>
          </div>

          {/* Preset Theme Pairs */}
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Preset Pairs
          </div>
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {TOKEN_PRESETS.map((preset) => {
              const isSelected =
                tokenTheme === preset.id &&
                xSymbol === preset.xSymbol &&
                oSymbol === preset.oSymbol;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onSelectPreset(preset.id, preset.xSymbol, preset.oSymbol);
                  }}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left text-[11px] transition-colors cursor-pointer",
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white font-medium"
                      : "border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <span className="truncate">{preset.name}</span>
                  <span className="flex items-center gap-1 ml-1 shrink-0">
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

          {/* Custom Per-Player Picker */}
          <div className="border-t border-slate-100 pt-2.5">
            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Customize Token
              </span>
              <div className="inline-flex rounded-md bg-slate-100 p-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingPlayer("X")}
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-semibold inline-flex items-center gap-1 whitespace-nowrap cursor-pointer",
                    editingPlayer === "X"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <span>Player X</span>
                  <PlayerToken symbol={xSymbol} player="X" size="xs" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPlayer("O")}
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-semibold inline-flex items-center gap-1 whitespace-nowrap cursor-pointer",
                    editingPlayer === "O"
                      ? "bg-white text-[#2563EB] shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <span>Player O</span>
                  <PlayerToken symbol={oSymbol} player="O" size="xs" />
                </button>
              </div>
            </div>

            {/* Vector Icons Grid */}
            <div className="text-[10px] text-slate-400 mb-1">Vector Icons</div>
            <div className="grid grid-cols-8 gap-1 mb-2">
              {SELECTABLE_VECTOR_TOKENS.map((item) => {
                const isCurrent = activeTargetSymbol === item.id;
                const isTakenByOther = otherPlayerSymbol === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isTakenByOther}
                    title={`${item.label}${
                      isTakenByOther ? " (Used by opponent)" : ""
                    }`}
                    onClick={() =>
                      onUpdateCustomSymbol(editingPlayer, item.id)
                    }
                    className={cn(
                      "h-7 rounded-md border flex items-center justify-center transition-colors",
                      isCurrent
                        ? "border-blue-600 bg-blue-50/80 ring-1 ring-blue-600"
                        : isTakenByOther
                        ? "border-slate-100 bg-slate-50 opacity-30 cursor-not-allowed"
                        : "border-slate-200/80 hover:bg-slate-50 cursor-pointer"
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
            </div>

            {/* Emoji Grid */}
            <div className="text-[10px] text-slate-400 mb-1">Emojis</div>
            <div className="grid grid-cols-8 gap-1">
              {SELECTABLE_EMOJI_TOKENS.map((emoji) => {
                const isCurrent = activeTargetSymbol === emoji;
                const isTakenByOther = otherPlayerSymbol === emoji;
                return (
                  <button
                    key={emoji}
                    type="button"
                    disabled={isTakenByOther}
                    onClick={() =>
                      onUpdateCustomSymbol(editingPlayer, emoji)
                    }
                    className={cn(
                      "h-7 rounded-md border flex items-center justify-center text-sm transition-colors",
                      isCurrent
                        ? "border-blue-600 bg-blue-50/80 ring-1 ring-blue-600"
                        : isTakenByOther
                        ? "border-slate-100 bg-slate-50 opacity-30 cursor-not-allowed"
                        : "border-slate-200/80 hover:bg-slate-50 cursor-pointer"
                    )}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

