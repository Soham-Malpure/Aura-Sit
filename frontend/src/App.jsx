import { useState } from "react";
import { usePostureEngine } from "./hooks/usePostureEngine";
import { Header } from "./components/dashboard/Header";
import { SummaryCards } from "./components/dashboard/SummaryCards";
import { RealTimeChart } from "./components/dashboard/RealTimeChart";
import { DataIntelligence } from "./components/dashboard/DataIntelligence";
import { PostureRiskMap } from "./components/dashboard/PostureRiskMap";
import { StretchRecommendations } from "./components/dashboard/StretchRecommendations";
import { DeviceManager } from "./components/dashboard/DeviceManager";
import { HistoryView } from "./components/dashboard/HistoryView";
import { generateCSVReport } from "./utils/export";
import { saveSessionToStorage } from "./utils/storage";
import "./index.css"; 

export default function App() {
  const [activeTab, setActiveTab] = useState("live");
  const [hardwareMode, setHardwareMode] = useState("simulation"); // 'simulation' vs 'live'

  const {
    chestDist, faceDist, postureState, totalMin, badMin,
    pqs, badPct, avgChest, mostStrained, trend, history, insights,
    pairedDeviceId, handlePairDevice, activeShifts, ttfMinutes
  } = usePostureEngine(hardwareMode);

  const handleExport = () => {
    generateCSVReport(history, totalMin);
  };

  const handleSaveSession = () => {
    saveSessionToStorage({ pqs, totalMin, avgChest, badPct });
    alert("Session successfully saved! It will now display in your Historical Trends.");
  };

  return (
    <>
      <Header 
        postureState={postureState} 
        totalMin={totalMin} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onExport={handleExport}
        onSaveSession={handleSaveSession}
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

            {/* Row 1: Live + Score + Sitting + Trend */}
            <SummaryCards 
              chestDist={chestDist} faceDist={faceDist} postureState={postureState}
              pqs={pqs} badPct={badPct} totalMin={totalMin} badMin={badMin}
              avgChest={avgChest} mostStrained={mostStrained} trend={trend}
              activeShifts={activeShifts} ttfMinutes={ttfMinutes}
            />

            {/* Row 2: Chart + Insights */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
              <RealTimeChart history={history} />
              <DataIntelligence insights={insights} history={history} />
            </div>

            {/* Row 3: Skeleton + Stretches */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
              <PostureRiskMap postureState={postureState} />
              <StretchRecommendations postureState={postureState} totalMin={totalMin} />
            </div>
          </>
        ) : (
          <HistoryView />
        )}

        {/* Footer */}
        <div style={{ marginTop: 30, textAlign: "center", fontSize: 11, color: "var(--text-secondary)" }}>
          Aura-Sit — IoT Posture Monitoring System · NodeMCU ESP8266 + HC-SR04 · Firebase Ready
        </div>

      </div>
    </>
  );
}