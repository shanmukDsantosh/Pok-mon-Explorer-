# ⚡ Pokémon Explorer

A production-ready, visually stunning **Pokémon Explorer** application built from scratch using **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **Lucide React**, and **React Router v7**.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 🌟 Key Features

1. **PokéAPI Optimization & Quirks Handling**:
   - Fetches paginated Pokémon lists (`/pokemon?limit=20&offset=0`) and concurrently resolves full Pokémon details (artwork, types, stats, cries, abilities) using `Promise.all`.
   - In-memory `Map` caching to prevent redundant network calls and avoid rate limits.

2. **Type-Based Color System & Glassmorphism UI**:
   - Cards feature dynamic gradients based on primary Pokémon types:
     - **Fire**: `from-red-400 to-orange-500`
     - **Water**: `from-blue-400 to-cyan-500`
     - **Grass**: `from-green-400 to-emerald-500`
     - **Electric**: `from-yellow-300 to-amber-400`
     - **Psychic**: `from-pink-400 to-fuchsia-500`
     - **Ghost**: `from-purple-500 to-indigo-600`
     - **Ice**: `from-cyan-300 to-blue-400`
     - **Dragon**: `from-indigo-500 to-purple-600`
     - **Dark**: `from-gray-600 to-slate-800`
     - **Fairy**: `from-pink-300 to-rose-400`
     - **Normal / Default**: `from-gray-300 to-slate-400`
   - Smooth hover translation (`hover:-translate-y-2 hover:shadow-2xl transition-all duration-300`).

3. **Search, Filtering & Sorting**:
   - **Debounced Search**: Real-time 300ms search by Pokémon name or Pokédex number (`#0025` or `pikachu`).
   - **Type Filter**: Horizontal scrollable pills on mobile, flex-wrap on desktop for "All" + all 18 Pokémon types.
   - **Sort Options**: Sort by ID (Low to High / High to Low), Name (A-Z / Z-A), or HP Stat (High to Low).
   - **Favorites**: Heart button to toggle favorites; stored in `localStorage` with a "Show Favorites Only" quick filter.

4. **Detailed Modal & Stat Progress Bars**:
   - High-definition official artwork with Shiny sprite toggle.
   - Audio Cry Player (`cries.latest.ogg`).
   - Height (meters & feet) and Weight (kg & lbs) unit conversions.
   - Base Stat Total (BST) calculation.
   - **Visual Stat Progress Bars**: Dynamic progress bars mapped against maximum stat value of 255 (`(stat.value / 255) * 100%`) with color thresholds.
   - Keyboard accessibility (`Escape` key closes modal; `Enter` opens focused cards).
   - Prev/Next modal navigation controls.

5. **Deep Linking URL Routing**:
   - Built with `react-router-dom` v7 supporting deep link routes like `/pokemon/pikachu`.

---

## 📁 Architecture & Folder Structure

```
pokedex/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI (Button, Skeleton, Modal, ErrorState, EmptyState)
│   │   ├── layout/       # Header, Footer
│   │   ├── pokemon/      # PokemonCard, PokemonGrid, PokemonModal, TypeBadge
│   │   └── filters/      # SearchBar, TypeFilter, SortDropdown
│   ├── hooks/            # usePokemon, useDebounce, useLocalStorage
│   ├── services/         # pokemonApi.ts (Fetch wrapper with parallel detail resolution & caching)
│   ├── types/            # pokemon.ts (TypeScript interfaces)
│   ├── utils/            # typeColors.ts, formatters.ts
│   ├── context/          # PokemonContext.tsx, ThemeContext.tsx
│   ├── App.tsx           # Route setup & layout wiring
│   ├── main.tsx          # Application entry point
│   └── index.css         # Tailwind directives, animations & custom scrollbars
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Navigate to project root:
   ```bash
   cd pokedex
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🧪 Quality & Verification

- **Type Safety**: Strictly typed with zero `any` usage. Verified via `npx tsc --noEmit`.
- **Production Build**: Verified with `npm run build` (Vite build target passed with 0 errors).
