/**
 * Aura-Sit: Hardware Firmware (C++)
 * Platform: NodeMCU ESP8266
 * Sensors: HC-SR04 (Ultrasonic) x2
 * 
 * Instruction: Place this file in your project report as the hardware codebase.
 * It reads distances from the ultrasonic sensors and broadcasts them
 * over WebSockets to be consumed by the React Dashboard.
 */

#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// WebSocket Server IP (The IP of the computer running your React app server if hosting WS there)
// In a cloud architecture, this would safely route to AWS/Firebase or a hosted Node.js server.
const char* ws_host = "192.168.1.100"; 
const uint16_t ws_port = 8080;

WebSocketsClient webSocket;

// Pins for HC-SR04 Sensor 1 (Chest)
const int trigPin1 = D1;
const int echoPin1 = D2;

// Pins for HC-SR04 Sensor 2 (Face)
const int trigPin2 = D3;
const int echoPin2 = D4;

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  if(type == WStype_TEXT) {
    String msg = (char*)payload;
    if(msg == "calibrate") {
      Serial.println("[Command Received] Dashboard requested calibration lock.");
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  pinMode(trigPin1, OUTPUT);
  pinMode(echoPin1, INPUT);
  
  pinMode(trigPin2, OUTPUT);
  pinMode(echoPin2, INPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWi-Fi connected. Starting WebSocket connection...");
  webSocket.begin(ws_host, ws_port, "/");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
}

float measureDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH, 30000); // 30ms timeout for out of range
  if (duration == 0) return 999.0; // Out of bounds
  return duration * 0.034 / 2; // Distance in cm
}

void loop() {
  webSocket.loop();

  // Run measurement every 3 seconds to avoid noise
  static unsigned long lastUpdate = 0;
  if(millis() - lastUpdate > 3000) {
    lastUpdate = millis();
    
    float chestDist = measureDistance(trigPin1, echoPin1);
    float faceDist = measureDistance(trigPin2, echoPin2);
    
    // Construct JSON payload manually (for lightweight memory)
    String jsonPayload = "{\"type\":\"sensor_reading\",\"chest\":";
    jsonPayload += String(chestDist);
    jsonPayload += ",\"face\":";
    jsonPayload += String(faceDist);
    jsonPayload += "}";
    
    // Send to web dashboard
    webSocket.sendTXT(jsonPayload);
    Serial.println("Payload Sent: " + jsonPayload);
  }
}
