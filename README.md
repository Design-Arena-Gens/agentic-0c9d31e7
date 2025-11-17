# DS Insight Studio

DS Insight Studio is a Next.js web application for rapid exploratory analysis of CSV datasets. Drop in a file (or load one of the bundled samples) to immediately profile schema, inspect per-column statistics, render quick histograms, and preview the data without leaving your browser.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ (bundled with Node)

### Installation

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to use the tool in development.

### Scripts

- `npm run dev` – start the Next.js dev server
- `npm run build` – create a production build
- `npm run start` – serve the production build
- `npm run lint` – run ESLint via `next lint`
- `npm run type-check` – perform a TypeScript check

## Key Features

- Drag-and-drop CSV ingestion with automatic type inference.
- Curated sample datasets for fast demos.
- Descriptive statistics, histogram visualisation, and category breakdown per column.
- Missing value detection, primary key/date inference, and tabular preview with pagination.
- Tailwind CSS-powered dark UI optimised for desktop resolutions.

## Tech Stack

- [Next.js 14 (App Router)](https://nextjs.org/)
- [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PapaParse](https://www.papaparse.com/) for CSV parsing
- [D3 Array/Format/Scale](https://d3js.org/) for statistics and charting helpers
- [Zustand](https://zustand-demo.pmnd.rs/) for state management

## Deployment

The project is configured for zero-config deployment on [Vercel](https://vercel.com/). Run:

```bash
npm run build
vercel deploy --prod
```

Ensure `VERCEL_TOKEN` (or linked CLI login) is available in the environment before deploying.
