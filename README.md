# 🚀 TalentAI — AI-Powered Hiring Platform

> [!IMPORTANT]
> **Live Demo (Staging):** [https://talent-ai-tau.vercel.app/](https://talent-ai-tau.vercel.app/)  
> **Backend API:** [https://talentai-acfq.onrender.com/api-docs](https://talentai-acfq.onrender.com/api-docs)  
> **Documentation:** [Technical Documentation](https://docs.google.com/document/d/1BIws_GbqnGlU4gAes4yDYbPBCggkGD1GE78OEOGdpBk/edit?usp=sharing) | [Presentation Slides Content](https://docs.google.com/presentation/d/15e0-WH_1M_ehpuofFAA3mu8yGX7QowIjhkhmW_uYqUQ/edit?usp=sharing)

TalentAI is a state-of-the-art full-stack web application designed to revolutionize the recruitment process. By leveraging the power of **Google Gemini 1.5 Flash**, it automates candidate screening, providing recruiters with instant, data-driven insights.

---

## 👥 Authors

**Developed by:**
*   **Munezero Impano Christella**
*   **Ahimbazwe Mpuhwe Divine Nikita**

*Developed for the **Umurava AI Hackathon**, showcasing innovative AI-powered recruitment solutions.*

---

## 🛠️ How It Works

### 💼 For Recruiters
*   **Company-Centric View:** Manage applicants specific to your company's job postings.
*   **One-Click AI Screening:** Trigger Gemini AI to evaluate candidates against specific job requirements, skills, and experience.
*   **Insightful Analytics:** Receive ranked lists with match scores, identified strengths, skill gaps, and plain-English recommendations.
*   **Visual Data:** View candidate profiles with radar charts for a quick skills breakdown.

### 🔍 For Job Seekers
*   **Personalized Experience:** Set your skills and preferences to receive a tailored job feed.
*   **Guided Application:** Apply seamlessly through a structured 3-step form (Personal Info → Skills & Experience → Education & Portfolio).
*   **Progress Tracking:** Monitor application statuses and view AI-generated match scores.

---

## 🏗️ Project Structure

```bash
├── backend/                   # Node.js + Express REST API
│   ├── src/
│   │   ├── ai/                # Gemini AI Integration (gemini.service.ts)
│   │   ├── controllers/       # Route Handlers (Jobs, Applicants, Screening)
│   │   ├── middleware/        # JWT Auth, Malter (File Uploads), Error Handling
│   │   ├── models/            # Mongoose Schemas (Job, Applicant, User, etc.)
│   │   ├── routes/            # Express Routers
│   │   ├── services/          # Business Logic & DB Interactions
│   │   ├── utils/             # Helpers, Zod Validation, File Parsers
│   │   └── server.ts          # Entry Point
│   ├── scripts/               # Utility scripts (Seeding, Profile Updates)
│   └── package.json
│
└── AI-Screening-Frontend/      # Next.js 15 Frontend
    ├── app/                   # Next.js App Router (Pages & Layouts)
    ├── components/            # Reusable UI Components
    ├── hooks/                 # Custom React Hooks (Auth, API)
    ├── lib/                   # Utils, Constants, Mock Data
    ├── store/                 # Redux Toolkit (State Management)
    │   ├── slices/            # Redux Slices (Auth, Jobs, etc.)
    │   └── index.ts           # Central Store Configuration
    └── package.json
```

---

## 💻 Tech Stack

### 🎨 Frontend
*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **State Management:** **Redux Toolkit** & React Redux
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **Charts:** Recharts
*   **Theme:** Next-themes (Dark/Light mode support)

### ⚙️ Backend
*   **Runtime:** Node.js
*   **Framework:** Express 5
*   **Language:** TypeScript
*   **Database:** MongoDB with Mongoose ODM
*   **AI Engine:** Google Gemini 1.5 Flash
*   **Security:** JWT (JSON Web Tokens) & Bcrypt (Password Hashing)
*   **Documentation:** **Swagger UI** (OpenAPI)
*   **Validation:** Zod
*   **Parsing:** pdf-parse, xlsx, csv-parser

---

## 🚀 Getting Started

### 📦 Backend Setup

1.  **Navigate to backend:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:** Create a `.env` file in the `backend` folder:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    GEMINI_API_KEY=your_gemini_api_key
    JWT_SECRET=your_jwt_secret
    ```
4.  **Database Seeding (Optional):**
    ```bash
    npm run populate-all  # Populates sample jobs and recruiters
    ```
5.  **Start the server:**
    ```bash
    npm run dev
    ```

### 🖥️ Frontend Setup

1.  **Navigate to frontend:**
    ```bash
    cd AI-Screening-Frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start development server:**
    ```bash
    npm run dev
    ```
4.  **Access the app:** Open [http://localhost:3000](http://localhost:3000).

---

## 📑 API Reference

The backend includes a **Swagger UI** for interactive API documentation. Once the backend is running, you can access it at:
`http://localhost:5000/api-docs` (Note: Port may vary based on your `.env` configuration)

### Key Endpoints:
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login (JWT) |
| GET | `/api/jobs` | Fetch all job listings |
| POST | `/api/screen/:jobId` | Run AI Screening for a specific job |
| GET | `/api/results/:jobId` | Retrieve AI Screening results |

---

## 🤖 AI Screening Logic

Our AI screening engine utilizes **Gemini 1.5 Flash** to perform deep analysis of candidate data against job requirements.
1.  **Context Injection:** Job description, required skills, and candidate resumes are fed into a structured prompt.
2.  **JSON Processing:** The AI returns structured data including:
    *   `score`: (0-100) Match percentage.
    *   `strengths`: Highlights of the candidate's profile.
    *   `gaps`: Identified missing skills or experience.
    *   `recommendation`: A human-readable hiring suggestion.
3.  **Normalization:** Scores are ranked and stored in MongoDB for instant retrieval by recruiters.

---
