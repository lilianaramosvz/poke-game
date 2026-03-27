// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiD6EXLHIb3lWG8N9zSgPmHrIdzkHdZTk",
  authDomain: "poke-game-bced1.firebaseapp.com",
  projectId: "poke-game-bced1",
  storageBucket: "poke-game-bced1.firebasestorage.app",
  messagingSenderId: "953104484880",
  appId: "1:953104484880:web:6f5da76a55f4d030f79895",
  measurementId: "G-88LWB5JCG7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
