import { useState, useEffect } from "react";
import { getHistoryFromFirebase } from "../../utils/storage";

export function HistoryView({ pairedDeviceId }) {
  const [savedSessions, setSavedSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getHistoryFromFirebase(pairedDeviceId);
      setSavedSessions(data);
      setIsLoading(false);
    }
    loadData();
  }, [pairedDeviceId]);

  const getHeatmapColor = (pqs) => {
    if (pqs >= 85) return "var(--color-healthy)";
    if (pqs >= 60) return "rgba(245, 158, 11, 0.6)"; // Warning
    if (pqs > 0) return "var(--insight-danger-bg)"; // Danger
    return "var(--bg-muted)"; // No data
  };

  const aggregateScore = savedSessions.length > 0 
    ? Math.round(savedSessions.reduce((sum, s) => sum + s.pqs, 0) / savedSessions.length)
    : 0;

  const totalMinRecorded = savedSessions.reduce((sum, s) => sum + s.totalMin, 0);

  // Generate 30 day blocks (pad with zeroes for empty days)
  const mapData = [...savedSessions.map(s => s.pqs)];
  while (mapData.length < 30) {
    mapData.unshift(0); // Pad start with no-data
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>Historical Posture Trends</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Review aggregate sitting data synced from the cloud for Device ID: <strong>{pairedDeviceId || "Anonymous"}</strong></p>
        </div>
      </div>
      
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
          Loading cloud payload securely...
        </div>
      ) : (
        <>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
        <div className="card">
          <div className="card-label">Average Saved Score</div>
          <div style={{ fontSize: 32, fontWeight: 700, margin: "10px 0", color: aggregateScore >= 80 ? "var(--color-healthy)" : "var(--color-warning)" }}>
            {savedSessions.length ? `${aggregateScore}%` : "N/A"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Based on {savedSessions.length} recorded sessions.</div>
        </div>
        <div className="card">
          <div className="card-label">Saved Sessions</div>
          <div style={{ fontSize: 24, fontWeight: 700, margin: "10px 0" }}>{savedSessions.length} Logs</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Data securely localized.</div>
        </div>
        <div className="card">
          <div className="card-label">Total Engaged Time</div>
          <div style={{ fontSize: 32, fontWeight: 700, margin: "10px 0" }}>{totalMinRecorded}<span style={{fontSize: 16, color: "var(--text-secondary)"}}> min</span></div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Across all localized saves.</div>
        </div>
      </div>

      {/* Heatmap Simulation */}
      <div className="card" style={{ padding: "30px" }}>
        <div className="card-label" style={{ marginBottom: 16 }}>Alignment Consistency Heatmap</div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", maxWidth: "600px" }}>
          {mapData.map((pqs, i) => (
            <div 
              key={i} 
              style={{ 
                width: 24, height: 24, borderRadius: 4, 
                backgroundColor: getHeatmapColor(pqs),
                border: "1px solid rgba(255,255,255,0.05)"
              }}
              title={pqs > 0 ? `Session Score: ${pqs}%` : "No data"}
            />
          ))}
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 15, fontSize: 11, color: "var(--text-secondary)", alignItems: "center" }}>
          <span>Less Healthy</span>
          <div style={{ display: "flex", gap: 4 }}>
            {[1,2,3,4].map(l => (
              <div key={l} style={{ width: 12, height: 12, borderRadius: 2, background: getHeatmapColor(l) }}></div>
            ))}
          </div>
          <span>More Healthy</span>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
