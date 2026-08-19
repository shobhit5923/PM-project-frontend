# GIM Lost & Found — Frontend

React + Vite + Tailwind UI for the campus lost & found app.

## Local development

```bash
cp .env.example .env
# set VITE_API_URL=http://localhost:4000

npm install
npm run dev
```

App: `http://localhost:5173`

## Vercel deployment

1. Import the `test-frontend` GitHub repo into Vercel.
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Set environment variable:

| Name | Example |
|------|---------|
| `VITE_API_URL` | `https://your-backend.vercel.app` |

Redeploy after changing `VITE_API_URL` (Vite inlines it at build time).

Also set `CORS_ORIGIN` on the **backend** to this frontend’s Vercel URL.
