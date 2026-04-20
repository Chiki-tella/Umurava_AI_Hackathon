# TalentAI — AI-Powered Hiring Platform

TalentAI is a full-stack web application that automates candidate screening using Google Gemini AI. Recruiters post jobs and run one-click AI screening that scores, ranks, and explains every applicant. Job seekers get a personalized job feed and a guided application flow.

---

## How It Works

**For Recruiters**
- Sign in with a recruiter account linked to your company
- View only the applicants for your own job postings
- Click "Run AI Screening" — Gemini AI scores each candidate against the job's required skills, experience level, and description
- Get a ranked list with match scores, strengths, skill gaps, a plain-English recommendation, and a radar chart breakdown per candidate

**For Job Seekers**
- Sign up, set your skills and preferences
- Browse a personalized job feed filtered to your profile
- Apply via a 3-step guided form (personal info → skills & experience → education & portfolio)
- Track your applications and see AI match scores

---

## Project Structure

```
/
├── backend/                  # Node.js + Express REST API
│   └── src/
│       ├── ai/               # Gemini AI integration (gemini.service.ts)
│       ├── controllers/      # Route handlers (jobs, applicants, screening)
│       ├── services/         # Business logic
│       ├── models/           # Mongoose schemas (Job, Applicant, ScreeningResult)
│       ├── middleware/        # Error handling, file upload (multer)
│       ├── routes/           # Express routers
│       └── utils/            # Helpers, validation (Zod), file parsers
│
├── AI-Screening-Trainer/     # Main Next.js frontend (production app)
│   ├── app/                  # Next.js App Router pages
│   │   ├── auth/             # Sign in / Sign up
│   │   ├── dashboard/        # Recruiter dashboard (protected)
│   │   ├── job/[id]/         # Job details
│   │   ├── apply/[id]/       # Application form
│   │   └── profile/          # User profile & preferences
│   ├── components/           # React components
│   ├── hooks/                # useAuth hook
│   └── lib/                  # Auth logic, application store, mock data
│
└── ai-screening-frontend/    # Earlier prototype frontend (reference only)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, Recharts |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB + Mongoose |
| AI | Google Gemini 1.5 Flash (via REST API) |
| File Parsing | pdf-parse, xlsx, csv-parser |
| Validation | Zod |
| File Uploads | Multer |

---

## Getting Started

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
```

### Frontend

```bash
cd AI-Screening-Trainer
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/jobs` | List all jobs |
| POST | `/api/jobs` | Create a job |
| GET | `/api/jobs/:id` | Get job by ID |
| GET | `/api/applicants` | List all applicants |
| POST | `/api/applicants` | Create an applicant |
| POST | `/api/screen/:jobId` | Run AI screening for a job |
| GET | `/api/results/:jobId` | Get screening results for a job |

---

## Demo Accounts (Frontend)

The frontend uses a local auth demo. Sign in with any of these recruiter emails (no password needed):

| Email | Company |
|---|---|
| `recruiter@techflow.ai` | TechFlow AI |
| `recruiter@designstudio.pro` | DesignStudio Pro |
| `recruiter@cloudnative.io` | CloudNative Inc |
| `recruiter@analytics.labs` | Analytics Labs |
| `recruiter@infra.co` | Infrastructure Co |
| `recruiter@mobilefirst.labs` | MobileFirst Labs |

To test the applicant flow, sign up with any new email and select "Job Seeker".

---

## AI Screening Logic

When a recruiter triggers screening, the backend sends the job details and all applicants to Gemini 1.5 Flash with a structured prompt. The model returns a JSON array where each candidate has:

- `score` — 0–100 match percentage
- `strengths` — what the candidate does well
- `gaps` — missing skills or experience
- `recommendation` — plain-English hiring suggestion
- `rank` — relative position among all candidates

Results are persisted in MongoDB and the top 10 are returned, sorted by score.
