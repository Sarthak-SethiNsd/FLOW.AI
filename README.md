# FLOW.AI — Interactive Virtual Yoga Coach

FLOW.AI is a modern, responsive, and privacy-first website that helps users practice yoga correctly at home. The website runs entirely in the browser — no accounts, no subscriptions, no data sent to any server.

Built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**.

---

## 🌟 What It Does

- **Watch & Learn Mode** — Walk through any yoga pose step by step with a 2D animated guide and spoken instructions out loud via the browser's voice engine.
- **Practice Mode** — Your webcam is used to track your body in real time. The website checks if you are doing the pose correctly and gives live spoken corrections.
- **Smart Hold Timer** — The timer only counts down when your pose is correct. It pauses automatically when your alignment is off, and resumes when you fix it.
- **Priority-Based Corrections** — When your pose has multiple errors, the website corrects them one at a time from the ground up (feet first, then knees, then upper body) so you are not overwhelmed.
- **Voice Feedback** — Every step instruction and correction is spoken out loud using the browser's built-in Web Speech API. No third-party voice service needed.

---

## 🧘 Yoga Poses Included (25 Supported Poses)

| Pose | Difficulty |
|---|---|
| Tadasana (Mountain Pose) | Beginner |
| Balasana (Child's Pose) | Beginner |
| Bhujangasana (Cobra Pose) | Beginner |
| Cat-Cow Flow | Beginner |
| Vrikshasana (Tree Pose) | Beginner |
| Adho Mukha Svanasana (Downward Dog) | Beginner |
| Savasana (Corpse Pose) | Beginner |
| Virasana (Hero Pose) | Beginner |
| Baddha Konasana (Bound Angle Pose) | Beginner |
| Setu Bandhasana (Bridge Pose) | Beginner |
| Malasana (Garland Pose) | Beginner |
| Paschimottanasana (Seated Forward Bend) | Intermediate |
| Surya Namaskar (Sun Salutation) | Intermediate |
| Utkatasana (Chair Pose) | Intermediate |
| Trikonasana (Triangle Pose) | Intermediate |
| Virabhadrasana I (Warrior I Pose) | Intermediate |
| Virabhadrasana II (Warrior II Pose) | Intermediate |
| Kumbhakasana (Plank Pose) | Intermediate |
| Dhanurasana (Bow Pose) | Intermediate |
| Ardha Matsyendrasana (Half Lord of the Fishes Pose) | Intermediate |
| Matsyasana (Fish Pose) | Intermediate |
| Anjaneyasana (Low Lunge) | Intermediate |
| Garudasana (Eagle Pose) | Intermediate |
| Navasana (Boat Pose) | Intermediate |
| Utkata Konasana (Goddess Pose) | Intermediate |

---

## 🛠️ Technology Stack

| What | Technology Used |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Pose Detection | Google MediaPipe Pose (loaded from CDN) |
| Voice Instructions | Browser Web Speech API (SpeechSynthesis) |
| Icons | Lucide React |

---

## ✏️ How to Edit Content

### Editing About & Homepage Text
All website content text is stored in JSON files under `public/content/` so you can easily edit it without changing any code:

- **About Page Text**: [`public/content/about.json`](file:///c:/Users/LENOVO/Desktop/Websites/Yoga-Project/public/content/about.json)
- **Homepage Text**: [`public/content/homepage.json`](file:///c:/Users/LENOVO/Desktop/Websites/Yoga-Project/public/content/homepage.json)

---

## 📂 How Poses Are Structured

Each yoga pose lives in its own folder under `public/asanas/`. The website automatically reads these folders and builds pages for each pose.

```
public/asanas/
├── tadasana/
│   ├── config.json       ← steps, instructions, voice prompts, validation rules
│   └── animation.svg     ← animated 2D stick figure guide
├── balasana/
│   ├── config.json
│   └── animation.svg
...
```

To add a new pose:
1. Create a new folder under `public/asanas/[pose-name]/`
2. Add a `config.json` with the pose steps and rules (follow existing files as a template)
3. Add an `animation.svg` for the animated guide
4. Restart the dev server — the new pose appears automatically

---

## 🔍 How Pose Checking Works

MediaPipe Pose detects 33 points on your body from the webcam. The website then:

1. **Measures joint angles** — For example, checks if your knee is bent at the right angle by calculating the angle between your hip, knee, and ankle points.
2. **Normalises for distance** — If you stand close or far from the camera, the website adjusts automatically using your shoulder width as a reference measurement so checks remain accurate.
3. **Gives corrections in order** — Errors are fixed from feet upward, one at a time.

---

## 🚀 Running Locally

### Requirements
- Node.js v18 or higher

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🔒 Privacy

- The webcam feed is processed **entirely on your device** using WebAssembly.
- No video, images, or body tracking data is ever uploaded to any server.
- No login or account is required to use any yoga feature.

---

## 🔑 Firebase Authentication

Firebase Authentication has been added as the **authentication foundation for the upcoming AI chatbot**. It is not required for any existing yoga functionality.

### What This Means

| Feature | Requires Sign-In? |
|---|---|
| Browse all 25 yoga poses | ❌ No |
| Watch & Learn Mode | ❌ No |
| Practice Mode (real-time pose detection) | ❌ No |
| English / Hindi language switching | ❌ No |
| AI Chatbot | ✅ Yes |

### Authentication Method

**Google Sign-In** (OAuth popup) — no separate FLOW.AI account is needed.

### Architecture

```
FLOW.AI UI
    ↓
useAuth() hook  ←  AuthContext (src/context/AuthContext.js)
    ↓
Firebase Authentication (client-side SDK)
```

Future chatbot integration will call `useAuth()` and check `isAuthenticated` without touching Firebase directly.

### Required Environment Variables

Add these to your `.env.local` file (see `.env.example` for the template):

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Web App ID |

### Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) → create or open your project
2. **Authentication** → **Sign-in method** → Enable **Google** → Save
3. **Project Settings** → **Your apps** → Web app → copy the `firebaseConfig` object
4. Paste each value into `.env.local`
5. **Authentication** → **Settings** → **Authorized domains** → add `localhost` (dev) and your production domain

### Enabling the Chatbot

Once Firebase is configured and a Groq API key is added, set in `.env.local`:

```bash
NEXT_PUBLIC_ENABLE_AI_ASSISTANT=true
```

Unauthenticated users will see a "Sign in with Google" prompt when they click the chatbot button. Authenticated users will get full chatbot access.

---

## 🤖 AI Yoga Chatbot — Groq Configuration

The FLOW.AI chatbot is powered by **Groq** using the **GPT-OSS 20B** model.

### Model

| Setting | Value |
|---|---|
| Provider | Groq |
| Model | GPT-OSS 20B |
| Model identifier | `openai/gpt-oss-20b` |
| Configured via | `GROQ_MODEL` environment variable |

### Required Environment Variables

| Variable | Secret? | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ **Yes — never commit** | Your Groq API key from [console.groq.com](https://console.groq.com) |
| `GROQ_MODEL` | No | Model identifier — set to `openai/gpt-oss-20b` |

### Security Rules for `GROQ_API_KEY`

- **Never** prefix it with `NEXT_PUBLIC_` — that exposes it to every browser visitor
- **Never** hard-code it in any source file
- **Never** commit it to Git (`.env*` is already gitignored)
- The key is read **only** inside the server-side Route Handler at `src/app/api/groq-chat/route.js`
- The browser never receives the key — it only calls `/api/groq-chat`

### Server-Side Architecture

```
Browser (Chatbot UI)
    │  POST /api/groq-chat  { message, history }
    ▼
Next.js Route Handler — src/app/api/groq-chat/route.js  (server only)
    │  reads GROQ_API_KEY and GROQ_MODEL from environment
    ▼
Groq API  →  openai/gpt-oss-20b
    │
    ▼
{ reply }  →  Browser
```

### Enabling the Chatbot

Once Firebase is configured, add your Groq key, and set:

```bash
# In .env.local
GROQ_API_KEY=          # ← paste your real key here (never commit)
GROQ_MODEL=openai/gpt-oss-20b
NEXT_PUBLIC_ENABLE_AI_ASSISTANT=true
```
