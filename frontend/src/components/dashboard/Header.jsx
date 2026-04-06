import { StatusDot } from "../common/StatusDot";

export function Header({ postureState, totalMin, activeTab, setActiveTab, onExport, onSaveSession, isTracking, onStartTracking }) {
  const stateColor = { healthy: "var(--color-healthy)", warning: "var(--color-warning)", danger: "var(--color-danger)" }[postureState];
  const stateLabel = { healthy: "Healthy", warning: "Warning", danger: "Danger" }[postureState];

  return (
    <header style={{
      background: "var(--bg-card)", borderBottom: "1px solid var(--border-color)",
      padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center"
    }}>
      {/* Brand & Tabs container */}
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            background: "var(--color-blue)", borderRadius: 10, width: 34, height: 34,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: "bold", color: "white"
          }}>AS</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>Aura-Sit</div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>IoT Posture Monitor</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", background: "var(--bg-app)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <button 
            onClick={() => setActiveTab("live")}
            style={{ 
              background: activeTab === "live" ? "var(--bg-card)" : "transparent",
              color: activeTab === "live" ? "var(--text-primary)" : "var(--text-secondary)",
              border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
          }}>Live Monitor</button>
          <button 
            onClick={() => setActiveTab("history")}
            style={{ 
              background: activeTab === "history" ? "var(--bg-card)" : "transparent",
              color: activeTab === "history" ? "var(--text-primary)" : "var(--text-secondary)",
              border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
          }}>Historical Trends</button>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {!isTracking ? (
          <button 
            onClick={onStartTracking}
            style={{
              background: "var(--color-healthy)", color: "white", 
              border: "none", padding: "6px 16px", 
              borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "0.2s"
            }}>
            ▶ Start Tracking
          </button>
        ) : (
          <button 
            onClick={onSaveSession}
            style={{
              background: "var(--color-danger)", color: "white", 
              border: "none", padding: "6px 16px", 
              borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "0.2s"
            }}>
            ⏹ End & Save Session
          </button>
        )}

        <button 
          onClick={onExport}
          style={{
            background: "transparent", color: "var(--text-primary)", 
            border: "1px solid var(--border-color)", padding: "6px 12px", 
            borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer"
          }}>
          Export CSV
        </button>

        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "var(--bg-muted)", borderRadius: 8, padding: "6px 12px",
          fontSize: 13, color: "var(--text-primary)"
        }}>
          <StatusDot state={postureState} />
          <span style={{ fontWeight: 600, color: stateColor }}>{stateLabel}</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Session: {totalMin}m</div>
      </div>
    </header>
  );
}
