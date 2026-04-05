export const THRESHOLDS = { danger: 45, warning: 50 };
export const MAX_HISTORY = 20;

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
    { title: "Shoulder Rolls", desc: "Roll shoulders backward 10 times to release tension." }
  ],
  warning: [
    { title: "Neck Tilt", desc: "Slowly tilt head to each side, hold 10 seconds." },
    { title: "Chin Tuck", desc: "Pull chin straight back. Hold 5s. Repeat 5×." }
  ],
  danger: [
    { title: "Cat-Cow Stretch", desc: "Arch and round your spine 10 times slowly." },
    { title: "Seated Spinal Twist", desc: "Twist torso each way and hold 15 seconds." },
    { title: "Stand & Walk", desc: "Take a 2-min break. Walk to reset posture." }
  ]
};
