# MockMate AI

An AI-powered mock interview platform that conducts real-time voice interviews, generates personalized questions, and scores your performance using AI feedback.

---

## Features

- Voice interviews with an AI interviewer (real-time speech, not chat)
- Auto-generates interview questions based on role, level, and tech stack
- Scores you across 5 categories: Communication, Technical Knowledge, Problem Solving, Cultural Fit, Confidence
- Full feedback report with strengths and areas to improve
- Dashboard with your interview history and stats
- Firebase authentication (sign up / sign in)

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Auth & Database | Firebase Auth + Firestore |
| Voice AI | Vapi AI (WebRTC voice calls) |
| LLM (questions + feedback) | Google Gemini 2.0 Flash via Vercel AI SDK |
| Speech-to-text | Deepgram (via Vapi) |
| Text-to-speech | ElevenLabs (via Vapi) |
| Forms | React Hook Form + Zod |

---

## Architecture

```
User
 │
 ├── Sign up / Sign in  ──────────────────────► Firebase Auth
 │
 ├── Generate Interview
 │    └── Fills form (role, level, techstack)
 │         └── POST /api/vapi/generate
 │              └── Gemini 2.0 Flash generates questions
 │                   └── Saved to Firestore
 │
 ├── Take Interview (voice call)
 │    └── Browser connects to Vapi WebRTC
 │         ├── Deepgram  → speech-to-text
 │         ├── GPT-4     → AI conversation logic (billed via Vapi)
 │         └── ElevenLabs → AI voice (billed via Vapi)
 │
 └── Feedback
      └── Transcript sent to Gemini 2.0 Flash
           └── Returns structured score + comments
                └── Saved to Firestore → shown on screen
```

> You only need API keys for **Vapi** and **Google Gemini**. Deepgram, GPT-4, and ElevenLabs are managed internally by Vapi.

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Sajeel041/mock_mate_AI.git
cd mock_mate_AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project and fill in the values below:

```env
# ─── Vapi ────────────────────────────────────────────────────────────────────
# Get these from https://dashboard.vapi.ai
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id

# ─── Google Gemini ───────────────────────────────────────────────────────────
# Get this from https://aistudio.google.com/app/apikey
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# ─── App ─────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ─── Firebase Client (public) ────────────────────────────────────────────────
# Get these from Firebase Console → Project Settings → Your Apps
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# ─── Firebase Admin (server-side, keep secret) ───────────────────────────────
# Get these from Firebase Console → Project Settings → Service Accounts → Generate new private key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### 4. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com) and create a project
2. Enable **Authentication** → Email/Password sign-in
3. Enable **Firestore Database** → Start in production mode
4. Go to **Project Settings → Service Accounts** → Generate a new private key (used for the `FIREBASE_ADMIN_*` vars above)

### 5. Set up Vapi

1. Create an account at [vapi.ai](https://vapi.ai)
2. Copy your **Web Token** from the dashboard → use as `NEXT_PUBLIC_VAPI_WEB_TOKEN`
3. Create a **Workflow** for the question-generation flow → copy its ID as `NEXT_PUBLIC_VAPI_WORKFLOW_ID`

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
├── app/
│   ├── (auth)/              # Sign in / Sign up pages
│   ├── (root)/              # Dashboard and interview pages
│   └── api/vapi/generate/   # API route: generates interview questions via Gemini
├── components/
│   ├── Agent.tsx            # Core voice interview component (Vapi integration)
│   ├── interview/           # Interview room UI
│   ├── feedback/            # Feedback report UI
│   ├── dashboard/           # Dashboard sections
│   └── ui/                  # Reusable UI primitives (shadcn/ui)
├── firebase/
│   ├── client.ts            # Firebase client SDK (browser)
│   └── admin.ts             # Firebase Admin SDK (server)
├── lib/
│   ├── actions/
│   │   ├── auth.action.ts   # Sign in, sign up, session helpers
│   │   └── general.action.ts # Interview + feedback CRUD, user stats
│   └── vapi.sdk.ts          # Vapi client instance
├── constants/
│   └── index.ts             # Vapi assistant config, tech mappings, schemas
└── types/
    └── index.d.ts           # Global TypeScript types
```

---

## Environment Variables Reference

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_VAPI_WEB_TOKEN` | [vapi.ai](https://vapi.ai) → Dashboard |
| `NEXT_PUBLIC_VAPI_WORKFLOW_ID` | [vapi.ai](https://vapi.ai) → Workflows |
| `GOOGLE_GENERATIVE_AI_API_KEY` | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Console → Project Settings → Your Apps |
| `FIREBASE_PROJECT_ID` | Firebase Console → Project Settings |
| `FIREBASE_CLIENT_EMAIL` | Firebase Console → Service Accounts → Generate key |
| `FIREBASE_PRIVATE_KEY` | Firebase Console → Service Accounts → Generate key |
