import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDmJ41SdpVxPmgkxj4kQEH0rUfkRhcgDrQ",
    authDomain: "serenitime-20a82.firebaseapp.com",
    projectId: "serenitime-20a82",
    storageBucket: "serenitime-20a82.firebasestorage.app",
    messagingSenderId: "798229436880",
    appId: "1:798229436880:web:661f5f7630d01de8a441d5",
    measurementId: "G-EN05CLNCCN"
  };

// Initialize Firebase only if no app is already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default app;
export const db = getFirestore(app);
