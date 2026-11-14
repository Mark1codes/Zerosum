import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it, expect, vi } from "vitest";
import { GameControls } from "../GameControls";

describe("GameControls mobile & desktop navigation", () => {
  const defaultProps = {
    mode: "ai" as const,
    difficulty: "unbeatable" as const,
    activeTab: "dashboard" as const,
    onModeChange: vi.fn(),
    onDifficultyChange: vi.fn(),
    onTabChange: vi.fn(),
    onResetScores: vi.fn(),
    onNewGame: vi.fn(),
  };

  it("renders desktop sidebar, clean mobile top bar without hamburger button, and 5-tab mobile bottom nav", () => {
    const html = renderToStaticMarkup(<GameControls {...defaultProps} />);

    // Desktop sidebar remains intact
    expect(html).toContain("hidden lg:flex");
    expect(html).toContain("Player vs Player");
    expect(html).toContain("Player vs AI");

    // Mobile top header has Reset Scores & New Game, and no hamburger toggle button
    expect(html).toContain('aria-label="Reset Scores"');
    expect(html).toContain("New Game");
    expect(html).not.toContain("Toggle navigation menu");
    expect(html).not.toContain("Open menu");

    // Mobile bottom app navigation has all 5 required tabs
    expect(html).toContain('aria-label="Mobile app navigation"');
    expect(html).toContain("<span>Board</span>");
    expect(html).toContain("<span>PvP</span>");
    expect(html).toContain("<span>vs AI</span>");
    expect(html).toContain("<span>Analytics</span>");
    expect(html).toContain("<span>Settings</span>");
  });

  it("shows the mobile AI difficulty strip only when activeTab is dashboard and mode is ai", () => {
    const aiDashboardHtml = renderToStaticMarkup(
      <GameControls {...defaultProps} activeTab="dashboard" mode="ai" difficulty="medium" />
    );
    expect(aiDashboardHtml).toContain('aria-label="AI Difficulty"');
    expect(aiDashboardHtml).toContain('aria-pressed="true"');

    const pvpDashboardHtml = renderToStaticMarkup(
      <GameControls {...defaultProps} activeTab="dashboard" mode="pvp" />
    );
    expect(pvpDashboardHtml).not.toContain('aria-label="AI Difficulty"');

    const analyticsAiHtml = renderToStaticMarkup(
      <GameControls {...defaultProps} activeTab="analytics" mode="ai" />
    );
    expect(analyticsAiHtml).not.toContain('aria-label="AI Difficulty"');

    const settingsAiHtml = renderToStaticMarkup(
      <GameControls {...defaultProps} activeTab="settings" mode="ai" />
    );
    expect(settingsAiHtml).not.toContain('aria-label="AI Difficulty"');
  });
});
