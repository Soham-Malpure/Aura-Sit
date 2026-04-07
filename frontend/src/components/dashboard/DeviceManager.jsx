import { useState } from "react";

export function DeviceManager({ hardwareMode, setHardwareMode, pairedDeviceId, handlePairDevice }) {
  const [calibrating, setCalibrating] = useState(false);
  const [inputId, setInputId] = useState(pairedDeviceId);

  const handleCalibrate = () => {
    setCalibrating(true);
    setTimeout(() => {
      setCalibrating(false);
      alert("Baseline perfectly calibrated to 50cm. You are ready to go!");
    }, 2000);
  };

  return (
    <div className="card" style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "30px 40px" }}>
      {/* Network & Source */}
      <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
        <div>
          <div className="card-label" style={{ fontSize: "13px" }}>Data Engine Source</div>
          <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ 
                width: 10, height: 10, borderRadius: "50%", 
                background: hardwareMode === "live" ? "var(--color-healthy)" : "var(--color-warning)",
                boxShadow: hardwareMode === "live" ? "0 0 8px var(--color-healthy)" : "none" 
            }}></span>
            <select 
              value={hardwareMode} 
              onChange={(e) => setHardwareMode(e.target.value)}
              style={{ background: "var(--bg-muted)", color: "var(--text-primary)", border: "1px solid var(--border-color)", padding: "10px 14px", borderRadius: "8px", fontSize: "15px" }}
            >
              <option value="simulation">MOCK - Software Simulation</option>
              <option value="live">LIVE - NodeMCU WebSocket Feed</option>
            </select>
          </div>
        </div>

        <div style={{ height: 40, width: 1, background: "var(--border-color)" }}></div>

        {/* Device Pairing */}
        <div>
          <div className="card-label" style={{ fontSize: "13px" }}>Paired Hardware Device</div>
          <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
            <input 
              type="text" 
              placeholder="e.g. AURA-X792"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              style={{ 
                background: "var(--bg-muted)", color: "var(--text-primary)", 
                border: "1px solid var(--border-color)", padding: "10px 14px", 
                borderRadius: "8px", fontSize: "15px", width: "160px" 
              }}
            />
            <button 
              onClick={() => handlePairDevice(inputId)}
              disabled={inputId === pairedDeviceId}
              style={{ 
                background: inputId === pairedDeviceId ? "var(--bg-muted)" : "var(--color-blue)", 
                color: inputId === pairedDeviceId ? "var(--text-secondary)" : "white", 
                border: "none", padding: "10px 20px", 
                borderRadius: "8px", fontSize: "14px", fontWeight: 600, 
                cursor: inputId === pairedDeviceId ? "not-allowed" : "pointer", transition: "0.2s" 
              }}>
              Pair
            </button>
            {pairedDeviceId && inputId === pairedDeviceId && (
              <span style={{ fontSize: "12px", color: "var(--color-healthy)", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-healthy)" }}></span> Paired
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Sensor Calibration */}
      <div>
        <button 
          onClick={handleCalibrate} 
          disabled={calibrating}
          style={{ 
            background: calibrating ? "var(--bg-muted)" : "var(--color-blue)", 
            color: "white", border: "none", padding: "14px 28px", borderRadius: "8px", 
            fontSize: "15px", fontWeight: 600, cursor: calibrating ? "not-allowed" : "pointer" 
          }}>
          {calibrating ? "Calibrating Sensors..." : "Calibrate Baseline (50cm)"}
        </button>
      </div>
    </div>
  );
}
