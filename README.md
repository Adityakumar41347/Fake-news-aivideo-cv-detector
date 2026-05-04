# AI Detector Client

React + Vite frontend for the AI Content Detector MERN app. It provides the UI for analyzing news text, article URLs, AI/deepfake video descriptions, and CV/resume text.

## Features

- News/text misinformation analysis
- URL scraping and article analysis
- AI video/deepfake signal analysis
- CV/resume AI-writing and quality analysis
- Multi-model comparison toggle
- Analysis history, bookmarks, sharing, and PDF export
- Dashboard charts for trends, verdicts, and content types
- Dark/light theme support

## Tech Stack

- React 18
- Vite 5
- React Router
- Axios
- Recharts
- Lucide React
- React Hot Toast

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Backend Requirement

The client expects the API server to run on:

```text
http://localhost:5000
```

Vite proxies `/api` requests to that backend through `vite.config.js`.

Start the server from the project root's `server` folder before using analysis features.

## Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Build production assets
npm run preview  # Preview production build locally
```

## Project Structure

```text
client/
  src/
    components/   # Navbar, result cards, shared UI
    context/      # Auth and theme context
    pages/        # Home, Dashboard, History, Auth, Shared views
    services/     # Axios API client
    App.jsx
    main.jsx
  index.html
  vite.config.js
```

## Build

Create a production build:

```bash
npm run build
```

The output is written to `dist/`.
