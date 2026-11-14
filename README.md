# ZeroSum — Tic-Tac-Toe (`tictactoe-mark`)

A modern, mobile-first **Tic-Tac-Toe** application (**ZeroSum**) built with **Next.js (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** components.

Built as a practical React & Next.js coding challenge submission, designed to feel fast, responsive on phones and desktops, and clean under the hood.

---

## Live Demo & Repository

- **Live Production App (Vercel):** `https://tictactoe-mark.vercel.app` *(update after deploying)*
- **GitHub Repository:** `https://github.com/Mark1codes/tictactoe-mark`

---

## Features

- **Two Game Modes:**
  - **Player vs. Player (Local 2P):** Play head-to-head on the same device.
  - **Player vs. AI (1P):** Play against a built-in computer opponent with three difficulty levels:
    - **Easy:** Casual random/opportunistic moves.
    - **Medium:** Blocks immediate winning threats and takes winning moves.
    - **Unbeatable (Minimax):** Uses the Minimax algorithm with alpha-beta pruning for optimal play.
- **Win-Line Detection & Highlighting:** Automatically detects horizontal, vertical, and diagonal wins, highlights the 3 winning tiles, and announces the winner or draw state.
- **Live Scoreboard & Streak Tracking:** Tracks **X Wins**, **O Wins**, **Draws**, and current win streaks across rounds, persisted in `localStorage`.
- **Move History & Time Travel:** Step backward or jump to any previous move in the current match, just like the classic React documentation tutorial enhanced for production.
- **Mobile-First & Touch-Friendly UI:**
  - Built specifically to work smoothly on phones (large tap targets, zero layout shift, responsive typography, and clean spacing on small screens).
  - Keyboard-accessible grid cells (`Tab` / `Enter` / `Space`).
- **Quick Controls:** Instant **New Round** button and **Reset Scores** button.

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
tictactoe-mark/
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind CSS directives & theme tokens
│   │   ├── layout.tsx         # Root layout, metadata & mobile viewport config
│   │   └── page.tsx           # Main Tic-Tac-Toe page & game container
│   ├── components/
│   │   ├── GameBoard.tsx      # 3x3 interactive grid with win-line highlighting
│   │   ├── ScoreBoard.tsx     # X / Draw / O score cards & streak indicator
│   │   ├── GameControls.tsx   # Mode selector (PvP / AI), difficulty & reset actions
│   │   ├── MoveHistory.tsx    # Step-by-step move log with time-travel jump buttons
│   │   └── ui/                # Reusable shadcn/ui primitives (Button, Card, Badge)
│   └── lib/
│       ├── game-logic.ts      # Win detection, draw checks & Minimax AI engine
│       └── utils.ts           # Classname helper (clsx + tailwind-merge)
├── public/                    # Static assets & icons
├── package.json
├── tsconfig.json
├── tailwind.config.ts
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
git clone https://github.com/Mark1codes/tictactoe-mark.git
cd tictactoe-mark
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

