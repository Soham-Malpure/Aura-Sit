import React from "react";
import { MiniBar } from "../common/MiniBar";

export default function PostureStateIndicator({ postureResult }) {
  const { 
    state = "healthy", 
    spineState = "healthy", 
    neckState = "healthy", 
    neckAngle = 0, 
    score = 100,
    chestDist = 0,
    faceDist = 0
  } = postureResult || {};

  const colors = {
    healthy: "#32D74B",
    warning: "#FF9F0A",
    danger: "#FF453A"
  };

  const getLabel = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  
  const stateColor = colors[state] || colors.healthy;
  const spineColor = colors[spineState] || colors.healthy;
  const neckColor = colors[neckState] || colors.healthy;

  return (
    <div className="psi-container">
      <style>{`
        .psi-container {
          background: rgba(30, 30, 32, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 24px;
          color: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .psi-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }
        .psi-main-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .psi-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .psi-chip {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .psi-angle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }
        .psi-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
      `}</style>

      <div className="psi-details">
        <div>
          <div className="psi-main-badge" style={{ backgroundColor: `${stateColor}22`, color: stateColor, border: `1px solid ${stateColor}44` }}>
            {getLabel(state)}
          </div>
        </div>
        
        <div className="psi-chips-row">
          <div className="psi-chip" style={{ backgroundColor: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="psi-dot" style={{ backgroundColor: spineColor }}></div>
            Spine: {getLabel(spineState)}
          </div>
          <div className="psi-chip" style={{ backgroundColor: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="psi-dot" style={{ backgroundColor: neckColor }}></div>
            Neck: {getLabel(neckState)}
          </div>
        </div>

        <div className="psi-angle" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          <div>Neck Tilt: <span style={{ color: "white", fontWeight: 600 }}>{neckAngle}°</span></div>
          
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 45 }}>Chest</span>
              <div style={{ flex: 1 }}>
                <MiniBar pct={Math.min((chestDist / 80) * 100, 100)} color="#2291FF" />
              </div>
              <span style={{ minWidth: 40, textAlign: "right", fontWeight: 600, color: "white" }}>{chestDist} cm</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 45 }}>Face</span>
              <div style={{ flex: 1 }}>
                <MiniBar pct={Math.min((faceDist / 80) * 100, 100)} color="#32D74B" />
              </div>
              <span style={{ minWidth: 40, textAlign: "right", fontWeight: 600, color: "white" }}>{faceDist} cm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
