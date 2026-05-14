import { WebSocketServer } from 'ws';
import fs from 'fs';

console.log("=========================================");
console.log("📡 VERTEX Node.js Relay Server INITIALIZED");
console.log("👂 Listening for connections on ws://localhost:8080");
console.log("=========================================");

const wss = new WebSocketServer({ port: 8080 });

// Keep track of all connected clients
const clients = new Set();

wss.on('connection', function connection(ws) {
  clients.add(ws);
  console.log(`[EVENT] New client connected! Total clients: ${clients.size}`);

  ws.on('message', function message(data) {
    const msg = data.toString();
    console.log(`[RAW MESSAGE] Received: ${msg}`);
    fs.writeFileSync('latest_msg.txt', msg + '\n', { flag: 'a' });
    
    // If the message is a JSON payload from the Hardware (ESP8266)
    try {
      const parsed = JSON.parse(msg);
      if (parsed.type === "sensor_reading") {
        // We received real hardware data! Add the Device ID to match the React app expectations
        const hardwareDeviceId = "VERTEX-X792";
        const relayPayload = {
          type: "sensor_reading",
          deviceId: hardwareDeviceId,
          chest: parsed.chest,
          face: parsed.face
        };
        
        // Broadcast this payload to all OTHER connected clients (i.e. the React Dashboard)
        clients.forEach((client) => {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send(JSON.stringify(relayPayload));
          }
        });
        
        // Console log for debugging
        console.log(`[HARDWARE] Relayed data -> Chest: ${parsed.chest}cm, Face: ${parsed.face}cm`);
      } else if (parsed.type === "led_command") {
        // Broadcast this command to all OTHER connected clients (i.e. the ESP8266 Hardware)
        clients.forEach((client) => {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send(msg);
          }
        });
        
        console.log(`[LED] Forwarding command: ${parsed.state} to hardware`);
      }
    } catch (e) {
      // It might not be JSON, check if it's a command from the frontend
      if (msg === "calibrate") {
        console.log("[CMD] Frontend requested calibration lock.");
        // Send calibration acknowledgment back to the frontend
        ws.send(JSON.stringify({ type: "calibration_ack" }));
        
        // Relay calibration command to all other clients (e.g. telling the hardware to calibrate)
        clients.forEach((client) => {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send("calibrate");
          }
        });
      }
    }
  });

  ws.on('close', () => {
    console.log("[EVENT] A client disconnected.");
    clients.delete(ws);
  });
});
