import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Temporarily comment out App Check
// import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyBOBRPzEmsFbrlqUVteVcv7A74SnpsXVqs",
  authDomain: "vitacare-v2.firebaseapp.com",
  projectId: "vitacare-v2",
  storageBucket: "vitacare-v2.firebasestorage.app",
  messagingSenderId: "1014728110624",
  appId: "1:1014728110624:web:ca540cdca26ac1d6118245",
  measurementId: "G-8L0VRRX8KT",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Temporarily disable App Check initialization
// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaEnterpriseProvider(
//     "6Lf9cowrAAAALq2oolE6DLWNzb7YNuhkzjuv2O2"
//   ),
//   isTokenAutoRefreshEnabled: true
// });

export const auth = getAuth(app);
