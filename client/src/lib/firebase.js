// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCup80ULcoVxwoSzO3b09D81nJL59CnSa4",
  authDomain: "voxbiz--auth.firebaseapp.com",
  projectId: "voxbiz--auth",
  storageBucket: "voxbiz--auth.firebasestorage.app",
  messagingSenderId: "691726393905",
  appId: "1:691726393905:web:216f6332e881019b69eb10",
  measurementId: "G-1WWD8YKLNC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };