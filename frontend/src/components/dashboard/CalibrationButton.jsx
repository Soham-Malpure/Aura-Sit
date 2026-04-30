import React, { useState } from "react";
import { calibrate, resetCalibration } from "../../utils/posture";

export default function CalibrationButton({ latestChest, latestFace }) {
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [calibratedValues, setCalibratedValues] = useState({ chest: null, face: null });

  const handleCalibrate = () => {
    calibrate(latestChest, latestFace);
    setCalibratedValues({ chest: latestChest, face: latestFace });
    setIsCalibrated(true);
  };

  const handleRecalibrate = () => {
    resetCalibration();
    setCalibratedValues({ chest: null, face: null });
    setIsCalibrated(false);
  };

  return (
    <div className="calib-container">
      <style>{`
        .calib-container {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(30, 30, 32, 0.5);
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          margin-top: 16px;
        }
        .calib-btn {
          padding: 8px 16px;
          background: rgba(34, 145, 255, 1);
          color: #ffffff;
          border: none; 
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .calib-btn:hover { background: #315bf1ff; }
        .calib-btn-outline {
          padding: 8px 16px;
          background: #ffffff;
          color: rgba(34, 145, 255, 1);
          border: 1px solid #ffffff;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .calib-btn-outline:hover { background: #f0f0f0; }
        .calib-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(50, 215, 75, 0.15);
          color: #32D74B;
          border-radius: 6px;
          border: 1px solid rgba(50, 215, 75, 0.3);
          font-weight: 500;
          font-size: 0.9rem;
        }
        .calib-values {
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
          margin-left: 8px;
        }
      `}</style>

      {!isCalibrated ? (
        <button className="calib-btn" onClick={handleCalibrate}>
          Calibrate Baseline Stance
        </button>
      ) : (
        <>
          <div className="calib-badge">
            ✓ Calibrated
            <span className="calib-values">
              Chest: {calibratedValues.chest}cm | Face: {calibratedValues.face}cm
            </span>
          </div>
          <button className="calib-btn-outline" onClick={handleRecalibrate}>
            Recalibrate
          </button>
        </>
      )}
    </div>
  );
}
