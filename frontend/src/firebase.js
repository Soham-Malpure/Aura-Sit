import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0mHXziVShAxja6VNQwgMjQUgap3UXsqg",
  authDomain: "aura-sit.firebaseapp.com",
  projectId: "aura-sit",
  storageBucket: "aura-sit.firebasestorage.app",
  messagingSenderId: "995043629999",
  appId: "1:995043629999:web:8830c3dfe6abb7a0d5ad5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
