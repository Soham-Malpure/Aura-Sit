import { collection, addDoc, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db, auth } from "../firebase";

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
