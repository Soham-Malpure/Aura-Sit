/*
 * VerteX: Hardware Firmware (C++)
 * Platform: NodeMCU ESP8266
 * Sensors: HC-SR04 (Ultrasonic) x2
 *
 * Instruction: Place this file in your project report as the hardware codebase.
 * It reads distances from the ultrasonic sensors and broadcasts them
 * over WebSockets to be consumed by the React Dashboard.
 */

#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>

const char *ssid = "𝔖𝔥𝔲𝔟𝔥";
const char *password = "Shubham125";

// WebSocket Server IP (The IP of the computer running your React app server if
// hosting WS there) In a cloud architecture, this would safely route to
// AWS/Firebase or a hosted Node.js server.
const char *ws_host = "10.148.233.64";
const uint16_t ws_port = 8080;

WebSocketsClient webSocket;

// Pins for HC-SR04 Sensor 1 (Chest)
const int trigPin1 = D1;
const int echoPin1 = D2;

// Pins for HC-SR04 Sensor 2 (Face)
const int trigPin2 = D3;
const int echoPin2 = D4;

// LED Pin Setup (Using D5 since D4 is used by Face Sensor)
const int LED_PIN = D5;
int ledBlinkMode = 0; // 0 = Solid/Off, 1 = Slow, 2 = Fast
unsigned long blinkInterval = 0;
bool currentLedState = false;

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  if (type == WStype_TEXT) {
    String msg = (char *)payload;
    if (msg == "calibrate") {
      Serial.println(
          "[Command Received] Dashboard requested calibration lock.");
    } else if (msg.indexOf("\"led_command\"") >= 0) {
      if (msg.indexOf("\"red\"") >= 0) {
        ledBlinkMode = 0;
        digitalWrite(LED_PIN, HIGH);
      } else if (msg.indexOf("\"off\"") >= 0) {
        ledBlinkMode = 0;
        digitalWrite(LED_PIN, LOW);
      } else if (msg.indexOf("\"blink_slow\"") >= 0) {
        ledBlinkMode = 1;
        blinkInterval = 1000;
      } else if (msg.indexOf("\"blink_fast\"") >= 0) {
        ledBlinkMode = 2;
        blinkInterval = 250;
      }
    }
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(trigPin1, OUTPUT);
  pinMode(echoPin1, INPUT);

  pinMode(trigPin2, OUTPUT);
  pinMode(echoPin2, INPUT);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // Explicitly set as Wi-Fi client and clear old connections
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);

  Serial.println();
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWi-Fi connected successfully!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    
    Serial.println("Starting WebSocket connection...");
    webSocket.begin(ws_host, ws_port, "/");
    webSocket.onEvent(webSocketEvent);
    webSocket.setReconnectInterval(5000);
  } else {
    Serial.println("\n[ERROR] Wi-Fi Connection FAILED.");
    Serial.println("1. Check if hotspot is exactly 'S'");
    Serial.println("2. Check if password is exactly '12345678'");
    Serial.println("3. Ensure hotspot is 2.4GHz (Turn on 'Maximize Compatibility' on iPhone)");
  }
}

float measureDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Removed noInterrupts() as it can cause instability on some ESP8266 boards.
  // 25000us timeout = ~4.2 meters max range. Prevents long hangs.
  long duration = pulseIn(echoPin, HIGH, 25000); 
  
  if (duration == 0)
    return 999.0;              // Out of bounds
  return duration * 0.0343 / 2.0; // Distance in cm
}

// Advanced Noise Filter: Drops invalid pings entirely
float getSmoothDistance(int trigPin, int echoPin, float fallbackValue, String sensorName) {
  const int targetSamples = 5; 
  const int maxAttempts = 10; 
  float samples[maxAttempts];
  int validCount = 0;

  Serial.print("[" + sensorName + " Raw] ");

  for (int i = 0; i < maxAttempts; i++) {
    float dist = measureDistance(trigPin, echoPin);
    Serial.print(dist); Serial.print(", ");

    // Only accept realistic human sitting distances (e.g., 2cm to 200cm)
    if (dist > 2.0 && dist < 200.0) {
      samples[validCount] = dist;
      validCount++;
    }

    if (validCount >= targetSamples)
      break;
      
    delay(40); // Short delay between pings
  }
  Serial.println(); // End raw line

  // If sensor is totally blocked or malfunctioning, keep previous value
  if (validCount == 0) {
    Serial.println("   -> [WARN] No valid samples! Using fallback: " + String(fallbackValue));
    return fallbackValue;
  }

  // Sort valid samples (Bubble Sort)
  for (int i = 0; i < validCount - 1; i++) {
    for (int j = i + 1; j < validCount; j++) {
      if (samples[i] > samples[j]) {
        float temp = samples[i];
        samples[i] = samples[j];
        samples[j] = temp;
      }
    }
  }

  float finalVal = 0;
  // If we have at least 3 samples, average the middle ones
  if (validCount >= 3) {
    int mid = validCount / 2;
    finalVal = (samples[mid - 1] + samples[mid] + samples[mid + 1]) / 3.0;
  } else {
    // Otherwise just use the median of whatever we got
    finalVal = samples[validCount / 2];
  }
  
  Serial.println("   -> Smoothed: " + String(finalVal));
  return finalVal;
}

// Keep track of the last good readings
float lastChestDist = 50.0;
float lastFaceDist = 50.0;

void loop() {
  webSocket.loop();

  // LED Blinking Logic (Non-blocking)
  if (ledBlinkMode > 0) {
    static unsigned long lastBlinkTime = 0;
    if (millis() - lastBlinkTime >= blinkInterval) {
      lastBlinkTime = millis();
      currentLedState = !currentLedState;
      digitalWrite(LED_PIN, currentLedState ? HIGH : LOW);
    }
  }

  static unsigned long lastUpdate = 0;
  if (millis() - lastUpdate > 3000) {
    lastUpdate = millis();

    // Get Chest Distance
    lastChestDist = getSmoothDistance(trigPin1, echoPin1, lastChestDist, "Chest");

    // --- CROSSTALK PREVENTION ---
    delay(100); // 100ms is usually enough to prevent crosstalk

    // Get Face Distance
    lastFaceDist = getSmoothDistance(trigPin2, echoPin2, lastFaceDist, "Face");

    // Construct JSON payload manually (for lightweight memory)
    String jsonPayload = "{\"type\":\"sensor_reading\",\"chest\":";
    jsonPayload += String(lastChestDist);
    jsonPayload += ",\"face\":";
    jsonPayload += String(lastFaceDist);
    jsonPayload += "}";

    // Send to web dashboard
    webSocket.sendTXT(jsonPayload);
    Serial.println("Payload Sent: " + jsonPayload);
  }
}
