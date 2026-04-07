import { SummaryCards } from "./SummaryCards";
import { PostureRiskMap } from "./PostureRiskMap";
import { DataIntelligence } from "./DataIntelligence";

export function SessionReportTemplate({ metrics, history, dateString, isVisible = false }) {
  // Ensure we don't crash if metrics aren't fully populated yet
  if (!metrics) return null;

  // Add the explicit analytics requested by the user
  const maxContiguousGood = history.length > 0 ? history.reduce((acc, h) => {
    if (h.state === "healthy") acc.curr += 3;
    else { acc.max = Math.max(acc.max, acc.curr); acc.curr = 0; }
    return acc;
  }, { max: 0, curr: 0 }).max : 0;

  return (
    <div 
      id="session-report-container" 
      style={{ 
        position: isVisible ? "relative" : "absolute", 
        top: isVisible ? 0 : "-9999px", 
        left: isVisible ? 0 : "-9999px", 
        width: 1200, 
        padding: 40,
        background: "var(--bg-app)", 
        color: "var(--text-primary)",
        fontFamily: "'Inter', sans-serif",
        border: isVisible ? "1px solid var(--border-color)" : "none",
        borderRadius: isVisible ? 12 : 0,
        transform: isVisible ? "scale(0.85)" : "none",
        transformOrigin: "top left",
        margin: isVisible ? "0 auto" : 0
      }}>
        {/* Header */}
        <div style={{ marginBottom: 30, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: 20 }}>
           <div>
             <h1 style={{ margin: 0, fontSize: 24, letterSpacing: "-0.5px" }}>Aura-Sit Analysis Report</h1>
             <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>Date: {dateString}</div>
           </div>
           
           <div style={{
             background: "var(--color-blue)", borderRadius: 10, width: 44, height: 44,
             display: "flex", alignItems: "center", justifyContent: "center",
             fontSize: 16, fontWeight: "bold", color: "white"
           }}>AS</div>
        </div>

        {/* Metrics Row */}
        <SummaryCards {...metrics} isTracking={true} />

        {/* Extra detailed metrics as requested by user */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
           <div className="card" style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid var(--color-healthy)" }}>
             <div className="card-label">Overall Time in Good Posture</div>
             <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-healthy)", marginTop: 8 }}>{metrics.totalMin - metrics.badMin} Minutes</div>
           </div>
           <div className="card" style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid var(--color-blue)" }}>
             <div className="card-label">Maximum Contiguous Good Posture</div>
             <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-blue)", marginTop: 8 }}>{Math.round(Math.max(maxContiguousGood, metrics.totalMin - metrics.badMin > 0 ? (metrics.totalMin - metrics.badMin) * 60 : 0) / 60)} Minutes</div>
           </div>
        </div>

        {/* Deep Dive Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
           <PostureRiskMap postureState={metrics.overallPostureState} />
           <DataIntelligence insights={metrics.insights || []} history={history || []} />
        </div>
        
        {/* Footer */}
        <div style={{ marginTop: 40, textAlign: "center", fontSize: 11, color: "var(--text-secondary)" }}>
          Aura-Sit IoT Posture Monitoring System — Machine-Learning Enhanced Output
        </div>
    </div>
  )
}
