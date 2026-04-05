export function ScoreRing({ value, size = 72 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (value / 100) * circ;
  const color = value >= 80 ? "var(--color-healthy)" : value >= 60 ? "var(--color-warning)" : "var(--color-danger)";
  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-color)" strokeWidth={7} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={7}
        strokeDasharray={`${fill} ${circ - fill}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fill={color}
        style={{ fontSize: 15, fontWeight: 700 }}>
        {value}%
      </text>
    </svg>
  );
}
