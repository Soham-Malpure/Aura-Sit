import { StatusDot } from "../common/StatusDot";
import { ScoreRing } from "../common/ScoreRing";
import { MiniBar } from "../common/MiniBar";

export function SummaryCards({ 
  chestDist, faceDist, postureState, 
  pqs, badPct, totalMin, badMin, 
  avgChest, mostStrained,
  activeShifts, ttfMinutes, isTracking
}) {
  const stateColor = { healthy: "var(--color-healthy)", warning: "var(--color-warning)", danger: "var(--color-danger)" }[postureState];
  const stateLabel = { healthy: "Healthy", warning: "Warning", danger: "Danger" }[postureState];

  return (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: isTracking ? "repeat(4, 1fr)" : "1fr", 
      gap: 16, 
      marginBottom: 20,
      transition: "grid-template-columns 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
    }}>
      {/* Live Posture */}
      <div className="card" style={{ borderTop: `3px solid ${stateColor}` }}>
        <div className="card-label">Live Posture</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0 6px" }}>
          <StatusDot state={postureState} />
          <span style={{ fontSize: 22, fontWeight: 700, color: stateColor, textTransform: "capitalize" }}>
            {stateLabel}
          </span>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 70 }}>Chest</span>
            <MiniBar pct={Math.min((chestDist / 80) * 100, 100)} color="var(--color-blue)" />
            <span style={{ minWidth: 36, textAlign: "right", fontWeight: 600 }}>{chestDist} cm</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 70 }}>Face</span>
            <MiniBar pct={Math.min((faceDist / 80) * 100, 100)} color="var(--color-healthy)" />
            <span style={{ minWidth: 36, textAlign: "right", fontWeight: 600 }}>{faceDist} cm</span>
          </div>
        </div>
      </div>

      {/* Posture Score (Only when tracking) */}
      {isTracking && (
        <div className="card" style={{ animation: "fadeIn 0.4s ease-out forwards" }}>
        <div className="card-label">Posture Quality Score</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
          <ScoreRing value={pqs} />
          <div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Bad Posture</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{badPct}%</div>
            <div style={{ fontSize: 11, color: pqs >= 80 ? "var(--color-healthy)" : pqs >= 60 ? "var(--color-warning)" : "var(--color-danger)", marginTop: 2, fontWeight: 600 }}>
              Risk: {pqs >= 80 ? "Low" : pqs >= 60 ? "Moderate" : "High"}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Sitting Analysis (Only when tracking) */}
      {isTracking && (
        <div className="card" style={{ animation: "fadeIn 0.5s ease-out forwards" }}>
        <div className="card-label">Sitting Analysis</div>
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{totalMin}m</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", margin: "4px 0 10px" }}>Total sitting time</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)" }}>
              <span>Good posture</span>
              <span style={{ fontWeight: 600, color: "var(--color-healthy)" }}>{totalMin - badMin}m</span>
            </div>
            <MiniBar pct={100 - badPct} color="var(--color-healthy)" />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)" }}>
              <span>Bad posture</span>
              <span style={{ fontWeight: 600, color: "var(--color-danger)" }}>{badMin}m</span>
            </div>
            <MiniBar pct={badPct} color="var(--color-danger)" />
          </div>
        </div>
        </div>
      )}

      {/* Analytics Summary (Only when tracking) */}
      {isTracking && (
        <div className="card" style={{ animation: "fadeIn 0.6s ease-out forwards" }}>
        <div className="card-label">Session Analytics</div>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Avg chest dist.</span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{avgChest} cm</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Most strained</span>
            <span style={{
              fontWeight: 600, fontSize: 12,
              color: mostStrained === "None" ? "var(--color-healthy)" : "var(--color-danger)"
            }}>{mostStrained}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", title: "Organic re-adjustments" }}>Micro-adjustments</span>
            <span style={{ fontWeight: 700, fontSize: 13 }}>{activeShifts} shifts</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", title: "Time to Fatigue Predictor" }}>Fatigue Predictor</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: "var(--color-warning)" }}>
              {ttfMinutes ? `${ttfMinutes} min` : "Calculating..."}
            </span>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
