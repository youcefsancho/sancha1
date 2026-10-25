# SANCHA
React + Vite + TypeScript + Tailwind v4 PWA.

    npm install
    cp .env.example .env   # add your YouTube Data API key
    npm run dev

Deploy: `npm run build`, then publish `dist/` (Vercel auto-detects Vite; for GitHub Pages push `dist/` to a gh-pages branch).
Routing uses HashRouter and `base: './'`, so no extra config is needed.
