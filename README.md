# Aegis Ops Dashboard — Supply Chain Triage UI

Dark-mode operations dashboard for the Aegis Ops supply chain
triage system. Shows real-time vendor delay alerts pulled from
Supabase, with AI-generated draft replies and one-click approval.

## Live Demo
[aegis-ops-dashboard.vercel.app](https://aegis-ops-dashboard.vercel.app)

## Backend Repo
[github.com/Khareef21/aegis-ops-backend](https://github.com/Khareef21/aegis-ops-backend)

## Features
- Real-time triage event cards from Supabase
- CRITICAL / WARNING / OK status badges
- Revenue at risk displayed per alert
- AI-generated vendor reply drafts
- Approve and Reject buttons with live status update
- Summary stats: open events, critical count, total revenue at risk

## Tech Stack
- **Framework:** Next.js (React)
- **Database:** Supabase (real-time PostgreSQL)
- **Hosting:** Vercel (free tier)
- **Styling:** Tailwind CSS

## Local Setup
```bash
git clone https://github.com/Khareef21/aegis-ops-dashboard.git
cd aegis-ops-dashboard
npm install
```

Add these environment variables in a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Run locally:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How it connects
This dashboard reads from the `triage_events` table in Supabase.
Events are created automatically by the FastAPI backend whenever
a vendor email is processed through the `/webhook/email` endpoint.

## Built by
Khareef Shaik — 3rd year B.Tech CSE (AIML)
CMR Institute of Technology, Hyderabad
GitHub: [@Khareef21](https://github.com/Khareef21)
