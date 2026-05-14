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
             <h1 style={{ margin: 0, fontSize: 24, letterSpacing: "-0.5px" }}>VerteX Analysis Report</h1>
             <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>Date: {dateString}</div>
           </div>
           
           <div style={{
             background: "var(--color-blue)", borderRadius: 10, width: 44, height: 44,
             display: "flex", alignItems: "center", justifyContent: "center",
             fontSize: 16, fontWeight: "bold", color: "white"
           }}>VX</div>
        </div>

        {/* Merged New Analytics (PQS, Stretch, Breakdown) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 30 }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'rgba(34, 145, 255, 0.05)', border: '1px solid rgba(34, 145, 255, 0.2)' }}>
            <div className="card-label" style={{ marginBottom: 12 }}>Posture Quality Score</div>
            <div style={{ fontSize: '4.5rem', fontWeight: 700, color: '#2291FF', textShadow: '0 0 20px rgba(34, 145, 255, 0.3)' }}>{Math.round(metrics.pqs)}</div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(50, 215, 75, 0.1)", padding: "14px 20px", borderRadius: 10, border: "1px solid rgba(50, 215, 75, 0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: "1.1rem" }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#32D74B" }}></div>Healthy Time
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "1.3rem", fontWeight: "bold" }}>{metrics.sessionTotals?.healthy || 0}s</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255, 159, 10, 0.1)", padding: "14px 20px", borderRadius: 10, border: "1px solid rgba(255, 159, 10, 0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: "1.1rem" }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#FF9F0A" }}></div>Warning Time
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "1.3rem", fontWeight: "bold" }}>{metrics.sessionTotals?.warning || 0}s</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255, 69, 58, 0.1)", padding: "14px 20px", borderRadius: 10, border: "1px solid rgba(255, 69, 58, 0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: "1.1rem" }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#FF453A" }}></div>Danger Time
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "1.3rem", fontWeight: "bold" }}>{metrics.sessionTotals?.danger || 0}s</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 30 }}>
          <div className="card">
            <div className="card-label">Average Neck Tilt</div>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white', marginTop: 10 }}>{Math.round(metrics.neckAngle || 0)}°</div>
          </div>
          <div className="card" style={{ background: "linear-gradient(135deg, rgba(34, 145, 255, 0.15), rgba(34, 145, 255, 0.05))", border: "1px solid rgba(34, 145, 255, 0.3)" }}>
            <div className="card-label" style={{ color: "#2291FF", marginBottom: 10 }}>Prescribed Recovery Stretch</div>
            {metrics.currentStretch ? (
              <>
                <div style={{ color: "#2291FF", fontWeight: 700, fontSize: "1.4rem", marginBottom: 8 }}>{metrics.currentStretch.name || metrics.currentStretch.title}</div>
                <div style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.5, fontSize: "1.05rem" }}>{metrics.currentStretch.description || metrics.currentStretch.desc}</div>
              </>
            ) : (
              <div style={{ fontStyle: "italic", opacity: 0.7, fontSize: "1.05rem" }}>
                No severe posture strain detected during this session. Keep up the good work!
              </div>
            )}
          </div>
        </div>

        {/* Legacy Metrics Row */}
        <SummaryCards {...metrics} isTracking={true} hideSittingAnalysis={true} />

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
        
    </div>
  )
}
