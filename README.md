# Ghost-Watch Terminal

The Ghost-Watch C2 Terminal (Apex Tier) with its Advanced Canary Trap System, a terminal-style operational interface built as a React and Vite app with Gemini API integration.

## Stack

- React, Vite, Tailwind CSS, Lucide icons, Motion
- Gemini API through `@google/genai`
- Express and dotenv for server-side configuration

## Getting started

```bash
cp .env.example .env     # then set GEMINI_API_KEY
npm install
npm run dev              # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check with `tsc --noEmit` |

## Configuration

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Required for Gemini API calls |
| `APP_URL` | URL where the app is hosted |

Never commit a real `.env` file.
