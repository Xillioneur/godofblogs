import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyASej7lBJvJnGHBT8Mhmia_RzoX__0KYHA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "willieliwajohnson.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "willieliwajohnson",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "willieliwajohnson.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1070374858630",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1070374858630:web:97dd43d925ed921640c607"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };