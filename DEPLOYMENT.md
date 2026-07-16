# Tutor Assistant AI Deployment

## Backend on Render

Create a Render Web Service from this repository.

Use these settings:

```txt
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Environment variables:

```txt
NODE_ENV=production
NODE_VERSION=20
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_jwt_secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_real_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash
CLIENT_ORIGIN=https://your-vercel-app.vercel.app
```

After deployment, confirm the backend health check:

```txt
https://your-render-service.onrender.com/health
```

## Frontend on Vercel

Create a Vercel project from this repository.

Use these settings:

```txt
Root Directory: client
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Environment variables:

```txt
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

After the Vercel deployment URL is available, update the Render backend variable:

```txt
CLIENT_ORIGIN=https://your-vercel-app.vercel.app
```

Then redeploy the Render service.

## Deployment Order

1. Deploy backend to Render.
2. Copy the Render backend URL.
3. Deploy frontend to Vercel with `VITE_API_BASE_URL` set to the Render URL.
4. Copy the Vercel frontend URL.
5. Update Render `CLIENT_ORIGIN` to the Vercel URL.
6. Redeploy Render.
7. Test worksheet, quiz, homework, lesson plan, and topic explainer generation.
