import { collection, addDoc, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "../firebase";

export async function saveSessionToFirebase(sessionData, deviceId) {
  try {
    const docRef = await addDoc(collection(db, "sessions"), {
      deviceId: deviceId || "anonymous",
      date: new Date().toISOString(),
      timestamp: Date.now(), // Useful for ordering
      ...sessionData
    });
    console.log("Session saved to DB with ID: ", docRef.id);
    return true;
  } catch (err) {
    console.error("Failed to write session to Firestore", err);
    return false;
  }
}

export async function getHistoryFromFirebase(deviceId) {
  try {
    const targetDevice = deviceId || "anonymous";
    const q = query(
      collection(db, "sessions"),
      where("deviceId", "==", targetDevice)
    );
    
    const querySnapshot = await getDocs(q);
    const sessions = [];
    querySnapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort oldest to newest for charts, and keep only the last 30
    sessions.sort((a, b) => a.timestamp - b.timestamp);
    if (sessions.length > 30) {
       return sessions.slice(sessions.length - 30);
    }
    return sessions;
  } catch (err) {
    console.error("Failed to read from Firestore", err);
    return [];
  }
}
