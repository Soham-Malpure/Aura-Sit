import { useState, useEffect, useRef } from "react";
import { classifyPosture, getBodyPart, MAX_HISTORY, evaluate, calibrate, isCalibrated } from "../utils/posture";

export function usePostureEngine(hardwareMode = "simulation") {
  const socketRef = useRef(null);
  const [chestDist, setChestDist] = useState(55);
  const [faceDist, setFaceDist] = useState(52);
  const [postureState, setPostureState] = useState("healthy");
  const [baseline, setBaseline] = useState(null);
  const [neckAngle, setNeckAngle] = useState(0);
  const [spineState, setSpineState] = useState("healthy");
  const [neckState, setNeckState] = useState("healthy");
  const [currentStretch, setCurrentStretch] = useState(null);

  const handleCalibrate = () => {
    const result = calibrate(chestDist, faceDist);
    setBaseline(result);
  };
  const [totalSecs, setTotalSecs] = useState(0);
  const [badSecs, setBadSecs] = useState(0);
  const [sessionTotals, setSessionTotals] = useState({ healthy: 0, warning: 0, danger: 0 });
  const [history, setHistory] = useState([]);
  const [insights, setInsights] = useState([]);
  const [pairedDeviceId, setPairedDeviceId] = useState(() => localStorage.getItem("aura_device_id") || "");
  const [activeShifts, setActiveShifts] = useState(0);
  const [ttfMinutes, setTtfMinutes] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const isTrackingRef = useRef(isTracking);
  useEffect(() => { isTrackingRef.current = isTracking; }, [isTracking]);

  const analyticsRef = useRef({ lastChest: 50, healthySecs: 0 });

  const startTracking = () => {
    setTotalSecs(0);
    setBadSecs(0);
    setSessionTotals({ healthy: 0, warning: 0, danger: 0 });
    setHistory([]);
    setActiveShifts(0);
    setTtfMinutes(null);
    analyticsRef.current.healthySecs = 0;
    setIsTracking(true);
  };

  const endSession = () => {
    setIsTracking(false);
  };

  const handlePairDevice = (id) => {
    setPairedDeviceId(id);
    localStorage.setItem("aura_device_id", id);
  };

  const pairedDeviceIdRef = useRef(pairedDeviceId);
  useEffect(() => {
    pairedDeviceIdRef.current = pairedDeviceId;
  }, [pairedDeviceId]);

  const processAnalytics = (newChest, state) => {
    const shift = Math.abs(newChest - analyticsRef.current.lastChest);
    if (shift >= 2.5 && state === "healthy") {
      setActiveShifts(prev => prev + 1);
    }
    analyticsRef.current.lastChest = newChest;

    if (state === "healthy") {
      analyticsRef.current.healthySecs += 3;
    } else {
      if (analyticsRef.current.healthySecs > 15) { // 15s Demo threshold
        setTtfMinutes(Math.round(analyticsRef.current.healthySecs / 60) || 1);
      }
      analyticsRef.current.healthySecs = 0;
    }
  };

  const sendLedCommand = (state) => {
    if (hardwareMode === "live" && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      let ledState = "off";
      if (!isCalibrated()) {
        ledState = "blink_fast";
      } else if (state === "healthy") {
        ledState = "off";
      } else if (state === "warning") {
        ledState = "blink_slow";
      } else if (state === "danger") {
        ledState = "red";
      }
      socketRef.current.send(JSON.stringify({ type: "led_command", state: ledState }));
    }
  };

  // Hardware Placeholder Handler
  const handleIoTMessage = (data) => {
    // Expected structure: { chest: 45, face: 42 }
    const result = evaluate(data.chest, data.face);
    setChestDist(Math.round(data.chest));
    setFaceDist(Math.round(data.face));
    setPostureState(result.state);
    setSpineState(result.spineState);
    setNeckState(result.neckState);
    setNeckAngle(result.neckAngle);
    if (result.stretch) setCurrentStretch(result.stretch);
    
    sendLedCommand(result.state);

    // Update logic mirrors simulation below but relies on true data pushes
    // Currently stubbed out waiting for real socket connections.
  };

  useEffect(() => {
    let socket;
    
    // When switching to live mode, establish WebSocket connection
    if (hardwareMode === "live") {
      try {
        // If deployed to a real website (vercel/netlify web), window.location.hostname is the cloud domain.
        // To avoid an immediate Mixed Content crash (ws:// on https://), we wrap it in a try-catch.
        // We connect back to localhost since the Node server is running on the local machine.
        socket = new WebSocket("ws://localhost:8080");
        socketRef.current = socket;
        
        socket.onopen = () => {
          console.log("Connected to hardware WebSocket");
        };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "sensor_reading") {
            // Security: Enforce Device ID matching using Ref to avoid stale closures
            if (data.deviceId !== pairedDeviceIdRef.current) {
              console.warn(`[Security] Ignored data. Expected: ${pairedDeviceIdRef.current}, but saw: ${data.deviceId}`);
              return;
            }

            const result = evaluate(data.chest, data.face);
            setChestDist(data.chest);
            setFaceDist(data.face);
            setPostureState(result.state);
            setSpineState(result.spineState);
            setNeckState(result.neckState);
            setNeckAngle(result.neckAngle);
            if (result.stretch) setCurrentStretch(result.stretch);

            sendLedCommand(result.state);

            if (isTrackingRef.current) {
              processAnalytics(data.chest, result.state);
              setTotalSecs(prev => prev + 3);
              if (result.state !== "healthy") setBadSecs(prev => prev + 3);
              setSessionTotals(prev => ({ ...prev, [result.state]: prev[result.state] + 3 }));
              
              setHistory(prev => {
                const next = [...prev, {
                  time: prev.length * 3,
                  chest: data.chest,
                  face: data.face,
                  state: result.state
                }].slice(-MAX_HISTORY);
                return next;
              });
            }
          }
        } catch(err) {
          console.error("Failed to parse socket payload", err);
        }
      };

      return () => {
        if (socket) socket.close();
      };
    } catch (err) {
      console.error("Mixed content security block on Websocket:", err);
      // Fall back safely without crashing React
      return () => {};
    }
    }

    // SIMULATION MODE
    const interval = setInterval(() => {
      const newChest = 38 + Math.random() * 28;
      const newFace = 36 + Math.random() * 28;
      const result = evaluate(newChest, newFace);
      setChestDist(Math.round(newChest));
      setFaceDist(Math.round(newFace));
      setPostureState(result.state);
      setSpineState(result.spineState);
      setNeckState(result.neckState);
      setNeckAngle(result.neckAngle);
      if (result.stretch) setCurrentStretch(result.stretch);

      sendLedCommand(result.state);

      if (isTrackingRef.current) {
        processAnalytics(newChest, result.state);
        setTotalSecs(prev => prev + 3);
        if (result.state !== "healthy") setBadSecs(prev => prev + 3);
        setSessionTotals(prev => ({ ...prev, [result.state]: prev[result.state] + 3 }));

        setHistory(prev => {
          const next = [...prev, {
            time: prev.length * 3,
            chest: newChest,
            face: newFace,
            state: result.state
          }].slice(-MAX_HISTORY);

          // Insight detection
          const recent = next.slice(-6);
          const badCount = recent.filter(h => h.state !== "healthy").length;
          const trend = next.slice(-3).map(h => h.chest);
          const declining = trend.every((v, i) => i === 0 || v < trend[i - 1]);

          const newInsights = [];
          if (badCount >= 4) newInsights.push({ type: "warn", text: "Frequent forward head posture in last 18s" });
          if (declining) newInsights.push({ type: "danger", text: "Posture worsening rapidly — take a break" });
          const avgChest = next.reduce((s, h) => s + h.chest, 0) / next.length;
          if (avgChest < 47) newInsights.push({ type: "warn", text: "Session avg safely below threshold (50 cm)" });
          if (next.length > 10) {
            const firstHalf = next.slice(0, 5).reduce((s, h) => s + h.chest, 0) / 5;
            const secondHalf = next.slice(-5).reduce((s, h) => s + h.chest, 0) / 5;
            if (secondHalf < firstHalf - 3) newInsights.push({ type: "info", text: "Posture degrades after prolonged sitting window" });
            if (secondHalf > firstHalf + 2) newInsights.push({ type: "ok", text: "Posture organically improved — good adjustment!" });
          }
          setInsights(newInsights.slice(0, 3));
          return next;
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [hardwareMode]);

  const pqs = totalSecs > 0 ? Math.round(100 - (badSecs / totalSecs) * 100) : 100;
  const badPct = totalSecs > 0 ? Math.round((badSecs / totalSecs) * 100) : 0;
  const totalMin = Math.round(totalSecs / 60);
  const badMin = Math.round(badSecs / 60);

  const avgChest = history.length
    ? Math.round(history.reduce((s, h) => s + h.chest, 0) / history.length)
    : 0;

  const avgFace = history.length
    ? Math.round(history.reduce((s, h) => s + h.face, 0) / history.length)
    : 0;

  const strainCounts = history.reduce((acc, h) => {
    const part = getBodyPart(h.state);
    acc[part] = (acc[part] || 0) + 1;
    return acc;
  }, {});
  const mostStrained = Object.entries(strainCounts)
    .filter(([k]) => k !== "None")
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  // Trend: compare first half to second half
  let trend = "stable";
  if (history.length >= 6) {
    const mid = Math.floor(history.length / 2);
    const firstAvg = history.slice(0, mid).reduce((s, h) => s + h.chest, 0) / mid;
    const secondAvg = history.slice(mid).reduce((s, h) => s + h.chest, 0) / (history.length - mid);
    if (secondAvg < firstAvg - 2) trend = "worsening";
    else if (secondAvg > firstAvg + 2) trend = "improving";
  }

  return {
    chestDist, faceDist, postureState, totalMin, badMin,
    pqs, badPct, avgChest, avgFace, mostStrained, trend, history, insights,
    handleIoTMessage, pairedDeviceId, handlePairDevice,
    activeShifts, ttfMinutes, isTracking, startTracking, endSession,
    baseline, neckAngle, spineState, neckState, postureScore: pqs, handleCalibrate,
    sessionTotals, currentStretch
  };
}
