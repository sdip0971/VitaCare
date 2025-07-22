// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAnalytics, } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBr-cRzyAgdRnzBfcJPVq3_ZjuI2t4p-mE",
  authDomain: "vitacare-a33f2.firebaseapp.com",
  projectId: "vitacare-a33f2",
  storageBucket: "vitacare-a33f2.firebasestorage.app",
  messagingSenderId: "510808638072",
  appId: "1:510808638072:web:6d1d473218ea533ff1a38d",
  measurementId: "G-WKZYZ39QMC",
};
console.log(firebaseConfig.apiKey)
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
if (typeof window !== "undefined") {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      "6LcmzosrAAAAACfr2qdGEjmFg9zu9dzrpxKw01ze"
    ),
    isTokenAutoRefreshEnabled: true,
  });
}
export const auth = getAuth(app);