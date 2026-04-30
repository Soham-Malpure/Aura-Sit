import { StatusDot } from "../common/StatusDot";
import { ScoreRing } from "../common/ScoreRing";
import { MiniBar } from "../common/MiniBar";

export function SummaryCards({ 
  chestDist, faceDist, postureState, 
  pqs, badPct, totalMin, badMin, 
  avgChest, avgFace, mostStrained,
  activeShifts, ttfMinutes, isTracking, hideSittingAnalysis
}) {
  const stateColor = { healthy: "var(--color-healthy)", warning: "var(--color-warning)", danger: "var(--color-danger)" }[postureState];
  const stateLabel = { healthy: "Healthy", warning: "Warning", danger: "Danger" }[postureState];

  return (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: isTracking && !hideSittingAnalysis ? "repeat(2, 1fr)" : "1fr", 
      gap: 16, 
      marginBottom: 20,
      transition: "grid-template-columns 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
    }}>


      {/* Sitting Analysis (Only when tracking and not explicitly hidden) */}
      {isTracking && !hideSittingAnalysis && (
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
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Avg face dist.</span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{avgFace} cm</span>
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
