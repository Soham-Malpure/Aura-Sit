import { WebSocketServer } from 'ws';

console.log("=========================================");
console.log("🤖 VIRTUAL NodeMCU ESP8266 INITIALIZED");
console.log("📡 WebSocket Server running on ws://localhost:8080");
console.log("=========================================");

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log("[EVENT] Front-end Client Connected! Beginning sensor payload broadcast.");

  let baseline = 50; // default 50cm
  
  // Listen for frontend commands (e.g., calibration)
  ws.on('message', function message(data) {
    const msg = data.toString();
    if (msg === "calibrate") {
      baseline = 50;
      console.log("[CMD] Client requested calibration. Ultrasonic baseline locked to 50cm.");
      ws.send(JSON.stringify({ type: "calibration_ack" }));
    }
  });

  // Hardware emulation loop (running every 3 seconds)
  const interval = setInterval(() => {
    // Generate realistic hardware noise and physiological shifts
    // Ranges from slouching (38cm) to leaning back (62cm)
    const chest = baseline - 12 + Math.random() * 24; 
    const face = chest - 2 + Math.random() * 4; 
    
    // Hardcode MAC Address / Device ID for pairing testing
    const hardwareDeviceId = "AURA-X792";
    
    const payload = {
      type: "sensor_reading",
      deviceId: hardwareDeviceId,
      chest: Number(chest.toFixed(1)),
      face: Number(face.toFixed(1))
    };

    ws.send(JSON.stringify(payload));
  }, 3000);

  ws.on('close', () => {
    console.log("[EVENT] Client disconnected. Halting broadcast.");
    clearInterval(interval);
  });
});
