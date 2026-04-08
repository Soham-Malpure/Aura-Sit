import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Cpu, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../landing.css";

export default function PairingScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [deviceId, setDeviceId] = useState("");
  const [pairingState, setPairingState] = useState("input"); // 'input', 'connecting', 'success', 'failed'
  const [iconClass, setIconClass] = useState("");
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setDeviceId(e.target.value.toUpperCase());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      startPairing();
    }
  };

  const startPairing = () => {
    const devId = deviceId.trim();
    if (!devId) {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.style.borderColor = "var(--accent-error)";
        setTimeout(() => {
          if (inputRef.current) inputRef.current.style.borderColor = "rgba(0,0,0,0.1)";
        }, 1000);
      }
      return;
    }

    setPairingState("connecting");
    setIconClass("searching");

    // Randomize success/failure based on the input just for pure realism demo
    // If they type "AURA-X792" it works, otherwise random success/fail.
    let willSucceed = Math.random() > 0.4;
    if (devId === "AURA-X792") willSucceed = true; 

    setTimeout(() => {
      setIconClass(willSucceed ? "connected" : "failed");
      setPairingState(willSucceed ? "success" : "failed");
    }, 3000); // 3 second fake loading delay
  };

  const resetState = () => {
    setPairingState("input");
    setIconClass("");
    setDeviceId("");
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="pairing-body">
      <div className="pairing-bg-glow"></div>

      <div className="pairing-card">
        <div className={`hardware-icon ${iconClass}`} id="hardwareIcon">
          <Cpu size={32} />
        </div>

        <h2>Pair Aura-Sit Sensor</h2>
        <p>Wirelessly connect your posture tracking node to the dashboard environment.</p>

        {/* Initial Input State */}
        <div className={`state-layer ${pairingState === "input" ? "active" : ""}`}>
          <div className="pairing-input-group">
            <label htmlFor="deviceId">Device Signature</label>
            <input
              type="text"
              id="deviceId"
              className="pairing-input"
              placeholder="e.g., AURA-X792"
              autoComplete="off"
              spellCheck="false"
              maxLength={12}
              value={deviceId}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
          </div>
          <button className="pairing-button" onClick={startPairing}>
            Connect Device
          </button>
        </div>

        {/* Connecting State */}
        <div className={`state-layer ${pairingState === "connecting" ? "active" : ""}`}>
          <div className="pairing-loader"></div>
          <span className="pairing-status-text pairing-connecting">Searching for Device...</span>
        </div>

        {/* Success State */}
        <div className={`state-layer ${pairingState === "success" ? "active" : ""}`}>
          <span className="pairing-status-text pairing-connected">
            <CheckCircle size={20} /> Successfully Paired
          </span>
          <p style={{ marginBottom: "0px", marginTop: "8px" }}>
            Your node is now bridging data securely.
          </p>
          <button className="pairing-button pairing-dashboard-btn" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>
        </div>

        {/* Failed State */}
        <div className={`state-layer ${pairingState === "failed" ? "active" : ""}`}>
          <span className="pairing-status-text pairing-failed">
            <AlertCircle size={20} /> Connection Failed
          </span>
          <p style={{ marginBottom: "0px", marginTop: "8px" }}>
            Device not found. Ensure it is powered on and within range.
          </p>
          <button className="pairing-button pairing-retry-btn" onClick={resetState}>
            Try Again
          </button>
        </div>

        <button 
          onClick={() => logout()}
          style={{ background: "transparent", color: "var(--text-secondary)", border: "none", marginTop: "32px", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline", opacity: 0.6 }}
        >
          Not your account? Log out
        </button>
      </div>
    </div>
  );
}
