import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQIOVwBfMOcFQcoNklvQE-s67aLcq5-tc",
  authDomain: "loose-8a2d8.firebaseapp.com",
  projectId: "loose-8a2d8",
  storageBucket: "loose-8a2d8.appspot.com",
  messagingSenderId: "15109345844",
  appId: "1:15109345844:web:fd902e3cf40fd9894df061",
  measurementId: "G-F9C81KF81K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getFirestore(app);
export const analytics = () => getAnalytics(app);

export default app;