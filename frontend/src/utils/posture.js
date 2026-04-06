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
