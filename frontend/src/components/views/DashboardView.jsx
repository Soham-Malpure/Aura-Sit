import { useState } from "react";
import { usePostureEngine } from "../../hooks/usePostureEngine";
import { Header } from "../dashboard/Header";
import { SummaryCards } from "../dashboard/SummaryCards";
import { RealTimeChart } from "../dashboard/RealTimeChart";
import { DataIntelligence } from "../dashboard/DataIntelligence";
import { PostureRiskMap } from "../dashboard/PostureRiskMap";
import { StretchRecommendations } from "../dashboard/StretchRecommendations";
import { DeviceManager } from "../dashboard/DeviceManager";
import { HistoryView } from "../dashboard/HistoryView";
import { SessionReportTemplate } from "../dashboard/SessionReportTemplate";
import CalibrationButton from "../dashboard/CalibrationButton";
import PostureStateIndicator from "../dashboard/PostureStateIndicator";
import SessionTracker from "../dashboard/SessionTracker";
import ReportGenerator from "../dashboard/ReportGenerator";
import { generateCSVReport, exportVisualSessionReport } from "../../utils/export";
import { saveSessionToFirebase } from "../../utils/storage";
import "../../index.css";

export default function DashboardView() {
  const [activeTab, setActiveTab] = useState("live");
  const [hardwareMode, setHardwareMode] = useState("simulation"); // 'simulation' vs 'live'

  const {
    chestDist, faceDist, postureState, totalMin, badMin, totalSecs, badSecs,
    pqs, badPct, avgChest, avgFace, mostStrained, trend, history, insights,
    pairedDeviceId, handlePairDevice, activeShifts, ttfMinutes,
    isTracking, startTracking, endSession,
    spineState, neckState, neckAngle, postureScore, sessionTotals, currentStretch, baseline, handleCalibrate
  } = usePostureEngine(hardwareMode);

  const [finalReportData, setFinalReportData] = useState(null);

  const handleExport = async () => {
    await generateCSVReport(pairedDeviceId);
  };

  const handleSaveSession = async () => {
    // 1. Capture final data for the report view before engine resets
    const reportDataPayload = {
      metrics: {
        chestDist, faceDist, postureState, pqs, badPct, totalMin, badMin,
        avgChest, mostStrained, activeShifts, ttfMinutes,
        overallPostureState: badPct > 50 ? "danger" : (badPct >= 20 ? "warning" : "healthy"),
        sessionTotals, neckAngle, currentStretch
      },
      history: [...history]
    };
    setFinalReportData(reportDataPayload);

    // 2. Clear Live Engine
    endSession();

    // 3. Navigate to new post-session report tab
    setActiveTab("report");

    // 4. Save to DB background
    const sessionData = {
      pqs,
      totalSecs,
      badSecs,
      avgChest,
      avgNeckAngle: neckAngle,
      mostStrained,
      trend,
      activeShifts,
      ttfMinutes
    };

    const success = await saveSessionToFirebase(sessionData, pairedDeviceId);
    if (success) {
      const toast = document.createElement("div");
      toast.innerText = "Session saved ✓";
      toast.style.position = "fixed";
      toast.style.bottom = "20px";
      toast.style.right = "20px";
      toast.style.background = "var(--color-healthy)";
      toast.style.color = "white";
      toast.style.padding = "10px 20px";
      toast.style.borderRadius = "8px";
      toast.style.fontWeight = "bold";
      toast.style.zIndex = "9999";
      toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } else {
      console.log("Failed to save to cloud database, local storage fallback only.");
    }
  };

  return (
    <>
      {activeTab === "live" && (
        <SessionReportTemplate
          metrics={{ chestDist, faceDist, postureState, pqs, badPct, totalMin, badMin, avgChest, mostStrained, activeShifts, ttfMinutes, overallPostureState: badPct > 50 ? "danger" : (badPct >= 20 ? "warning" : "healthy") }}
          history={history}
          dateString={new Date().toLocaleString()}
        />
      )}

      <Header
        postureState={postureState}
        totalMin={totalMin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExport={handleExport}
        onSaveSession={handleSaveSession}
        isTracking={isTracking}
        onStartTracking={startTracking}
        isCalibrated={baseline?.isCalibrated}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px" }}>

        {activeTab === "live" ? (
          <>
            {/* IoT Configuration Panel */}
            <DeviceManager
              hardwareMode={hardwareMode}
              setHardwareMode={setHardwareMode}
              pairedDeviceId={pairedDeviceId}
              handlePairDevice={handlePairDevice}
            />

            <div style={{ marginBottom: 16, display: "flex", gap: 16, alignItems: "stretch" }}>
              <div style={{ flex: 1 }}>
                <PostureStateIndicator
                  postureResult={{ state: postureState, spineState, neckState, neckAngle, score: postureScore, chestDist, faceDist }}
                />
              </div>
              {!isTracking && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CalibrationButton 
                    latestChest={chestDist} 
                    latestFace={faceDist} 
                    onCalibrate={handleCalibrate}
                  />
                </div>
              )}
            </div>

            {isTracking && (
              <div style={{ marginBottom: 24 }}>
                <SessionTracker pqs={postureScore} sessionTotals={sessionTotals} isTracking={isTracking} />
              </div>
            )}

            {/* Always keep Live Posture and Cards at the top */}
            <SummaryCards
              chestDist={chestDist} faceDist={faceDist} postureState={postureState}
              pqs={pqs} badPct={totalMin > 0 ? badPct : 0} totalMin={totalMin} badMin={badMin}
              avgChest={avgChest} avgFace={avgFace} mostStrained={mostStrained} trend={trend}
              activeShifts={activeShifts} ttfMinutes={ttfMinutes}
              isTracking={isTracking}
            />

            {/* Pre-Session Stretches Wrapper (Smoothly animates in/out) */}
            <div className={`collapse-wrapper ${isTracking ? 'hidden' : ''}`} style={{ marginBottom: 20 }}>
              <div className="collapse-inner">
                <StretchRecommendations postureState={postureState} totalMin={totalMin} isPreSession={true} />
              </div>
            </div>

            {/* Main Session Analytics and Active Structure Wrappers (Smoothly animates in/out) */}
            <div className={`collapse-wrapper ${!isTracking ? 'hidden' : ''}`}>
              <div className="collapse-inner">
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
                  <RealTimeChart history={history} />
                  <DataIntelligence insights={insights} history={history} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
                  <PostureRiskMap postureState={postureState} />
                  <StretchRecommendations postureState={postureState} totalMin={totalMin} />
                </div>
              </div>
            </div>
          </>
        ) : activeTab === "report" && finalReportData ? (
          <div style={{ padding: "0 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30, background: "var(--bg-card)", padding: "20px 30px", borderRadius: 12, border: "1px solid var(--border-color)" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 24, color: "var(--text-primary)" }}>Session Complete!</h2>
                <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>Review your post-session analytics and export your poster here.</div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <ReportGenerator
                  pqs={postureScore}
                  sessionTotals={sessionTotals}
                  avgNeckAngle={neckAngle}
                  lastStretch={currentStretch}
                />
                <button
                  onClick={() => setActiveTab("live")}
                  style={{
                    background: "var(--bg-muted)", color: "var(--text-primary)", padding: "10px 20px",
                    borderRadius: 8, fontSize: 14, fontWeight: 600, border: "1px solid var(--border-color)", cursor: "pointer"
                  }}
                >
                  Go to Home Page
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", width: "100%", paddingBottom: "100px" }}>
              {/* Removed fixed height constraint so children can expand and not get cropped */}
              <div style={{ width: 1200, position: "relative" }}>
                <SessionReportTemplate
                  metrics={finalReportData.metrics}
                  history={finalReportData.history}
                  dateString={new Date().toLocaleString()}
                  isVisible={true}
                />
              </div>
            </div>
          </div>
        ) : (
          <HistoryView pairedDeviceId={pairedDeviceId} />
        )}

        {/* Footer */}
        <div style={{ marginTop: 30, textAlign: "center", fontSize: 11, color: "var(--text-secondary)" }}>
          Aura-Sit — IoT Posture Monitoring System · &copy; Soham Malpure
        </div>

      </div>
    </>
  );
}
