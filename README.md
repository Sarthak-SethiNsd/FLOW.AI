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

## 🧘 Yoga Poses Included (16 Supported Poses)

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
| Paschimottanasana (Seated Forward Bend) | Intermediate |
| Surya Namaskar (Sun Salutation) | Intermediate |
| Utkatasana (Chair Pose) | Intermediate |
| Trikonasana (Triangle Pose) | Intermediate |
| Virabhadrasana II (Warrior II) | Intermediate |
| Virabhadrasana I (Warrior I Pose) | Intermediate |

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
- No login or account is required.
