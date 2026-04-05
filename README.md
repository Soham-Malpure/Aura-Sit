# Aura-Sit 🦴

Aura-Sit is a comprehensive, True IoT customized posture-monitoring ecosystem. By bridging custom node-based hardware with a highly responsive, analytical SaaS dashboard, the project maps real-time user mechanics to actionable health intelligence. 

Instead of relying on a serialized usb tether, Aura-Sit employs a NodeMCU ESP8266 microcontroller streaming raw JSON distancing data via Wi-Fi securely over Websockets to a localized interface.

## Core Features ⚡️
* **Decentralized Posture Engine:** A custom-built AI ruleset (`usePostureEngine.js`) running entirely inside the user's web browser ensures zero-latency calculations and data privacy.
* **Ergonomic Activity Index:** Actively tracks user micro-adjustments (>1.5cm shifts) to encourage dynamic "active sitting" rather than static freezing.
* **Time-to-Fatigue Profiling:** Intelligently times the specific endurance of a user, predicting exactly when their muscles typically fatigue and degrade into postural compression.
* **Biomechanical Risk Mapping:** Translates abstract numeric thresholds into exact anatomical risk factors (e.g., *Cervical Spine Strain* vs *Lumbar Compression*).
* **True IoT Architecture:** Enforces Device Pairing signatures (e.g. `AURA-X792`), preventing data overlap in multi-user environments.

## How to Run Locally 💻

The dashboard involves two independent environments operating simultaneously.

**1. Start the IoT Bridge (Backend)**
```bash
cd backend
npm install
node virtual-device.js
```

**2. Start the Hardware Dashboard (Frontend)**
```bash
cd frontend
npm install
npm run dev
```

> **Note:** To see the Live Analytics, ensure the Data Source is set to "LIVE" and your physical hardware Device ID matches the one input in the Dashboard.
