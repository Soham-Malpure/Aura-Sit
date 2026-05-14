# 🤖 VerteX: Complete Project Context for Claude

Hello Claude! This document serves as the "brain-dump" and context map for the **VerteX** project. Use this reference to understand the complete system architecture, folder structure, code workflows, and recent development milestones.

## 🌟 1. Project Overview

**VerteX** is a comprehensive, "True IoT" posture-monitoring ecosystem. It bridges custom physical hardware (ultrasonic sensors) with a highly responsive, analytical web dashboard. The objective is to map real-time human mechanics to actionable health intelligence without relying on serialized USB connections.

### 🔑 Core Capabilities
- **Decentralized Posture Engine:** A custom-built AI ruleset running entirely inside the user's web browser, ensuring zero-latency calculations and 100% data privacy.
- **Biomechanical Risk Mapping:** Translates abstract numeric thresholds from hardware sensors into anatomical risk factors (e.g., *Cervical Spine Strain*, *Lumbar Compression*).
- **Session Reporting:** Generates downloadable, visual PNG reports of a user's posture analytics over a session using `html2canvas`.
- **Firebase Integration:** Secure user authentication and cloud synchronization of historical session data.

---

## 🏗️ 2. System Architecture

The project consists of three distinct pillars operating simultaneously:

```text
[ Hardware NodeMCU ] ===(Raw distances via WebSockets)==> [ Node.js Relay Server ] <==(WebSockets)==> [ React SaaS Dashboard ]
```

### The 3 Pillars:
1. **Hardware (IoT Edge):** NodeMCU ESP8266 + HC-SR04 sensors. Reads distance to the user's chest and face, applies noise filtering, and broadcasts JSON over Wi-Fi.
2. **Backend (IoT Relay):** A lightweight Node.js Express/WS server that listens for hardware data and instantly relays it to any connected frontend client.
3. **Frontend (The Dashboard):** A Vite React application that receives real-time JSON, authenticates users, analyzes the geometry via the Posture Engine, and renders UI updates.

---

## 🛠️ 3. Technology Stack

- **Frontend:** React 18, Vite, React Router DOM, Custom CSS (No Tailwind by default).
- **Dashboard Utilities:** `html2canvas` for visual report snapshotting.
- **Backend Bridge:** Node.js, Express, `ws` (WebSockets).
- **Hardware:** NodeMCU ESP8266, C++ (Arduino IDE format).
- **Authentication & Database:** Firebase Auth, Firebase Firestore (Cloud Sync).

---

## 📁 4. Directory Structure

```text
vertex/
├── /hardware
│   └── NodeMCU_HCSR04.ino       # C++ firmware flashed to the NodeMCU. Connects to Wi-Fi, reads pins, emits WS payloads.
│
├── /backend
│   ├── package.json
│   └── virtual-device.js        # Node.js WebSocket relay server. Listens on ws://localhost:8080 and relays data between hardware and frontend.
│
└── /frontend
    ├── public/
    └── src/
        ├── /assets              # Static images, UI graphics.
        ├── /components
        │   ├── /common          # Reusable UI parts (Buttons, Navbars).
        │   ├── /dashboard       # Sub-components for analytics (PostureChart, SkeletonViewer, StretchRecommendations).
        │   └── /views           # Route-level Page components (LandingPage, LoginScreen, PairingScreen, DashboardView).
        ├── /context
        │   └── AuthContext.jsx  # Manages Firebase User session globally.
        ├── /hooks               # Custom React hooks (e.g., usePostureEngine.js if extracted).
        ├── /utils               # Helper functions.
        ├── App.jsx              # React Router setup, Protected Routes logic wrapper.
        ├── firebase.js          # Admin/Client initialization of Firebase services.
        ├── index.css            # Global CSS styles (themes, resets).
        └── main.jsx             # React DOM injection point.
```

---

## 🚦 5. Data Flow & Security

### Device Pairing Flow
To prevent random data crossover, the hardware embeds a static Device ID (e.g., `"VERTEX-X792"`) into every JSON payload. The React dashboard will *only* react to data if its internal "Paired Source" setting matches the incoming Device ID.

### Protected Routes
`App.jsx` enforces security via a `ProtectedRoute` wrapper. 
- *Unauthenticated users* are redirected to `/login`.
- *Authenticated users* land on `/pair` to link their hardware before entering `/dashboard`.

### The Relay
The `backend/virtual-device.js` script accepts JSON like this:
```json
{
  "type": "sensor_reading", 
  "deviceId": "VERTEX-X792", 
  "chest": 45, 
  "face": 52
}
```
It broadcasts it to the frontend, but also listens for frontend commands (like `"calibrate"`) and emits those back to the hardware.

---

## 🏃 6. How to Run Locally

You need two terminal windows actively running.

**Terminal 1 (The Bridge):**
```bash
cd backend
npm install
node virtual-device.js # Starts WS on 8080
```

**Terminal 2 (The Dashboard):**
```bash
cd frontend
npm install
npm run dev # Starts Vite server usually on 5173
```

**Hardware:**
The NodeMCU needs its internal C++ variables updated to point to the current Local IPv4 address of the computer running Terminal 1, then flashed via USB.

---

## 📝 7. Recent Development Context

Claude, if you are helping with new features, here are the things recently worked on by the user:
- **Authentication Update:** Just finalized moving away from generic hardware sessions to tying historical session data strictly to individual authenticated Firebase users.
- **Reporting System:** Integrated `html2canvas` so users can generate offline visual reports showing an aggregated Skeleton Risk Assessment calculated over their entire session duration.
- **Hardware Connectivity:** Ongoing stabilization of the `ws://` broadcast logic from the NodeMCU to the dynamically changing local IP of the development machine.

---

## 🧠 8. Posture Engine Calculation Logic

The Decentralized Posture Engine evaluates "bad posture" using a zero-latency, strict distance-threshold algorithm based on the `chest` value (distance from the sensor to the user's chest in cm) received from the NodeMCU. This logic lives in `frontend/src/utils/posture.js`:

- **Healthy (Optimal Posture):** `chest >= 50cm`
  - The user is sitting back. Recorded as healthy.
- **Warning (Neck / Cervical Strain):** `45cm <= chest < 50cm`
  - The user is leaning slightly forward. The system triggers a warning state, mapping the biomechanical strain primarily to the Cervical Spine.
- **Danger (Lower Back / Lumbar Strain):** `chest < 45cm`
  - The user is severely slouching forward. The system triggers a danger state, mapping the biomechanical strain to the Lumbar Spine.

**Analytics Aggregation:**
Every 3 seconds, the current state (`healthy`, `warning`, `danger`) is pushed to the session history. The engine calculates the **Posture Quality Score (PQS)** by tracking the percentage of "Bad Minutes" versus total session minutes. If the user enters warning/danger states frequently within an 18-second rolling window, or if their average distance rapidly declines, the engine fires off intelligent alerts and recommends specific stretches (e.g., "Cat-Cow Stretch" for Danger, "Neck Tilt" for Warning).

**Please use this document as your baseline truth for repository layout, architectural decisions, and current project constraints!**
