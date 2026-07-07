# FLOW.AI - Interactive Virtual Yoga Coach

FLOW.AI is a modern, responsive, and privacy-first web application designed to help users practice yoga correctly in the comfort of their homes. Running entirely inside the client's browser, the application uses advanced machine learning to estimate body posture, validate alignments, and provide real-time vocal feedback.

This project is built using **Next.js (React)** and **Tailwind CSS v4**, designed as a premium showcase for a software engineering portfolio.

---

## 🌟 Key Features

*   **100% Free & Local Processing**: Pose estimation runs locally on the user's CPU/GPU via WebAssembly (WASM). No video data is ever sent to a server.
*   **Dual Interaction Modes**:
    *   **Watch & Learn**: Walk through the steps of any pose at your own pace with looping 2D guide animations and verbal instruction.
    *   **Practice Mode**: Active webcam monitoring, live posture validation, and automated step progression.
*   **Smart Hold-Timer**: Timer only counts down when the posture is correct or partially correct, pausing when alignment is lost.
*   **Priority-Based Feedback Queue**: Corrects posture errors sequentially from the ground up (feet/knees first, then spine, then arms) to avoid overwhelming the user.
*   **Web Speech Feedback**: Uses the browser's native Web Speech API to read instructions and adjustments out loud.
*   **Daily Practice Streaks**: Automatically tracks consecutive days practiced, complete with celebration animations (Canvas-Confetti) on 5 and 10-day milestones.
*   **Version 2 Ready**: Fully prepared hooks to activate an interactive AI Yoga Assistant Q&A panel powered by **LLaMA-3.1-8b-instant** on Groq Cloud.

---

## 🛠️ Technology Stack

*   **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4
*   **Pose Estimation**: Google MediaPipe Pose (WebAssembly CDN loader)
*   **Icons**: Lucide React
*   **Celebrations**: Canvas-Confetti
*   **Audio Engine**: Browser native Web Speech API (`SpeechSynthesis`)
*   **Database & Auth (Optional V2)**: Firebase Authentication & Cloud Firestore
*   **LLM Inference (V2 Chatbot)**: Groq Cloud API (`llama-3.1-8b-instant`)

---

## 📂 Content-Driven Asana Registry

The application is structured around a **folder-per-asana** content registry. The website automatically reads and builds pages for any yoga pose configured inside the `public/asanas/` directory:

```
public/asanas/
├── tadasana/
│   ├── config.json       # Metadata, steps, and mathematical validation rules
│   └── animation.svg     # 2D vector animation demonstrating the posture
├── surya-namaskar/
│   ├── config.json
│   └── animation.svg
...
```

To add a new yoga pose to the library:
1. Create a new folder under `public/asanas/[pose-id]/`.
2. Add a `config.json` detailing the steps and joint parameters (see existing folders for schema).
3. Add a vector `animation.svg` file.
4. Run `npm run build` to rebuild the Next.js static routes.

---

## 📐 Pose Validation Mathematics (Under the Hood)

Pose validation is performed using 2D vector calculations on the 33 keypoints returned by MediaPipe Pose:

### 1. Joint Angle Calculations
To check if a joint (such as the elbow or knee) is bent or straight, we calculate the angle $\theta$ between three points $A$ (shoulder), $B$ (elbow/vertex), and $C$ (wrist):
$$\mathbf{v_1} = A - B, \quad \mathbf{v_2} = C - B$$
$$\theta = \arccos\left(\frac{\mathbf{v_1} \cdot \mathbf{v_2}}{\|\mathbf{v_1}\| \|\mathbf{v_2}\|}\right)$$
We compare this $\theta$ against target angles configured in `config.json` within a set tolerance degree.

### 2. Camera-Distance Normalization
To ensure distance checks (e.g. palms touching) work regardless of whether the user stands close or far from the camera, we calculate a **normalization factor** based on the user's active **Shoulder Width**:
$$\text{Shoulder Width} = \|\text{Left Shoulder} - \text{Right Shoulder}\|$$
All distance comparisons are evaluated relative to this dynamically calculated width.

---

## 🔒 Version 2: Activating the Groq AI Chatbot

In Version 1, the AI Chatbot is **completely hidden** from the UI. To activate the LLaMA-3.1-8b-instant Q&A assistant panel:

1. Copy `.env.example` to a new file named `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Enable the assistant and paste your private Groq API key:
   ```env
   NEXT_PUBLIC_ENABLE_AI_ASSISTANT=true
   GROQ_API_KEY=gsk_your_groq_api_key
   ```
3. *(Optional)* Modify the default chatbot system prompt in `prompts/yoga_coach_system_prompt.txt`.

*Note: `.env.local` and `prompts/yoga_coach_system_prompt.txt` are listed in `.gitignore` to prevent you from committing private keys or prompt files to public GitHub.*

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
Ensure you have Node.js (v18+) installed on your machine.

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production
To build and verify the application:
```bash
npm run build
npm start
```
