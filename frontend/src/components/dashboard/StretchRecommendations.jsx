import { STRETCHES } from "../../utils/posture";

export function StretchRecommendations({ postureState, totalMin }) {
  const stateColor = { healthy: "var(--color-healthy)", warning: "var(--color-warning)", danger: "var(--color-danger)" }[postureState];
  const stateLabel = { healthy: "Healthy", warning: "Warning", danger: "Danger" }[postureState];

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div className="card-label">Recommended Stretches</div>
        <span style={{
          fontSize: 11, padding: "3px 10px", borderRadius: 20,
          background: { healthy: "var(--insight-healthy-bg)", warning: "var(--insight-warning-bg)", danger: "var(--insight-danger-bg)" }[postureState],
          color: stateColor,
          fontWeight: 600, border: "1px solid",
          borderColor: stateColor
        }}>
          Based on: {stateLabel}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {STRETCHES[postureState].map((s, i) => (
          <div key={i} style={{
            borderLeft: `3px solid ${stateColor}`,
            paddingLeft: 14, paddingTop: 12, paddingBottom: 12,
            background: "var(--bg-muted)", borderRadius: "0 8px 8px 0"
          }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Standing reminder */}
      {totalMin > 45 && (
        <div style={{
          marginTop: 16, padding: "12px 16px", background: "var(--insight-info-bg)",
          border: "1px solid var(--color-blue)", borderRadius: 8,
          display: "flex", alignItems: "center", gap: 12
        }}>
          <div style={{
            background: "var(--color-blue)", color: "white", padding: "4px 8px", 
            borderRadius: 6, fontSize: 13, fontWeight: "bold"
          }}>
            ALERT
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-blue)" }}>
              You've been sitting for {totalMin} minutes
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Recommended: stand and walk for at least 5 minutes
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
