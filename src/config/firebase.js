// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // import Firestore
import { getAnalytics } from "firebase/analytics";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDIc0BmV1WKvY4Z2FJcY2yT9Q2ib82mnm4",
  authDomain: "level-grit-messagener.firebaseapp.com",
  projectId: "level-grit-messagener",
  storageBucket: "level-grit-messagener.firebasestorage.app",
  messagingSenderId: "1089513508999",
  appId: "1:1089513508999:web:d743cc61faf3d69ff56822",
  measurementId: "G-QJC7G1BZKD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and export it
export const db = getFirestore(app);
