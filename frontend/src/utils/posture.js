export const THRESHOLDS = { danger: 45, warning: 50 };
export const MAX_HISTORY = 20;

let baseline = null;
let smoothingWindow = [];

export function calibrate(chest, face) {
  baseline = { chest, face };
  smoothingWindow = [];
  return baseline;
}

export function resetCalibration() {
  baseline = null;
  smoothingWindow = [];
}

export function isCalibrated() {
  return baseline !== null;
}

export function evaluate(chest, face) {
  // Maintain rolling window of last 5
  smoothingWindow.push({ chest, face });
  if (smoothingWindow.length > 5) {
    smoothingWindow.shift();
  }

  // Compute averages
  const avgChest = smoothingWindow.reduce((s, r) => s + r.chest, 0) / smoothingWindow.length;
  const avgFace = smoothingWindow.reduce((s, r) => s + r.face, 0) / smoothingWindow.length;

  // Classify Spine State
  let spineState = "healthy";
  if (baseline) {
    const delta = baseline.chest - avgChest;
    if (delta >= 12) spineState = "danger";
    else if (delta >= 5) spineState = "warning";
  } else {
    spineState = classifyPosture(avgChest);
  }

  // Compute Neck Angle
  const neckAngleRaw = Math.atan2(avgChest - avgFace, 30) * (180 / Math.PI);
  const neckAngle = Math.round(neckAngleRaw * 10) / 10;

  // Classify Neck State
  let neckState = "healthy";
  if (neckAngle >= 20) neckState = "danger";
  else if (neckAngle >= 10) neckState = "warning";

  // Worst State
  const stateWeight = { healthy: 0, warning: 1, danger: 2 };
  const state = stateWeight[spineState] > stateWeight[neckState] ? spineState : neckState;

  // Alerts
  const alerts = [];
  if (spineState === "danger") alerts.push("Severe lower back strain detected.");
  else if (spineState === "warning") alerts.push("Mild forward lean detected.");
  if (neckState === "danger") alerts.push("Severe forward head posture.");
  else if (neckState === "warning") alerts.push("Mild forward head posture.");

  // Stretch Recommendation
  let stretch = null;
  if (state !== "healthy") {
    const possibleStretches = STRETCHES[state];
    stretch = possibleStretches[Math.floor(Math.random() * possibleStretches.length)];
  }

  return {
    state,
    spineState,
    neckState,
    neckAngle,
    alerts,
    stretch,
    smoothedChest: Math.round(avgChest),
    smoothedFace: Math.round(avgFace),
    calibrated: isCalibrated()
  };
}

export function classifyPosture(chest) {
  if (chest < THRESHOLDS.danger) return "danger";
  if (chest < THRESHOLDS.warning) return "warning";
  return "healthy";
}

export function getBodyPart(state) {
  if (state === "danger") return "Lower Back (Lumbar)";
  if (state === "warning") return "Neck (Cervical)";
  return "None";
}

export const STRETCHES = {
  healthy: [
    { title: "20-20-20 Eye Rule", desc: "Every 20 min, look 20 ft away for 20 seconds." },
    { title: "Shoulder Rolls", desc: "Roll shoulders backward 10 times to release tension." },
    { title: "Overhead Reach", desc: "Interlace fingers above head, reach up and hold for 10s." },
    { title: "Wrist Flexor Stretch", desc: "Gently pull fingers back on each hand for 10s." }
  ],
  warning: [
    { title: "Neck Tilt", desc: "Slowly tilt head to each side, hold 10 seconds." },
    { title: "Chin Tuck", desc: "Pull chin straight back. Hold 5s. Repeat 5×." },
    { title: "Upper Trap Stretch", desc: "Gently pull head towards armpit. Hold 15s per side." },
    { title: "Chest Opener", desc: "Clasp hands behind back, squeeze shoulder blades for 10s." }
  ],
  danger: [
    { title: "Cat-Cow Stretch", desc: "Arch and round your spine 10 times slowly." },
    { title: "Seated Spinal Twist", desc: "Twist torso each way and hold 15 seconds." },
    { title: "Stand & Walk", desc: "Take a 2-min break. Walk to reset posture." },
    { title: "Figure-4 Hip Stretch", desc: "Cross ankle over knee while seated, lean forward. 15s/side." },
    { title: "Standing Forward Bend", desc: "Stand and reach for toes to release lower back tension." }
  ]
};
