import React, { useState, useEffect } from 'react';

export default function SessionTracker({ pqs = 100, sessionTotals = { healthy: 0, warning: 0, danger: 0 }, isTracking = false }) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const totalTime = sessionTotals.healthy + sessionTotals.warning + sessionTotals.danger;

  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  useEffect(() => {
    if (totalTime === 0) {
      setSecondsElapsed(0);
    }
  }, [totalTime]);

  const formatTime = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSecs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };
  const pHealthy = totalTime > 0 ? (sessionTotals.healthy / totalTime) * 100 : 0;
  const pWarning = totalTime > 0 ? (sessionTotals.warning / totalTime) * 100 : 0;
  const pDanger = totalTime > 0 ? (sessionTotals.danger / totalTime) * 100 : 0;

  return (
    <div className="st-container">
      <style>{`
        .st-container {
          background: rgba(30, 30, 32, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          color: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .st-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .st-pqs-wrapper {
          display: flex;
          flex-direction: column;
        }
        .st-pqs-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
          font-weight: 600;
        }
        .st-pqs-value {
          font-size: 2.8rem;
          font-weight: 800;
          line-height: 1;
          color: #2291FF;
          text-shadow: 0 0 20px rgba(34, 145, 255, 0.4);
        }
        .st-timer-wrapper {
          text-align: right;
        }
        .st-timer-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 6px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .st-timer-value {
          font-size: 1.5rem;
          font-family: 'Courier New', Courier, monospace;
          font-weight: 700;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.4);
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          letter-spacing: 2px;
        }
        .st-bar-container {
          width: 100%;
          height: 14px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          display: flex;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .st-bar-segment {
          height: 100%;
          transition: width 0.5s ease;
        }
        .st-bar-healthy { background-color: #32D74B; }
        .st-bar-warning { background-color: #FF9F0A; }
        .st-bar-danger { background-color: #FF453A; }
        
        .st-legend {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }
        .st-legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .st-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
      `}</style>

      <div className="st-header">
        <div className="st-pqs-wrapper">
          <div className="st-pqs-label">Posture Quality Score</div>
          <div className="st-pqs-value">{Math.round(pqs)}</div>
        </div>
        <div className="st-timer-wrapper">
          <div className="st-timer-label">Session Duration</div>
          <div className="st-timer-value">{formatTime(secondsElapsed)}</div>
        </div>
      </div>

      <div className="st-bar-container">
        {totalTime === 0 ? (
          <div className="st-bar-segment" style={{ width: "100%", background: "rgba(255,255,255,0.05)" }}></div>
        ) : (
          <>
            <div className="st-bar-segment st-bar-healthy" style={{ width: `${pHealthy}%` }}></div>
            <div className="st-bar-segment st-bar-warning" style={{ width: `${pWarning}%` }}></div>
            <div className="st-bar-segment st-bar-danger" style={{ width: `${pDanger}%` }}></div>
          </>
        )}
      </div>

      <div className="st-legend">
        <div className="st-legend-item">
          <div className="st-dot" style={{ backgroundColor: "#32D74B" }}></div>
          Healthy ({Math.round(pHealthy)}%)
        </div>
        <div className="st-legend-item">
          <div className="st-dot" style={{ backgroundColor: "#FF9F0A" }}></div>
          Warning ({Math.round(pWarning)}%)
        </div>
        <div className="st-legend-item">
          <div className="st-dot" style={{ backgroundColor: "#FF453A" }}></div>
          Danger ({Math.round(pDanger)}%)
        </div>
      </div>
    </div>
  );
}
