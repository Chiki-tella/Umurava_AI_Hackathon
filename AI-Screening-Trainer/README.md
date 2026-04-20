# TalentAI — Smart Hiring Assistant

An AI-powered web app that screens and ranks job applicants to help recruiters hire faster and smarter.

## What it does

**For Job Seekers**
- Sign up and specify preferred roles, locations, and skills
- Browse a personalized job feed filtered to your preferences
- Apply to jobs with a 3-step guided form
- Track your applications and see AI match scores

**For Recruiters**
- Sign in with a recruiter account tied to your company
- See only the applicants for your own job postings
- Run AI screening in one click — candidates are scored, ranked, and explained
- Expand any candidate to see a full profile with a radar chart breakdown

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 3 with custom dark theme
- **Animations**: Framer Motion
- **Charts**: Recharts (radar chart for candidate assessment)
- **Auth**: Client-side localStorage auth (demo — swap for NextAuth/Supabase in production)
- **Language**: TypeScript

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── auth/             # Sign in / Sign up
│   ├── dashboard/        # Recruiter dashboard (protected)
│   ├── job/[id]/         # Job details
│   ├── apply/[id]/       # Application form (applicants only)
│   ├── profile/          # User profile & preferences
│   ├── layout.tsx
│   └── page.tsx          # Job feed (applicants only)
├── components/           # React components
│   ├── AuthPage.tsx      # Sign in / sign up UI
│   ├── AuthProvider.tsx  # Auth context
│   ├── RouteGuard.tsx    # Role-based access control
│   ├── Navbar.tsx
│   ├── JobsPage.tsx      # Filtered job feed
│   ├── JobCard.tsx
│   ├── JobDetailsClient.tsx
│   ├── ApplicationFormClient.tsx
│   ├── RecruiterDashboard.tsx
│   ├── ProfilePage.tsx
│   ├── HeroSection.tsx
│   └── StatsBar.tsx
├── hooks/
│   └── useAuth.ts
├── lib/
│   ├── auth.ts           # Auth logic + user store
│   ├── applications.ts   # Application store + AI scoring
│   └── mockData.ts       # Jobs & seed data
└── public/
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts

Sign in with any of these recruiter emails (no password needed — demo mode):

| Email | Company | Jobs |
|-------|---------|------|
| `recruiter@techflow.ai` | TechFlow AI | Senior Frontend Engineer |
| `recruiter@designstudio.pro` | DesignStudio Pro | Product Designer |
| `recruiter@cloudnative.io` | CloudNative Inc | Full Stack Developer |
| `recruiter@analytics.labs` | Analytics Labs | Data Scientist |
| `recruiter@infra.co` | Infrastructure Co | DevOps Engineer |
| `recruiter@mobilefirst.labs` | MobileFirst Labs | Mobile App Developer |

To test the applicant flow, sign up with any new email and select "Job Seeker".

## How the AI Scoring Works

When a recruiter runs screening, each application is scored against the job's required skills:

1. **Skill match** — percentage of required skills found in the applicant's skill list
2. **Experience bonus** — detailed experience descriptions score higher
3. **Education bonus** — university/college degrees add points
4. **Portfolio bonus** — providing a GitHub/portfolio link adds points

The final score (0–98%) determines the ranking and generates strengths, gaps, and a recommendation.
