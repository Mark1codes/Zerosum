# ZeroSum — Tic-Tac-Toe 

<img width="1920" height="912" alt="image" src="https://github.com/user-attachments/assets/58f2fa50-b491-487e-a47c-97b990c7ea7f" />


A modern, mobile-first **Tic-Tac-Toe** application (**ZeroSum**) built with **Next.js (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** components.

Built as a practical React & Next.js coding challenge submission, designed to feel fast, responsive on phones and desktops, and clean under the hood.

---

## Live Demo & Repository

- **Live Production App (Vercel):** https://zerosum-v1.vercel.app/
- **GitHub Repository:** [https://github.com/Mark1codes/Zerosum](https://github.com/Mark1codes/Zerosum)

---

## Features

- **Two Game Modes with Isolated Session State:**
  - **Player vs. Player (Local 2P):** Play head-to-head on the same device.
  - **Player vs. AI (1P):** Play against a built-in computer opponent with three difficulty levels:
    - **Easy:** Casual random and opportunistic moves.
    - **Medium:** Tactical AI that blocks immediate threats and takes winning moves.
    - **Unbeatable (Minimax):** Uses the Minimax algorithm with alpha-beta pruning for optimal, depth-aware play.
  - Each mode and AI difficulty maintains its own independent board state, round counter, and scoreboard in `localStorage`.
- **3 Switchable Board Themes & Ghost Hover Previews:**
  - **3D Tiles (Default):** Tactile floating keycap tiles inside a recessed slate tray over a subtle dot-matrix backdrop.
  - **Midnight:** Deep `#0B1120` obsidian arena matching the ZeroSum brand icon with glowing cyan/blue win lines.
  - **Classic:** Clean minimalist grid.
  - **Ghost Hover Previews:** Hovering over any empty square displays a subtle 25%-opacity preview of the active player's token before placing a move.
- **Share Match Result (3x3 Emoji Grid & Visual Match Card):**
  - One-click **Share Match Result** in both the **Move History** panel and the **Post-Match Celebration Modal**.
  - Previews a visual 3x3 mini-board summary card with active tokens and copies a Wordle-style 3x3 emoji grid + scoreboard snapshot directly to the clipboard for sharing in chat or social feeds.
- **Custom Player Tokens (Icons & Emojis):**
  - Choose from 7 curated rivalry presets (*Classic X & O*, *Bolt & Shield*, *Crown & Gem*, *Fire & Ice*, *Rocket & UFO*, *Swords & Dragon*, *Cat & Dog*) or pick custom vector icons and emojis for Player X and Player O.
- **Win-Line Detection & Post-Match Celebration Modal:**
  - Automatically detects horizontal, vertical, and diagonal wins, draws an animated SVG strike-through band across the winning cells, and displays a post-match summary modal with accuracy, streak, and rating stats.
- **Move History & Time Travel:**
  - Step backward (`Z` shortcut to Undo) or jump to any previous move in the current match with coordinate timestamps (`A1`–`C3`).
- **Session Analytics & Coordinate Heatmap:**
  - Dedicated **Analytics** view tracking win/draw ratios, Best-of-N series progress, a 3x3 coordinate popularity heatmap, and completed match logs.
- **Native Mobile-First Navigation:**
  - Designed specifically to work smoothly on phones with a clean mobile top bar, segmented AI difficulty pill strip, and a fixed 5-tab bottom navigation dock (*Board*, *PvP*, *vs AI*, *Analytics*, *Settings*) with iOS safe-area support.
  - Keyboard shortcuts (`Space` for New Game / Restart, `Z` for Undo Move) and accessible grid cells.

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) | Server/Client component architecture, routing, and zero-config Vercel builds |
| **UI Library** | [React 19](https://react.dev/) | Functional components, state management (`useState`, `useEffect`, `useCallback`, `useMemo`) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict static typing for board state, move history, and Minimax AI logic |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Mobile-first responsive layout, animations, and dark/light surface styling |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) + [Lucide React](https://lucide.dev/) | Accessible buttons, cards, badges, mode toggles, and crisp icons |
| **Deployment** | [Vercel](https://vercel.com/) | Continuous deployment from GitHub with global edge CDN |

---

## Project Architecture

```text
Zerosum/
├── src/
│   ├── app/
│   │   ├── globals.css                 # Tailwind CSS directives & theme tokens
│   │   ├── icon.png                    # Full-bleed app icon / favicon
│   │   ├── layout.tsx                  # Root layout, Plus Jakarta Sans & Inter fonts
│   │   └── page.tsx                    # Main Tic-Tac-Toe state container & session buckets
│   ├── components/
│   │   ├── GameBoard.tsx               # 3x3 arena with 3 board themes & ghost hover previews
│   │   ├── GameControls.tsx            # Desktop sidebar + mobile top bar & bottom tab dock
│   │   ├── ScoreBoard.tsx              # Session scoreboard, ratio bar & Best-of-N series tracker
│   │   ├── MoveHistory.tsx             # Time-travel move list & Share Match Result trigger
│   │   ├── PlayerTokenRenderer.tsx     # Classic X/O, vector icons & emoji token selector
│   │   ├── WinCelebrationModal.tsx     # Post-match summary modal with 1-click Share Result
│   │   ├── ExportModal.tsx             # Visual Share Match Result card & clipboard copy modal
│   │   ├── AnalyticsView.tsx           # Win-rate cards, 3x3 coordinate heatmap & match history
│   │   ├── SettingsView.tsx            # Token customizer, board options & series configuration
│   │   ├── __tests__/                  # Component tests (Vitest)
│   │   └── ui/                         # Reusable UI primitives (Button, Card, Badge)
│   └── lib/
│       ├── game-logic.ts               # Win detection, Alpha-Beta Minimax AI & share generator
│       ├── __tests__/                  # Unit tests for game engine & Minimax AI
│       └── utils.ts                    # Classname & duration formatting helpers
├── public/                             # Static brand assets (favicon.png, logo.png)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vitest.config.ts
└── README.md
```

---

## How the Game Logic Works (`src/lib/game-logic.ts`)

1. **Board Representation:**
   - The board is represented as a 9-element tuple/array: `Array<'X' | 'O' | null>`.
   - Move history is stored as an array of snapshots so players can inspect or rewind to any turn.
2. **Winner & Win-Line Calculation:**
   - Checks all 8 winning triplets (`3 rows`, `3 columns`, `2 diagonals`).
   - Returns both the `winner` (`'X' | 'O' | 'DRAW' | null`) and the `winningLine` (`number[] | null`) so the UI can highlight the exact winning squares.
3. **Minimax AI Opponent:**
   - Evaluates terminal board states (`+10 - depth` for AI win, `depth - 10` for human win, `0` for draw) so the AI always prefers the fastest win or delays a loss as long as possible.

---

## Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/Mark1codes/Zerosum.git
cd Zerosum
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser (or on your phone over your local network) to play.

### 4. Production build check
```bash
npm run build
npm start
```

---

## Author

**Mark Angelo Gargoles**
- **Portfolio:** [markaon-rho.vercel.app](https://markaon-rho.vercel.app/)
- **GitHub:** [@Mark1codes](https://github.com/Mark1codes)
- **LinkedIn:** [mark-angelo-gargoles](https://www.linkedin.com/in/mark-angelo-gargoles-4787b428a)

