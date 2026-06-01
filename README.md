# Fira PM

An ops-portfolio project tracker with slide-ready summary cards and a built-in present mode. Track projects across six operations teams, capture weekly updates, roadmaps, ROI and blockers, then present the portfolio as full-screen slides.

## Features

- **Portfolio summary** — every project grouped by team, with objective, ROI bar and status at a glance.
- **Three detail layouts** — switch any project card between *Brief*, *Report* and *Board* views.
- **Present mode** — full-screen 1280×720 slides (portfolio overview + one slide per project) with keyboard navigation.
- **Inline editor** — add and edit projects, roadmaps/milestones, weekly updates, owners and Slack links.
- **Local persistence** — data is saved to the browser via `localStorage`; load sample projects to explore.

## Tech stack

- [React 18](https://react.dev/)
- [Vite 5](https://vite.dev/)
- IBM Plex Sans / Mono (Google Fonts)

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

## Deploy to Vercel

This is a standard Vite app, so Vercel deploys it with zero configuration:

1. Go to [vercel.com/new](https://vercel.com/new) and sign in (GitHub works).
2. **Import** the `fira_pm` repository. If it isn't listed, use *Adjust GitHub App Permissions* to grant access.
3. Vercel auto-detects **Vite** and fills in the settings — Build Command `npm run build`, Output Directory `dist`, Install Command `npm install`. Leave them as-is.
4. Click **Deploy**. You'll get a live `*.vercel.app` URL in under a minute.

Every push to `main` then deploys automatically, and pull requests get preview URLs. No environment variables are required — the app runs entirely client-side and persists data in `localStorage`.

## Project structure

```
index.html              # Vite entry, loads /src/main.jsx
src/
  main.jsx              # React root + global styles
  App.jsx               # routing, toolbar, detail host, present mode
  data.js              # teams, statuses, storage, formatters, sample data
  components/
    bits.jsx           # icons, status badge, ROI bar, avatar, milestones, slide scaler
    Summary.jsx        # portfolio table + summary slide
    Detail.jsx         # detail card with Brief / Report / Board layouts
    Editor.jsx         # add / edit project modal
  styles/
    app.css            # app shell, summary, modal, present styles
    detail.css         # detail-card / slide layout styles
```

## Usage

On first load the board is empty — click **Load sample projects** to populate it with eight example projects, or **Add project** to start your own. Open any row to see its detail card, switch layouts from the toolbar, and hit **Present** to go full screen. Use the arrow keys (or space) to move between slides and `Esc` to exit.
