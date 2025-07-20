// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtlPzcLLCfhwMBcN12zstjsaR3-Tv5Fzs",
  authDomain: "vitacare-de073.firebaseapp.com",
  projectId: "vitacare-de073",
  storageBucket: "vitacare-de073.firebasestorage.app",
  messagingSenderId: "852564741249",
  appId: "1:852564741249:web:6f28499952156d88415180",
  measurementId: "G-HEL3WN0H1S",
};
// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);