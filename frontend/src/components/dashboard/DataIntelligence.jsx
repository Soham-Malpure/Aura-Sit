import { MiniBar } from "../common/MiniBar";

export function DataIntelligence({ insights, history }) {
  const insightColors = {
    ok: { bg: "var(--insight-healthy-bg)", border: "var(--color-healthy)", text: "var(--color-healthy)" },
    info: { bg: "var(--insight-info-bg)", border: "var(--color-blue)", text: "var(--color-blue)" },
    warn: { bg: "var(--insight-warning-bg)", border: "var(--color-warning)", text: "var(--color-warning)" },
    danger: { bg: "var(--insight-danger-bg)", border: "var(--color-danger)", text: "var(--color-danger)" }
  };

  return (
    <div className="card">
      <div className="card-label" style={{ marginBottom: 12 }}>Data Intelligence</div>
      {insights.length === 0 ? (
        <div style={{
          background: insightColors.ok.bg, borderRadius: 8, padding: "12px 14px",
          border: `1px solid ${insightColors.ok.border}`, fontSize: 13, color: insightColors.ok.text
        }}>
          No anomalies detected. Posture within healthy range.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {insights.map((ins, i) => {
            const m = insightColors[ins.type] || insightColors.info;
            return (
              <div key={i} style={{
                background: m.bg, border: `1px solid ${m.border}`,
                borderRadius: 8, padding: "10px 12px"
              }}>
                <div style={{ fontSize: 12, color: m.text, fontWeight: 500, lineHeight: 1.4 }}>
                  {ins.text}
                </div>
              </div>
            );
          })}
        </div>
      )}


    </div>
  );
}
