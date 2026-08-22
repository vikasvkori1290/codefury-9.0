# 🚀 ModelHub 9.0 — Production Deployment Guide
**Frontend**: Netlify | **Backend**: Vercel | **Database**: MongoDB Atlas | **Uptime**: 24/7 Zero Cold-Start

---

## 📑 Table of Contents
1. [Backend Deployment on Vercel](#1-backend-deployment-on-vercel)
2. [Frontend Deployment on Netlify](#2-frontend-deployment-on-netlify)
3. [Environment Variables Matrix](#3-environment-variables-matrix)
4. [24/7 Zero Downtime / Never-Sleep Strategy](#4-247-zero-downtime--never-sleep-strategy)
5. [Pre-Flight Verification Checklist](#5-pre-flight-verification-checklist)

---

## 1. Backend Deployment on Vercel

The backend Express application is fully configured for Vercel Serverless with [`server/vercel.json`](./server/vercel.json) and CORS support.

### Step-by-Step Instructions:
1. Push your latest code to your GitHub repository (e.g. `main` branch).
2. Go to **[Vercel Dashboard](https://vercel.com/dashboard)** and click **"Add New..."** ➔ **"Project"**.
3. Select and import your GitHub repository: `codefury-9.0`.
4. Configure Project Settings:
   - **Framework Preset**: `Other`
   - **Root Directory**: Click **Edit** and choose **`server`**
5. Open **Environment Variables** and add:
   ```env
   PORT=5000
   NODE_ENV=production
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   GROQ_API_KEY=your_groq_api_key
   GROK_API_KEY=your_grok_api_key
   GMAIL_USER=your_email@gmail.com
   GMAIL_APP_PASS=your_16_digit_app_password
   CLIENT_URL=https://your-app-name.netlify.app
   ```
6. Click **"Deploy"**.
7. Copy your production Vercel backend domain (e.g., `https://codefury-server.vercel.app`).

---

## 2. Frontend Deployment on Netlify

The frontend Vite SPA is pre-configured with [`client/public/_redirects`](./client/public/_redirects) and [`client/netlify.toml`](./client/netlify.toml) so that all React Router paths (`/live-bench`, `/models`, `/test`, `/login`, etc.) reload seamlessly without 404s.

### Step-by-Step Instructions:
1. Go to **[Netlify Dashboard](https://app.netlify.com/)** and click **"Add new site"** ➔ **"Import an existing project"**.
2. Connect your GitHub account and choose the repository `codefury-9.0`.
3. In **Site configuration**:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist` (or `dist`)
4. In **Environment variables**, click **"Add a variable"**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://codefury-server.vercel.app/api` *(replace with your actual Vercel backend URL)*
5. Click **"Deploy site"**.
6. Once deployed, copy your Netlify domain (e.g. `https://modelhub-ai.netlify.app`).
7. Update the `CLIENT_URL` variable in your Vercel project settings to match your Netlify domain.

---

## 3. Environment Variables Matrix

### Backend (`server/.env` / Vercel Environment Variables):
| Variable | Description | Example / Value |
| :--- | :--- | :--- |
| `PORT` | Local runtime port | `5000` |
| `NODE_ENV` | Environment mode | `production` |
| `MONGO_URI` | MongoDB Atlas Connection String | `your_mongodb_connection_uri` |
| `JWT_SECRET` | Secret key for signing auth tokens | `your_jwt_secret_key` |
| `JWT_EXPIRE` | Auth session duration | `7d` |
| `GROQ_API_KEY` | Fast LLM inference API key | `your_groq_api_key` |
| `GROK_API_KEY` | Grok / xAI inference API key | `your_grok_api_key` |
| `GMAIL_USER` | Gmail address for sending OTPs | `you@gmail.com` |
| `GMAIL_APP_PASS` | 16-character Google App Password | `abcd efgh ijkl mnop` |
| `CLIENT_URL` | Frontend domain allowed by CORS | `https://your-app.netlify.app` |

### Frontend (`client/.env` / Netlify Environment Variables):
| Variable | Description | Example / Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base endpoint URL for backend API | `https://codefury-server.vercel.app/api` |

---

## 4. 24/7 Zero Downtime / Never-Sleep Strategy

We implemented a **triple-layer heartbeat mechanism** so the backend server is always warm, responsive, and never enters idle sleep:

```
┌─────────────────────────────────────────────────────────────┐
│                   TRIPLE-LAYER HEARTBEAT                    │
├──────────────────────────────┬──────────────────────────────┤
│ 1. In-App Backend Heartbeat  │ Auto 8-min DB & API ping     │
│ 2. Frontend Visitor Pulse    │ Auto 8-min client heartbeat  │
│ 3. External Uptime Monitor   │ 24/7 external cron ping      │
└──────────────────────────────┴──────────────────────────────┘
```

### Layer 1: In-App Backend Heartbeat (Built-In)
- Automatically initialized on server boot (`server/services/selfPing.service.js`).
- Pings MongoDB every **8 minutes** to prevent connection pool disconnects.
- Automatically self-pings `/api/health`.

### Layer 2: Frontend Visitor Pulse (Built-In)
- Automatically fires `/api/health` whenever any user visits the site (`client/src/App.jsx`).
- Keeps the backend warm while users are exploring the platform.

### Layer 3: Free 24/7 External Ping (100% Guaranteed Uptime)
To guarantee your backend never sleeps even when nobody is on the website:
1. Go to **[UptimeRobot](https://uptimerobot.com/)** (Free forever).
2. Click **"Add New Monitor"**:
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `ModelHub Backend`
   - **URL**: `https://your-vercel-backend.vercel.app/api/health`
   - **Monitoring Interval**: `Every 5 minutes`
3. Click **"Create Monitor"**.

---

## 5. Pre-Flight Verification Checklist

After deploying both frontend and backend:

- [ ] **Health Endpoint**: Visit `https://your-vercel-backend.vercel.app/api/health` ➔ Should return status `200 OK` with `"status": "ok"`.
- [ ] **Frontend Pages**: Open Netlify URL and navigate between `/live-bench`, `/models`, and `/login`.
- [ ] **SPA Reload Check**: Refresh the browser on `/live-bench` ➔ Page should re-render cleanly without 404.
- [ ] **Email OTP Sign-Up**: Test creating an account on `/register` ➔ Receive 6-digit OTP code in email and verify.
- [ ] **Direct Login**: Sign in on `/login` with credentials ➔ Successful instant authentication.
- [ ] **Route Protection**: Try opening `/test` or `/compare` in an Incognito window ➔ Successfully redirected to `/login`.
- [ ] **Benchmark Engine**: Log in, go to `/test`, and run a custom or preset benchmark.
