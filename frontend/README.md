# Buddy Frontend

## Local development

1. Copy `.env.example` to `.env`
2. Set `VITE_API_URL`
3. Run:

```bash
npm install
npm run dev
```

## Frontend deployment

This frontend is ready to deploy on Vercel as a Vite app.

### Required environment variable

```bash
VITE_API_URL=https://your-backend-domain.com/api
```

Example:

```bash
VITE_API_URL=https://buddy-api.onrender.com/api
```

### Vercel settings

- Framework Preset: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

### Important backend requirement

If the frontend is deployed on a different domain than the backend, the backend must allow the frontend domain in `ALLOWED_ORIGINS`.

Example:

```bash
ALLOWED_ORIGINS=https://buddy-app.vercel.app,http://localhost:5173
```

Production cookie settings are already configured in the backend for cross-site usage.
