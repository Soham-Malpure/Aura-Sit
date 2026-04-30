import { collection, addDoc, getDocs, query, orderBy, limit, where, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";

/**
 * Saves a completed session to Firebase.
 * 
 * @param {Object} sessionData - The telemetry data for the session.
 * @param {number} sessionData.pqs - number 0-100
 * @param {number} sessionData.totalSecs - total session seconds
 * @param {number} sessionData.badSecs - seconds in warning + danger
 * @param {number} sessionData.avgChest - average chest distance over session
 * @param {number} sessionData.avgNeckAngle - average neck angle over session (new in Version A)
 * @param {string} sessionData.mostStrained - "Lumbar Spine" | "Cervical Spine" | "None"
 * @param {string} sessionData.trend - "improving" | "worsening" | "stable"
 * @param {number} sessionData.activeShifts - number of healthy posture micro-adjustments
 * @param {number} sessionData.ttfMinutes - time-to-fatigue in minutes
 * @param {string} deviceId - The hardware device ID
 */
export async function saveSessionToFirebase(sessionData, deviceId) {
  try {
    const user = auth.currentUser;
    const uid = user ? user.uid : "anonymous";
    const targetDevice = deviceId || "anonymous";

    const docRef = await addDoc(collection(db, "sessions"), {
      uid: uid,
      deviceId: targetDevice,
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
    const user = auth.currentUser;
    const uid = user ? user.uid : "anonymous";
    const targetDevice = deviceId || "anonymous";
    
    let q;
    // If a user is logged in, grab all *their* data privately, no matter the device
    if (user) {
      q = query(
        collection(db, "sessions"),
        where("uid", "==", uid)
      );
    } else {
      // Fallback for public shared devices if unauthenticated
      q = query(
        collection(db, "sessions"),
        where("deviceId", "==", targetDevice)
      );
    }
    
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

export async function clearHistoryFromFirebase(deviceId) {
  try {
    const user = auth.currentUser;
    const uid = user ? user.uid : "anonymous";
    const targetDevice = deviceId || "anonymous";
    
    let q;
    if (user) {
      q = query(collection(db, "sessions"), where("uid", "==", uid));
    } else {
      q = query(collection(db, "sessions"), where("deviceId", "==", targetDevice));
    }
    
    const querySnapshot = await getDocs(q);
    const deletePromises = [];
    querySnapshot.forEach((document) => {
      deletePromises.push(deleteDoc(doc(db, "sessions", document.id)));
    });
    
    await Promise.all(deletePromises);
    console.log(`Deleted ${deletePromises.length} sessions from DB`);
    return true;
  } catch (err) {
    console.error("Failed to clear history from Firestore", err);
    return false;
  }
}
