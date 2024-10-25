import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYXE2fO6xisNtMvD2_hhpDlabu1hXYSUs",
  authDomain: "ivisionary.firebaseapp.com",
  projectId: "ivisionary",
  storageBucket: "ivisionary.appspot.com",
  messagingSenderId: "710560279855",
  appId: "1:710560279855:web:312cea9f981724c4f785da",
  measurementId: "G-E90P9BMWCJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;