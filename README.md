# Spotlight Portfolio

Portfolio-builder SPA: sign up, fill a profile, pick one of five themed
templates, preview and export.

**Stack:** React 19, TypeScript, Vite, Tailwind, shadcn/ui, framer-motion,
Supabase Auth, REST API to the **Spotlight** Hono backend.

This repo is the **frontend only** (`github.com/aka7shan/spotlight-portfolio`).
The API lives in a **sibling folder** on disk (separate Git repo):

```
Project
├── spotlight-portfolio/    ← this repo (frontend)
└── Spotlight-backend/      ← backend API (push to its own GitHub repo)
```

## Quick start

**Terminal 1 — frontend (this repo)**

```bash
npm install
cp .env.example .env.local
# VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL=http://localhost:8787
npm run dev
```

**Terminal 2 — backend (sibling folder)**

```bash
cd ../Spotlight-backend
npm install
cp .env.example .env
npm run dev
```

Frontend: **http://localhost:5173** · Backend: **http://localhost:8787**

Full Supabase + deploy guide: `../Spotlight-backend/docs/PHASE-0.md`

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## Deploy (Vercel)

Import **this** GitHub repo. Root directory: `.` (default). Set `VITE_*` env vars;
`VITE_API_URL` points at your deployed backend project.
